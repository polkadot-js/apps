// Copyright 2017-2023 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AccountBalance } from '../types';

import React from 'react';

import { useTranslation } from '@polkadot/app-treasury/translate';
import { CardSummary, SummaryBox } from '@polkadot/react-components';
import { FormatBalance } from '@polkadot/react-query';

interface Props {
  className?: string;
  balance?: AccountBalance;
}

function Summary ({ balance, className }: Props) {
  const { t } = useTranslation();

  return (
    <SummaryBox className={className}>
      <CardSummary label={t<string>('total balance')}>
        <FormatBalance
          className={balance ? '' : '--tmp'}
          value={balance?.total || 1}
        />
      </CardSummary>
      <CardSummary
        className='media--900'
        label={t<string>('total transferrable')}
      >
        <FormatBalance
          className={balance ? '' : '--tmp'}
          value={balance?.transferrable || 1}
        />
      </CardSummary>
      <CardSummary label={t<string>('total locked')}>
        <FormatBalance
          className={balance ? '' : '--tmp'}
          value={balance?.locked || 1}
        />
      </CardSummary>
      {balance?.bonded.gtn(0) &&
        <CardSummary
          className='media--1100'
          label={t<string>('bonded')}
        >
          <FormatBalance value={balance.bonded} />
        </CardSummary>}
      {balance?.redeemable.gtn(0) &&
        <CardSummary
          className='media--1500'
          label={t<string>('redeemable')}
        >
          <FormatBalance value={balance.redeemable} />
        </CardSummary>}
      {balance?.unbonding.gtn(0) &&
        <CardSummary
          className='media--1300'
          label={t<string>('unbonding')}
        >
          <FormatBalance value={balance.unbonding} />
        </CardSummary>}
    </SummaryBox>
  );
}

export default React.memo(Summary);
