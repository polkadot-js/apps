// Copyright 2017-2019 @polkadot/app-nodeinfo authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';
import { Info } from './types';

import BN from 'bn.js';
import React from 'react';
import { CardSummary } from '@polkadot/ui-app/index';
import { BestNumber, Elapsed } from '@polkadot/ui-reactive/index';
import { numberFormat } from '@polkadot/ui-reactive/util';

import translate from './translate';

type Props = I18nProps & {
  nextRefresh: number;
  info: Info;
};

type State = {
  peerBest?: BN
};

class Summary extends React.PureComponent<Props, State> {
  state: State = {};

  static getDerivedStateFromProps ({ info = {} }: Props): State | null {
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

  render () {
    const { info = {}, nextRefresh, t } = this.props;
    const { peerBest } = this.state;

    return (
      <summary>
        <section>
          <CardSummary label={t('refresh in')}>
            <Elapsed value={nextRefresh} />
          </CardSummary>
          <CardSummary label={t('total peers')}>
            {
              info.health
                ? `${info.health.peers.toNumber()}`
                : '-'
            }
          </CardSummary>
          <CardSummary label={t('syncing')}>
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
        <section>
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
            {numberFormat(peerBest)}
          </CardSummary>
          <CardSummary label={t('our best')}>
            <BestNumber />
          </CardSummary>
        </section>
      </summary>
    );
  }
}

export default translate(Summary);
