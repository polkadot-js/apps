// Copyright 2017-2020 @polkadot/app-nodeinfo authors & contributors
// SPDX-License-Identifier: Apache-2.0

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
        {health && (
          <>
            <CardSummary
              className='media--800'
              label={t<string>('total peers')}
            >
              {formatNumber(health.peers)}
            </CardSummary>
            <CardSummary
              className='media--800'
              label={t<string>('syncing')}
            >
              {health.isSyncing.valueOf()
                ? t<string>('yes')
                : t<string>('no')
              }
            </CardSummary>
          </>
        )}
      </section>
      {extrinsics && (extrinsics.length > 0) && (
        <section className='media--1200'>
          <CardSummary label={t<string>('queued tx')}>
            {extrinsics.length}
          </CardSummary>
        </section>
      )}
      <section>
        {peerBest?.gtn(0) && (
          <CardSummary label={t<string>('peer best')}>
            {formatNumber(peerBest)}
          </CardSummary>
        )}
        <CardSummary label={t<string>('our best')}>
          <BestNumber />
        </CardSummary>
      </section>
    </SummaryBox>
  );
}

export default React.memo(Summary);
