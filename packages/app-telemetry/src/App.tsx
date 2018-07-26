import * as React from 'react';
import { Types } from '../../app-telemetry-common/src';
import {
  Chains,
  Chain,
  Ago,
  OfflineIndicator
} from './components';
import { Connection } from './Connection';
import { State } from './state';

import './App.css';

export default class App extends React.Component<{}, State> {
  public state: State = {
    status: 'offline',
    best: 0 as Types.BlockNumber,
    blockTimestamp: 0 as Types.Timestamp,
    blockAverage: null,
    timeDiff: 0 as Types.Milliseconds,
    subscribed: null,
    chains: new Map(),
    nodes: new Map()
  };

  private connection: Promise<Connection>;

  constructor (props: {}) {
    super(props);

    this.connection = Connection.create((changes) => {
      if (changes) {
        this.setState(changes);
      }

      return this.state;
    });
  }

  public render () {
    const { chains, timeDiff, subscribed, status } = this.state;

    Ago.timeDiff = timeDiff;

    if (chains.size === 0) {
      return (
        <div className='App App-no-telemetry'>
          <OfflineIndicator status={status} />
          Waiting for telemetry data...
        </div>
      );
    }

    return (
      <div className='App'>
        <OfflineIndicator status={status} />
        <Chains chains={chains} subscribed={subscribed} connection={this.connection} />
        <Chain appState={this.state} />
      </div>
    );
  }

  public componentWillMount () {
    window.addEventListener('keydown', this.onKeyPress);
  }

  public componentWillUnmount () {
    window.removeEventListener('keydown', this.onKeyPress);
  }

  private onKeyPress = (event: KeyboardEvent) => {
    if (event.keyCode !== 9) { // TAB KEY
      return;
    }

    event.preventDefault();

    const { subscribed } = this.state;
    const chains = Array.from(this.state.chains.keys());

    let index = 0;

    if (subscribed) {
      index = (chains.indexOf(subscribed) + 1) % chains.length;

      // Do nothing if it's the same chain
      if (chains[index] === subscribed) {
        return;
      }
    }

    this.connection.then((connection) => {
      connection.subscribe(chains[index]);
    });
  }
}
