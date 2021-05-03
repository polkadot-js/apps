// Copyright 2017-2021 @polkadot/app-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { KeyedEvent } from '@polkadot/react-query/types';
import type { Balance, DispatchInfo, SignedBlock, Weight } from '@polkadot/types/interfaces';

import BN from 'bn.js';
import React, { useMemo } from 'react';

import { CardSummary, SummaryBox } from '@polkadot/react-components';
import { FormatBalance } from '@polkadot/react-query';
import { formatNumber } from '@polkadot/util';

import { useTranslation } from '../translate';

interface Props {
  events?: KeyedEvent[];
  maxBlockWeight?: Weight;
  signedBlock?: SignedBlock;
}

function Summary ({ events, maxBlockWeight, signedBlock }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();

  const totalWeight = useMemo(
    () => events
      ?.filter(({ record: { event: { method, section } } }) =>
        section === 'system' &&
        ['ExtrinsicFailed', 'ExtrinsicSuccess'].includes(method)
      )
      .reduce((weight: BN, { record: { event: { data, method } } }) =>
        weight.iadd(
          (method === 'ExtrinsicSuccess'
            ? data[0] as DispatchInfo
            : data[1] as DispatchInfo
          ).weight
        ), new BN(0)
      ),
    [events]
  );

  const deposits = useMemo(
    () => events
      ?.filter(({ record: { event: { method, section } } }) =>
        section === 'balances' &&
        ['Deposit'].includes(method)
      )
      .reduce((deposits: BN, { record: { event: { data } } }) =>
        deposits.iadd(
          data[1] as Balance
        ), new BN(0)
      ),
    [events]
  );

  const transfers = useMemo(
    () => events
      ?.filter(({ record: { event: { method, section } } }) =>
        section === 'balances' &&
        ['Transfer'].includes(method)
      )
      .reduce((deposits: BN, { record: { event: { data } } }) =>
        deposits.iadd(
          data[2] as Balance
        ), new BN(0)
      ),
    [events]
  );

  if (!events || !signedBlock) {
    return null;
  }

  return (
    <SummaryBox>
      <section>
        <CardSummary label={t<string>('deposits')}>
          <FormatBalance value={deposits} />
        </CardSummary>
        <CardSummary label={t<string>('transfers')}>
          <FormatBalance value={transfers} />
        </CardSummary>
      </section>
      {maxBlockWeight && (
        <section>
          <CardSummary
            label={t<string>('block weight')}
            progress={{
              hideValue: true,
              total: maxBlockWeight,
              value: totalWeight
            }}
          >
            {formatNumber(totalWeight)}
          </CardSummary>
        </section>
      )}
      <section>
        <CardSummary label={t<string>('event count')}>
          {formatNumber(events.length)}
        </CardSummary>
        <CardSummary label={t<string>('extrinsic count')}>
          {formatNumber(signedBlock.block.extrinsics.length)}
        </CardSummary>
      </section>
    </SummaryBox>
  );
}

export default React.memo(Summary);
