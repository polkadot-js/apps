// Copyright 2017-2021 @polkadot/app-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { KeyedEvent } from '@polkadot/react-query/types';
import type { Balance, DispatchInfo, SignedBlock, Weight } from '@polkadot/types/interfaces';

import BN from 'bn.js';
import React, { useMemo } from 'react';

import { CardSummary, SummaryBox } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';
import { FormatBalance } from '@polkadot/react-query';
import { formatNumber } from '@polkadot/util';

import { useTranslation } from '../translate';

interface Props {
  events?: KeyedEvent[];
  maxBlockWeight?: Weight;
  signedBlock?: SignedBlock;
}

function extractEventDetails (events?: KeyedEvent[]): [BN?, BN?, BN?] {
  return events
    ? events.reduce(([deposits, transfers, weight], { record: { event: { data, method, section } } }) => [
      section === 'balances' && method === 'Deposit'
        ? deposits.iadd(data[1] as Balance)
        : deposits,
      section === 'balances' && method === 'Transfer'
        ? transfers.iadd(data[2] as Balance)
        : transfers,
      section === 'system' && ['ExtrinsicFailed', 'ExtrinsicSuccess'].includes(method)
        ? weight.iadd(((method === 'ExtrinsicSuccess' ? data[0] : data[1]) as DispatchInfo).weight)
        : weight
    ], [new BN(0), new BN(0), new BN(0)])
    : [];
}

function Summary ({ events, maxBlockWeight, signedBlock }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { api } = useApi();

  const [deposits, transfers, weight] = useMemo(
    () => extractEventDetails(events),
    [events]
  );

  if (!events || !signedBlock) {
    return null;
  }

  return (
    <SummaryBox>
      <section>
        {api.query.balances && (
          <>
            <CardSummary label={t<string>('deposits')}>
              <FormatBalance value={deposits} />
            </CardSummary>
            <CardSummary label={t<string>('transfers')}>
              <FormatBalance value={transfers} />
            </CardSummary>
          </>
        )}
      </section>
      {maxBlockWeight && (
        <section>
          <CardSummary
            label={t<string>('block weight')}
            progress={{
              hideValue: true,
              total: maxBlockWeight,
              value: weight
            }}
          >
            {formatNumber(weight)}
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
