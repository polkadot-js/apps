// Copyright 2017-2021 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AccountBalance } from '../types';

import React from 'react';

import { FormatBalance } from '@polkadot/react-query';
import { CardSummary, SummaryBox } from '@polkadot/react-components';
import { useTranslation } from '@polkadot/app-treasury/translate';

interface Props {
  className?: string;
  balance?: AccountBalance;
}

function Summary({ className, balance }: Props) {
  const { t } = useTranslation();

  return (
    <SummaryBox className={className}>
      <CardSummary label={t('total balance')}>
        <FormatBalance value={balance?.total} />
      </CardSummary>
      <CardSummary label={t('total transferrable')}>
        <FormatBalance value={balance?.transferrable} />
      </CardSummary>
      <CardSummary label={t('total locked')}>
        <FormatBalance value={balance?.locked} />
      </CardSummary>
      <CardSummary label={t('bonded')}>
        <FormatBalance value={balance?.bonded} />
      </CardSummary>
      <CardSummary label={t('redeemable')}>
        <FormatBalance value={balance?.redeemable} />
      </CardSummary>
      <CardSummary label={t('unbonding')}>
        <FormatBalance value={balance?.unbonding} />
      </CardSummary>
    </SummaryBox>
  )
}

export default React.memo(Summary)
