// Copyright 2017-2019 @polkadot/app-nodeinfo authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiProps } from '@polkadot/ui-api/types';
import { AppProps, I18nProps } from '@polkadot/ui-app/types';
import { Info } from './types';

import React from 'react';
import { withApi, withMulti } from '@polkadot/ui-api/index';
import { Health, PeerInfo, PendingExtrinsics } from '@polkadot/types';

import './index.css';

import Extrinsics from '../BlockQuery/Extrinsics';
import Peers from './Peers';
import Summary from './Summary';
import translate from './translate';

const POLL_TIMEOUT = 9900;

type Props = ApiProps & AppProps & I18nProps;

type State = {
  info?: Info,
  nextRefresh: number,
  timerId?: number;
};

class App extends React.PureComponent<Props, State> {
  private isActive: boolean = true;
  state: State = {
    nextRefresh: Date.now()
  };

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

  render () {
    const { t } = this.props;
    const { info = {}, nextRefresh } = this.state;

    return (
      <>
        <Summary
          info={info}
          nextRefresh={nextRefresh}
        />
        <Peers peers={info.peers} />
        <Extrinsics
          label={t('pending extrinsics')}
          value={info.extrinsics}
        />
      </>
    );
  }

  private setInfo (info?: Info) {
    if (!this.isActive) {
      return;
    }

    this.setState({
      info,
      nextRefresh: (Date.now() + POLL_TIMEOUT),
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
}

export default withMulti(
  App,
  translate,
  withApi
);
