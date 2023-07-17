// Copyright 2017-2023 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AccountBalance } from '../types.js';

import React from 'react';

import { CardSummary, SummaryBox } from '@polkadot/react-components';
import { FormatBalance } from '@polkadot/react-query';

import { useTranslation } from '../translate.js';

interface Props {
  className?: string;
  balance?: AccountBalance;
}

function Summary ({ balance, className }: Props) {
  const { t } = useTranslation();

  return (
    <SummaryBox className={className}>
      {balance && (
        <>
          {balance.total.gtn(0) &&
            <CardSummary label={t<string>('total balance')}>
              <FormatBalance value={balance.total} />
            </CardSummary>}
          {balance.transferrable.gtn(0) &&
            <CardSummary
              className='media--900'
              label={t<string>('total transferrable')}
            >
              <FormatBalance value={balance.transferrable} />
            </CardSummary>}
          {balance.locked.gtn(0) &&
            <CardSummary label={t<string>('total locked')}>
              <FormatBalance value={balance.locked} />
            </CardSummary>}
          {balance.bonded.gtn(0) &&
            <CardSummary
              className='media--1100'
              label={t<string>('bonded')}
            >
              <FormatBalance value={balance.bonded} />
            </CardSummary>}
          {balance.redeemable.gtn(0) &&
            <CardSummary
              className='media--1500'
              label={t<string>('redeemable')}
            >
              <FormatBalance value={balance.redeemable} />
            </CardSummary>}
          {balance.unbonding.gtn(0) &&
            <CardSummary
              className='media--1300'
              label={t<string>('unbonding')}
            >
              <FormatBalance value={balance.unbonding} />
            </CardSummary>}
        </>)}
    </SummaryBox>
  );
}

export default React.memo(Summary);
