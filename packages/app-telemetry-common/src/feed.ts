import { Opaque, Maybe } from './helpers';
import {
  FeedVersion,
  Latitude,
  Longitude,
  City,
  NodeId,
  NodeCount,
  NodeDetails,
  NodeStats,
  NodeLocation,
  BlockNumber,
  BlockDetails,
  Timestamp,
  Milliseconds,
  ChainLabel
} from './types';

export const Actions = {
  FeedVersion      : 0x00 as 0x00,
  BestBlock        : 0x01 as 0x01,
  AddedNode        : 0x02 as 0x02,
  RemovedNode      : 0x03 as 0x03,
  LocatedNode      : 0x04 as 0x04,
  ImportedBlock    : 0x05 as 0x05,
  NodeStats        : 0x06 as 0x06,
  TimeSync         : 0x07 as 0x07,
  AddedChain       : 0x08 as 0x08,
  RemovedChain     : 0x09 as 0x09,
  SubscribedTo     : 0x0A as 0x0A,
  UnsubscribedFrom : 0x0B as 0x0B,
  Pong             : 0x0C as 0x0C,
};

export type Action = typeof Actions[keyof typeof Actions];
export type Payload = Message['payload'];

export interface MessageBase {
  action: Action;
}

export interface FeedVersionMessage extends MessageBase {
  action: typeof Actions.FeedVersion;
  payload: FeedVersion;
}

export interface BestBlockMessage extends MessageBase {
  action: typeof Actions.BestBlock;
  payload: [BlockNumber, Timestamp, Maybe<Milliseconds>];
}

export interface AddedNodeMessage extends MessageBase {
  action: typeof Actions.AddedNode;
  payload: [NodeId, NodeDetails, NodeStats, BlockDetails, Maybe<NodeLocation>];
}

export interface RemovedNodeMessage extends MessageBase {
  action: typeof Actions.RemovedNode;
  payload: NodeId;
}

export interface LocatedNodeMessage extends MessageBase {
  action: typeof Actions.LocatedNode;
  payload: [NodeId, Latitude, Longitude, City];
}

export interface ImportedBlockMessage extends MessageBase {
  action: typeof Actions.ImportedBlock;
  payload: [NodeId, BlockDetails];
}

export interface NodeStatsMessage extends MessageBase {
  action: typeof Actions.NodeStats;
  payload: [NodeId, NodeStats];
}

export interface TimeSyncMessage extends MessageBase {
  action: typeof Actions.TimeSync;
  payload: Timestamp;
}

export interface AddedChainMessage extends MessageBase {
  action: typeof Actions.AddedChain;
  payload: [ChainLabel, NodeCount];
}

export interface RemovedChainMessage extends MessageBase {
  action: typeof Actions.RemovedChain;
  payload: ChainLabel;
}

export interface SubscribedToMessage extends MessageBase {
  action: typeof Actions.SubscribedTo;
  payload: ChainLabel;
}

export interface UnsubscribedFromMessage extends MessageBase {
  action: typeof Actions.UnsubscribedFrom;
  payload: ChainLabel;
}

export interface PongMessage extends MessageBase {
  action: typeof Actions.Pong;
  payload: string; // just echo whatever `ping` sent
}

export interface Variants {
  MessageBase: MessageBase;
}

export type Message =
  | FeedVersionMessage
  | BestBlockMessage
  | AddedNodeMessage
  | RemovedNodeMessage
  | LocatedNodeMessage
  | ImportedBlockMessage
  | NodeStatsMessage
  | TimeSyncMessage
  | AddedChainMessage
  | RemovedChainMessage
  | SubscribedToMessage
  | UnsubscribedFromMessage
  | PongMessage;

/**
 * Opaque data type to be sent to the feed. Passing through
 * strings means we can only serialize once, no matter how
 * many feed clients are listening in.
 */
export type Data = Opaque<string, 'FeedMessage.Data'>;

/**
 * Serialize an array of `Message`s to a single JSON string.
 *
 * All messages are squashed into a single array of alternating opcodes and payloads.
 *
 * Action `string`s are converted to opcodes using the `actionToCode` mapping.
 */
export function serialize(messages: Array<Message>): Data {
  const squashed = new Array(messages.length * 2);
  let index = 0;

  messages.forEach((message) => {
    const { action, payload } = message;

    squashed[index++] = action;
    squashed[index++] = payload;
  })

  return JSON.stringify(squashed) as Data;
}

/**
 * Deserialize data to an array of `Message`s.
 */
export function deserialize(data: Data): Array<Message> {
  const json: Array<Action | Payload> = JSON.parse(data);

  if (!Array.isArray(json) || json.length === 0 || json.length % 2 !== 0) {
    throw new Error('Invalid FeedMessage.Data');
  }

  const messages: Array<Message> = new Array(json.length / 2);

  for (const index of messages.keys()) {
    const [ action, payload ] = json.slice(index * 2);

    messages[index] = { action, payload } as Message;
  }

  return messages;
}
