// Copyright 2017-2020 @polkadot/app-nodeinfo authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Info } from './types';

import React, { useState, useEffect } from 'react';
import { SummaryBox, CardSummary } from '@polkadot/react-components';
import { BestNumber, Elapsed } from '@polkadot/react-query';
import { BN_ZERO, formatNumber } from '@polkadot/util';

import { useTranslation } from '../translate';

interface Props {
  nextRefresh: number;
  info: Info;
}

const EMPTY_INFO = { extrinsics: null, health: null, peers: null };

function Summary ({ info: { extrinsics, health, peers } = EMPTY_INFO, nextRefresh }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [peerBest, setPeerBest] = useState(BN_ZERO);

  useEffect((): void => {
    if (peers) {
      const bestPeer = peers.sort((a, b): number => b.bestNumber.cmp(a.bestNumber))[0];

      setPeerBest(
        bestPeer
          ? bestPeer.bestNumber
          : BN_ZERO
      );
    }
  }, [peers]);

  return (
    <SummaryBox>
      <section>
        <CardSummary label={t<string>('refresh in')}>
          <Elapsed value={nextRefresh} />
        </CardSummary>
        <CardSummary
          className='ui--media-small'
          label={t<string>('total peers')}
        >
          {
            health
              ? `${health.peers.toNumber()}`
              : '-'
          }
        </CardSummary>
        <CardSummary
          className='ui--media-small'
          label={t<string>('syncing')}
        >
          {
            health
              ? (
                health.isSyncing.valueOf()
                  ? t<string>('yes')
                  : t<string>('no')
              )
              : '-'
          }
        </CardSummary>
      </section>
      <section className='ui--media-large'>
        <CardSummary label={t<string>('queued tx')}>
          {
            extrinsics
              ? `${extrinsics.length}`
              : '-'
          }
        </CardSummary>
      </section>
      <section>
        <CardSummary label={t<string>('peer best')}>
          {formatNumber(peerBest)}
        </CardSummary>
        <CardSummary label={t<string>('our best')}>
          <BestNumber />
        </CardSummary>
      </section>
    </SummaryBox>
  );
}

export default React.memo(Summary);
