// Copyright 2017-2019 @polkadot/app-nodeinfo authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Health, PeerInfo, Extrinsic } from '@polkadot/types/interfaces';
import { ApiProps } from '@polkadot/ui-api/types';
import { AppProps, I18nProps } from '@polkadot/ui-app/types';
import { Info } from './types';

import React from 'react';
import { withApi, withMulti } from '@polkadot/ui-api';
import { Vec } from '@polkadot/types';

import './index.css';

import Extrinsics from '../BlockInfo/Extrinsics';
import Peers from './Peers';
import Summary from './Summary';
import translate from './translate';

const POLL_TIMEOUT = 9900;

type Props = ApiProps & AppProps & I18nProps;

interface State {
  info?: Info;
  nextRefresh: number;
  timerId?: number;
}

class App extends React.PureComponent<Props, State> {
  private isActive: boolean = true;

  public state: State = {
    nextRefresh: Date.now()
  };

  public componentDidMount (): void {
    this.getStatus().catch((): void => {
      // ignore
    });
  }

  public componentWillUnmount (): void {
    const { timerId } = this.state;

    this.isActive = false;

    if (timerId) {
      window.clearTimeout(timerId);
    }
  }

  public render (): React.ReactNode {
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
          blockNumber={info.blockNumber}
          label={t('pending extrinsics')}
          value={info.extrinsics}
        />
      </>
    );
  }

  private setInfo (info?: Info): void {
    if (!this.isActive) {
      return;
    }

    this.setState({
      info,
      nextRefresh: (Date.now() + POLL_TIMEOUT),
      timerId: window.setTimeout(this.getStatus, POLL_TIMEOUT)
    });
  }

  private getStatus = async (): Promise<void> => {
    const { api } = this.props;

    try {
      const [blockNumber, health, peers, extrinsics] = await Promise.all([
        api.derive.chain.bestNumber(),
        api.rpc.system.health<Health>(),
        api.rpc.system.peers<Vec<PeerInfo>>(),
        api.rpc.author.pendingExtrinsics<Vec<Extrinsic>>()
      ]);

      this.setInfo({ blockNumber, extrinsics, health, peers });
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
