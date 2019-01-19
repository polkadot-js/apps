// Copyright 2017-2019 @polkadot/app-nodeinfo authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiProps } from '@polkadot/ui-api/types';
import { AppProps } from '@polkadot/ui-app/types';
import { Info } from './types';

import React from 'react';
import { withApi } from '@polkadot/ui-api/index';
import { Health, PeerInfo, PendingExtrinsics } from '@polkadot/types';

import './index.css';

import Peers from './Peers';
import Pending from './Pending';
import Summary from './Summary';

const POLL_TIMEOUT = 10000;

type Props = ApiProps & AppProps;

type State = {
  info?: Info,
  timerId?: number;
};

class App extends React.PureComponent<Props, State> {
  private isActive: boolean = true;
  state: State = {};

  componentDidMount () {
    this.getStatus().catch(() => {
      // ignore
    });
  }

  componentWillUnmount () {
    const { timerId } = this.state;

    this.isActive = false;

    if (timerId) {
      window.clearTimeout(timerId);
    }
  }

  private setInfo (info?: Info) {
    if (!this.isActive) {
      return;
    }

    this.setState({
      info,
      timerId: window.setTimeout(this.getStatus, POLL_TIMEOUT)
    });
  }

  private getStatus = async () => {
    const { api } = this.props;

    try {
      const [health, peers, extrinsics] = await Promise.all([
        api.rpc.system.health() as Promise<Health>,
        api.rpc.system.peers() as any as Promise<Array<PeerInfo>>,
        api.rpc.author.pendingExtrinsics() as Promise<PendingExtrinsics>
      ]);

      this.setInfo({ extrinsics, health, peers });
    } catch (error) {
      this.setInfo();
    }
  }

  render () {
    const { info = {} } = this.state;

    return (
      <main className='status--App'>
        <Summary info={info} />
        <Peers peers={info.peers} />
        <Pending extrinsics={info.extrinsics} />
      </main>
    );
  }
}

export default withApi(App);
