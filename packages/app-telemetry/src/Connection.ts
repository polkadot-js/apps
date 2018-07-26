import { VERSION, timestamp, FeedMessage, Types, Maybe, sleep } from '../../app-telemetry-common/src';
import { State, Update } from './state';

const { Actions } = FeedMessage;

const TIMEOUT_BASE = (1000 * 5) as Types.Milliseconds; // 5 seconds
const TIMEOUT_MAX = (1000 * 60 * 5) as Types.Milliseconds; // 5 minutes

export class Connection {
  public static async create (update: Update): Promise<Connection> {
    return new Connection(await Connection.socket(), update);
  }

  private static readonly address = window.location.protocol === 'https:'
                                      ? `wss://${window.location.hostname}/feed/`
                                      : `ws://${window.location.hostname}:8080`;

  // private static readonly address = 'wss://telemetry.polkadot.io/feed/';

  private static async socket (): Promise<WebSocket> {
    let socket = await Connection.trySocket();
    let timeout = TIMEOUT_BASE;

    while (!socket) {
      await sleep(timeout);

      timeout = Math.max(timeout * 2, TIMEOUT_MAX) as Types.Milliseconds;
      socket = await Connection.trySocket();
    }

    return socket;
  }

  private static async trySocket (): Promise<Maybe<WebSocket>> {
    return new Promise<Maybe<WebSocket>>((resolve, _) => {
      function clean () {
        socket.removeEventListener('open', onSuccess);
        socket.removeEventListener('close', onFailure);
        socket.removeEventListener('error', onFailure);
      }

      function onSuccess () {
        clean();
        resolve(socket);
      }

      function onFailure () {
        clean();
        resolve(null);
      }

      const socket = new WebSocket(Connection.address);

      socket.addEventListener('open', onSuccess);
      socket.addEventListener('error', onFailure);
      socket.addEventListener('close', onFailure);
    });
  }

  private pingId = 0;
  private pingTimeout!: NodeJS.Timer;
  private pingSent: Maybe<Types.Timestamp> = null;
  private socket: WebSocket;
  private state!: Readonly<State>;
  private readonly update: Update;

  constructor (socket: WebSocket, update: Update) {
    this.socket = socket;
    this.update = update;
    this.bindSocket();
  }

  public subscribe (chain: Types.ChainLabel) {
    this.socket.send(`subscribe:${chain}`);
  }

  private bindSocket () {
    this.ping();

    this.state = this.update({
      status: 'online',
      nodes: new Map()
    });

    // Re-subscribe to previously selected chain
    if (this.state.subscribed) {
      // TODO: Remember the previous subscription for after we get chain info
      this.state = this.update({ subscribed: null });
    }

    this.socket.addEventListener('message', this.handleMessages);
    this.socket.addEventListener('close', this.handleDisconnect);
    this.socket.addEventListener('error', this.handleDisconnect);
  }

  private ping = () => {
    if (this.pingSent) {
      this.handleDisconnect();
      return;
    }

    this.pingId += 1;
    this.pingSent = timestamp();
    this.socket.send(`ping:${this.pingId}`);
  }

  private pong (id: number) {
    if (!this.pingSent) {
      console.error('Received a pong without sending a ping first');

      this.handleDisconnect();
      return;
    }

    if (id !== this.pingId) {
      console.error('pingId differs');

      this.handleDisconnect();
    }

    const latency = timestamp() - this.pingSent;
    this.pingSent = null;

    console.log('latency', latency);

    this.pingTimeout = setTimeout(this.ping, 30000);
  }

  private clean () {
    clearTimeout(this.pingTimeout);

    this.socket.removeEventListener('message', this.handleMessages);
    this.socket.removeEventListener('close', this.handleDisconnect);
    this.socket.removeEventListener('error', this.handleDisconnect);
  }

  private handleMessages = (event: MessageEvent) => {
    const data = event.data as FeedMessage.Data;
    const nodes = this.state.nodes;
    const chains = this.state.chains;
    const changes = { nodes, chains };

    messages: for (const message of FeedMessage.deserialize(data)) {
      switch (message.action) {
        case Actions.FeedVersion: {
          if (message.payload !== VERSION) {
            this.state = this.update({ status: 'upgrade-requested' });
            this.clean();

            // Force reload from the server
            setTimeout(() => window.location.reload(true), 3000);

            return;
          }

          continue messages;
        }

        case Actions.BestBlock: {
          const [best, blockTimestamp, blockAverage] = message.payload;

          nodes.forEach((node) => node.blockDetails[4] = null);

          this.state = this.update({ best, blockTimestamp, blockAverage });

          continue messages;
        }

        case Actions.AddedNode: {
          const [id, nodeDetails, nodeStats, blockDetails, location] = message.payload;
          const node = { id, nodeDetails, nodeStats, blockDetails, location };

          nodes.set(id, node);

          break;
        }

        case Actions.RemovedNode: {
          nodes.delete(message.payload);

          break;
        }

        case Actions.LocatedNode: {
          const [id, latitude, longitude, city] = message.payload;
          const node = nodes.get(id);

          if (!node) {
            return;
          }

          node.location = [latitude, longitude, city];

          break;
        }

        case Actions.ImportedBlock: {
          const [id, blockDetails] = message.payload;
          const node = nodes.get(id);

          if (!node) {
            return;
          }

          node.blockDetails = blockDetails;

          break;
        }

        case Actions.NodeStats: {
          const [id, nodeStats] = message.payload;
          const node = nodes.get(id);

          if (!node) {
            return;
          }

          node.nodeStats = nodeStats;

          break;
        }

        case Actions.TimeSync: {
          this.state = this.update({
            timeDiff: (timestamp() - message.payload) as Types.Milliseconds
          });

          continue messages;
        }

        case Actions.AddedChain: {
          const [label, nodeCount] = message.payload;
          chains.set(label, nodeCount);

          break;
        }

        case Actions.RemovedChain: {
          chains.delete(message.payload);

          if (this.state.subscribed === message.payload) {
            nodes.clear();

            this.state = this.update({ subscribed: null, nodes, chains });

            continue messages;
          }

          break;
        }

        case Actions.SubscribedTo: {
          this.state = this.update({ subscribed: message.payload });

          continue messages;
        }

        case Actions.UnsubscribedFrom: {
          if (this.state.subscribed === message.payload) {
            nodes.clear();
            this.state = this.update({ subscribed: null, nodes });
          }

          continue messages;
        }

        case Actions.Pong: {
          this.pong(Number(message.payload));

          continue messages;
        }

        default: {
          continue messages;
        }
      }
    }

    this.state = this.update(changes);

    this.autoSubscribe();
  }

  private autoSubscribe () {
    const { subscribed, chains } = this.state;

    if (subscribed) {
      return;
    }

    let topLabel: Maybe<Types.ChainLabel> = null;
    let topCount: Types.NodeCount = 0 as Types.NodeCount;

    for (const [label, count] of chains.entries()) {
      if (count > topCount) {
        topLabel = label;
        topCount = count;
      }
    }

    if (topLabel) {
      this.subscribe(topLabel);
    }
  }

  private handleDisconnect = async () => {
    this.state = this.update({ status: 'offline' });
    this.clean();
    this.socket.close();
    this.socket = await Connection.socket();
    this.bindSocket();
  }
}
