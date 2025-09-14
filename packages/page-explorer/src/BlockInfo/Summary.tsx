// Copyright 2017-2025 @polkadot/app-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { KeyedEvent } from '@polkadot/react-hooks/ctx/types';
import type { V2Weight } from '@polkadot/react-hooks/useWeight';
import type { Balance, DispatchInfo, SignedBlock } from '@polkadot/types/interfaces';
import type { FrameSupportDispatchPerDispatchClassWeight } from '@polkadot/types/lookup';

import React, { useMemo } from 'react';

import { CardSummary, SummaryBox } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';
import { convertWeight } from '@polkadot/react-hooks/useWeight';
import { FormatBalance } from '@polkadot/react-query';
import { BN, BN_ONE, BN_THREE, BN_TWO, formatNumber, isBn } from '@polkadot/util';

import { useTranslation } from '../translate.js';

interface Props {
  events?: KeyedEvent[] | null;
  blockWeight?: FrameSupportDispatchPerDispatchClassWeight | null;
  maxBlockWeight?: BN;
  maxProofSize?: BN;
  signedBlock?: SignedBlock;
}

function accumulateWeights (
  weight?: FrameSupportDispatchPerDispatchClassWeight | null
): { totalRefTime: BN; totalProofSize: BN } {
  const totalRefTime = new BN(0);
  const totalProofSize = new BN(0);

  (['normal', 'operational', 'mandatory'] as const).forEach((cls) => {
    totalRefTime.iadd(weight?.[cls].refTime.toBn() ?? new BN(0));
    totalProofSize.iadd(weight?.[cls].proofSize.toBn() ?? new BN(0));
  });

  return { totalProofSize, totalRefTime };
}

function extractEventDetails (events?: KeyedEvent[] | null): [BN?, BN?, BN?, BN?] {
  return events
    ? events.reduce(([deposits, transfers, weight, proofSize], { record: { event: { data, method, section } } }) => {
      const size = (convertWeight(
        ((method === 'ExtrinsicSuccess' ? data[0] : data[1]) as DispatchInfo)?.weight
      ).v2Weight as V2Weight).proofSize;

      return [
        section === 'balances' && method === 'Deposit'
          ? deposits.iadd(data[1] as Balance)
          : deposits,
        section === 'balances' && method === 'Transfer'
          ? transfers.iadd(data[2] as Balance)
          : transfers,
        section === 'system' && ['ExtrinsicFailed', 'ExtrinsicSuccess'].includes(method)
          ? weight.iadd(convertWeight(
            ((method === 'ExtrinsicSuccess' ? data[0] : data[1]) as DispatchInfo)?.weight
          ).v1Weight)
          : weight,
        section === 'system' && ['ExtrinsicFailed', 'ExtrinsicSuccess'].includes(method)
          ? proofSize.iadd(isBn(size) ? size : size.toBn())
          : proofSize
      ];
    }, [new BN(0), new BN(0), new BN(0), new BN(0)])
    : [];
}

function Summary ({ blockWeight, events, maxBlockWeight, maxProofSize, signedBlock }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { api } = useApi();

  const [deposits, transfers, weight, size] = useMemo(
    () => {
      const eventDetails = extractEventDetails(events);
      const { totalProofSize, totalRefTime } = accumulateWeights(blockWeight);

      // Block weight is the source of truth; using events data as fallback only
      if (blockWeight) {
        eventDetails[2] = totalRefTime;
        eventDetails[3] = totalProofSize;
      }

      return eventDetails;
    },
    [blockWeight, events]
  );

  return (
    <SummaryBox>
      <section>
        {api.query.balances && (
          <>
            <CardSummary label={t('deposits')}>
              <FormatBalance
                className={deposits ? '' : '--tmp'}
                value={deposits || BN_ONE}
              />
            </CardSummary>
            <CardSummary
              className='media--1000'
              label={t('transfers')}
            >
              <FormatBalance
                className={transfers ? '' : '--tmp'}
                value={transfers || BN_ONE}
              />
            </CardSummary>
          </>
        )}
      </section>
      <section>
        <CardSummary
          label={t('ref time')}
          progress={{
            hideValue: true,
            isBlurred: !(maxBlockWeight && weight),
            total: (maxBlockWeight && weight) ? maxBlockWeight : BN_THREE,
            value: (maxBlockWeight && weight) ? weight : BN_TWO
          }}
        >
          {weight
            ? formatNumber(weight)
            : <span className='--tmp'>999,999,999</span>}
        </CardSummary>
        {maxProofSize && size &&
          <CardSummary
            label={t('proof size')}
            progress={{
              hideValue: true,
              isBlurred: false,
              total: maxProofSize,
              value: size
            }}
          >
            {formatNumber(size)}
          </CardSummary>}
      </section>
      <section className='media--900'>
        <CardSummary label={t('event count')}>
          {events
            ? formatNumber(events.length)
            : <span className='--tmp'>99</span>}
        </CardSummary>
        <CardSummary label={t('extrinsic count')}>
          {signedBlock
            ? formatNumber(signedBlock.block.extrinsics.length)
            : <span className='--tmp'>99</span>}
        </CardSummary>
      </section>
    </SummaryBox>
  );
}

export default React.memo(Summary);
