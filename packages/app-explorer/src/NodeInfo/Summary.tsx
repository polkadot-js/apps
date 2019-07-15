// Copyright 2017-2019 @polkadot/app-nodeinfo authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';
import { Info } from './types';

import BN from 'bn.js';
import React from 'react';
import { SummaryBox, CardSummary } from '@polkadot/ui-app';
import { formatNumber } from '@polkadot/util';
import { BestNumber, Elapsed } from '@polkadot/ui-reactive';

import translate from './translate';

interface Props extends I18nProps {
  nextRefresh: number;
  info: Info;
}

interface State {
  peerBest?: BN;
}

class Summary extends React.PureComponent<Props, State> {
  public state: State = {};

  public static getDerivedStateFromProps ({ info = {} }: Props): State | null {
    if (!info.peers) {
      return null;
    }

    const bestPeer = info.peers.sort((a, b) => b.bestNumber.cmp(a.bestNumber))[0];

    return {
      peerBest: bestPeer
        ? bestPeer.bestNumber
        : new BN(0)
    };
  }

  public render (): React.ReactNode {
    const { info = {}, nextRefresh, t } = this.props;
    const { peerBest } = this.state;

    return (
      <SummaryBox>
        <section>
          <CardSummary label={t('refresh in')}>
            <Elapsed value={nextRefresh} />
          </CardSummary>
          <CardSummary
            className='ui--media-small'
            label={t('total peers')}
          >
            {
              info.health
                ? `${info.health.peers.toNumber()}`
                : '-'
            }
          </CardSummary>
          <CardSummary
            className='ui--media-small'
            label={t('syncing')}
          >
            {
              info.health
                ? (
                  info.health.isSyncing.valueOf()
                    ? t('yes')
                    : t('no')
                )
                : '-'
            }
          </CardSummary>
        </section>
        <section className='ui--media-large'>
          <CardSummary label={t('queued tx')}>
            {
              info.extrinsics
                ? `${info.extrinsics.length}`
                : '-'
            }
          </CardSummary>
        </section>
        <section>
          <CardSummary label={t('peer best')}>
            {formatNumber(peerBest)}
          </CardSummary>
          <CardSummary label={t('our best')}>
            <BestNumber />
          </CardSummary>
        </section>
      </SummaryBox>
    );
  }
}

export default translate(Summary);
