// Copyright 2017-2025 @polkadot/app-treasury authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BN } from '@polkadot/util';

import React, { useMemo } from 'react';

import { CardSummary, SummaryBox } from '@polkadot/react-components';
import { useApi, useBestNumber, useCall, useTreasury } from '@polkadot/react-hooks';
import { FormatBalance } from '@polkadot/react-query';
import { BN_THREE, BN_TWO, BN_ZERO, formatNumber } from '@polkadot/util';

import { useTranslation } from '../translate.js';

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
    () => value?.sub(pendingBounties).sub(pendingProposals),
    [value, pendingBounties, pendingProposals]
  );

  const hasSpendable = !!(value && spendable);

  return (
    <SummaryBox>
      <section>
        <CardSummary
          className='media--1700'
          label={t('open')}
        >
          {proposalCount === undefined
            ? <span className='--tmp'>99</span>
            : formatNumber(proposalCount)}
        </CardSummary>
        <CardSummary
          className='media--1600'
          label={t('approved')}
        >
          {approvalCount === undefined
            ? <span className='--tmp'>99</span>
            : formatNumber(approvalCount)}
        </CardSummary>
        <CardSummary
          className='media--1400'
          label={t('total')}
        >
          {totalProposals === undefined
            ? <span className='--tmp'>99</span>
            : formatNumber(totalProposals)}
        </CardSummary>
      </section>
      <section>
        {!pendingProposals.isZero() && (
          <CardSummary
            className='media--1100'
            label={t('approved')}
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
            label={t('bounties')}
          >
            <FormatBalance
              value={pendingBounties}
              withSi
            />
          </CardSummary>
        )}
        <CardSummary
          className='media--1300'
          label={t('next burn')}
        >
          <FormatBalance
            className={burn ? '' : '--tmp'}
            value={burn || 1}
            withSi
          />
        </CardSummary>
      </section>
      <section>
        <CardSummary
          label={t('spendable / available')}
          progress={{
            hideValue: true,
            isBlurred: !hasSpendable,
            total: hasSpendable ? value : BN_THREE,
            value: hasSpendable ? spendable : BN_TWO
          }}
        >
          <span className={hasSpendable ? '' : '--tmp'}>
            <FormatBalance
              value={spendable || BN_TWO}
              withSi
            />
            <>&nbsp;/&nbsp;</>
            <FormatBalance
              value={value || BN_THREE}
              withSi
            />
          </span>
        </CardSummary>
      </section>
      {bestNumber && spendPeriod.gt(BN_ZERO) && (
        <section>
          <CardSummary
            label={t('spend period')}
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
