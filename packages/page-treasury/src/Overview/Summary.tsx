// Copyright 2017-2022 @polkadot/app-treasury authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BN } from '@polkadot/util';

import React, { useMemo } from 'react';

import { CardSummary, SummaryBox } from '@polkadot/react-components';
import { useApi, useBestNumber, useCall, useTreasury } from '@polkadot/react-hooks';
import { FormatBalance } from '@polkadot/react-query';
import { formatNumber } from '@polkadot/util';

import { useTranslation } from '../translate';

interface Props {
  approvalCount?: number;
  proposalCount?: number;
}

function Summary ({ approvalCount, proposalCount }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const bestNumber = useBestNumber();
  const totalProposals = useCall<BN>(api.query.treasury.proposalCount);
  const { burn, pendingBounties, pendingProposals, spendPeriod, value } = useTreasury();

  const spendable = useMemo(
    () => value && value.sub(pendingBounties).sub(pendingProposals),
    [value, pendingBounties, pendingProposals]
  );

  return (
    <SummaryBox>
      <section>
        <CardSummary
          className='media--1700'
          label={t<string>('open')}
        >
          {formatNumber(proposalCount)}
        </CardSummary>
        <CardSummary
          className='media--1600'
          label={t<string>('approved')}
        >
          {formatNumber(approvalCount)}
        </CardSummary>
        <CardSummary
          className='media--1400'
          label={t<string>('total')}
        >
          {formatNumber(totalProposals || 0)}
        </CardSummary>
      </section>
      <section>
        {!pendingProposals.isZero() && (
          <CardSummary
            className='media--1100'
            label={t<string>('approved')}
          >
            <FormatBalance
              value={pendingProposals}
              withSi
            />
          </CardSummary>
        )}
        {!pendingBounties.isZero() && (
          <CardSummary
            className='media--1200'
            label={t<string>('bounties')}
          >
            <FormatBalance
              value={pendingBounties}
              withSi
            />
          </CardSummary>
        )}
        {burn && (
          <CardSummary
            className='media--1300'
            label={t<string>('next burn')}
          >
            <FormatBalance
              value={burn}
              withSi
            />
          </CardSummary>
        )}
      </section>
      {value && spendable && (
        <section>
          <CardSummary
            label={t<string>('spendable / available')}
            progress={{
              hideValue: true,
              total: value,
              value: spendable
            }}
          >
            <FormatBalance
              value={spendable}
              withSi
            />
            <>&nbsp;/&nbsp;</>
            <FormatBalance
              value={value}
              withSi
            />
          </CardSummary>
        </section>
      )}
      {bestNumber && spendPeriod?.gtn(0) && (
        <section>
          <CardSummary
            label={t<string>('spend period')}
            progress={{
              total: spendPeriod,
              value: bestNumber.mod(spendPeriod),
              withTime: true
            }}
          />
        </section>
      )}
    </SummaryBox>
  );
}

export default React.memo(Summary);
