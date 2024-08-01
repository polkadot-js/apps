// Copyright 2017-2024 @polkadot/app-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { KeyedEvent } from '@polkadot/react-hooks/ctx/types';
import type { V2Weight } from '@polkadot/react-hooks/useWeight';
import type { Balance, DispatchInfo, SignedBlock } from '@polkadot/types/interfaces';

import React, { useMemo } from 'react';

import { CardSummary, SummaryBox } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';
import { convertWeight } from '@polkadot/react-hooks/useWeight';
import { FormatBalance } from '@polkadot/react-query';
import { BN, BN_ONE, BN_THREE, BN_TWO, BN_ZERO, formatNumber } from '@polkadot/util';

import { useTranslation } from '../translate.js';

interface Props {
  events?: KeyedEvent[] | null;
  maxBlockWeight?: BN;
  maxProofSize?: BN;
  signedBlock?: SignedBlock;
}

function extractEventDetails (events?: KeyedEvent[] | null): [BN?, BN?, BN?, BN?] {
  return events
    ? events.reduce(([deposits, transfers, weight], { record: { event: { data, method, section } } }) => {
      return [
        section === 'balances' && method === 'Deposit'
          ? deposits.iadd(data[1] as Balance)
          : deposits,
        section === 'balances' && method === 'Transfer'
          ? transfers.iadd(data[2] as Balance)
          : transfers,
        section === 'system' && ['ExtrinsicFailed', 'ExtrinsicSuccess'].includes(method)
          ? weight.iadd(convertWeight(
            ((method === 'ExtrinsicSuccess' ? data[0] : data[1]) as DispatchInfo).weight
          ).v1Weight)
          : weight,
        section === 'system' && ['ExtrinsicFailed', 'ExtrinsicSuccess'].includes(method)
          ? (convertWeight(
            ((method === 'ExtrinsicSuccess' ? data[0] : data[1]) as DispatchInfo).weight
          ).v2Weight as V2Weight).proofSize.toBn()
          : BN_ZERO
      ];
    }, [new BN(0), new BN(0), new BN(0), new BN(0)])
    : [];
}

function Summary ({ events, maxBlockWeight, maxProofSize, signedBlock }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { api } = useApi();

  const [deposits, transfers, weight, size] = useMemo(
    () => extractEventDetails(events),
    [events]
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
          label={t('block weight')}
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
