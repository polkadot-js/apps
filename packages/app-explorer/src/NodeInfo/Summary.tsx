// Copyright 2017-2019 @polkadot/app-nodeinfo authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/react-components/types';
import { Info } from './types';

import BN from 'bn.js';
import React, { useState, useEffect } from 'react';
import { SummaryBox, CardSummary } from '@polkadot/react-components';
import { formatNumber } from '@polkadot/util';
import { BestNumber, Elapsed } from '@polkadot/react-query';

import translate from './translate';

interface Props extends I18nProps {
  nextRefresh: number;
  info: Info;
}

const ZERO = new BN(0);
const EMPTY_INFO = { extrinsics: null, health: null, peers: null };

function Summary ({ info: { extrinsics, health, peers } = EMPTY_INFO, nextRefresh, t }: Props): React.ReactElement<Props> {
  const [peerBest, setPeerBest] = useState(ZERO);

  useEffect((): void => {
    if (!peers) {
      return;
    }

    const bestPeer = peers.sort((a, b): number => b.bestNumber.cmp(a.bestNumber))[0];

    setPeerBest(
      bestPeer
        ? bestPeer.bestNumber
        : new BN(0)
    );
  }, [peers]);

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
            health
              ? `${health.peers.toNumber()}`
              : '-'
          }
        </CardSummary>
        <CardSummary
          className='ui--media-small'
          label={t('syncing')}
        >
          {
            health
              ? (
                health.isSyncing.valueOf()
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
            extrinsics
              ? `${extrinsics.length}`
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

export default translate(Summary);
