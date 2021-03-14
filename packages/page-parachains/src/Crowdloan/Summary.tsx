// Copyright 2017-2021 @polkadot/app-crowdloan authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type BN from 'bn.js';

import React from 'react';

import { CardSummary, SummaryBox } from '@polkadot/react-components';
import { FormatBalance } from '@polkadot/react-query';
import { formatNumber } from '@polkadot/util';

import { useTranslation } from '../translate';

interface Props {
  className?: string;
  fundCount: number;
  totals: [BN, BN];
}

function Summary ({ className, fundCount, totals: [raised, cap] }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  return (
    <SummaryBox className={className}>
      <CardSummary label={t<string>('funds')}>
        {formatNumber(fundCount)}
      </CardSummary>
      <CardSummary
        label={`${t<string>('raised / total cap')}`}
        progress={{
          hideValue: true,
          total: cap,
          value: raised
        }}
      >
        <FormatBalance
          value={raised}
          withCurrency={false}
          withSi
        />
        &nbsp;/&nbsp;
        <FormatBalance
          value={cap}
          withSi
        />
      </CardSummary>
    </SummaryBox>
  );
}

export default React.memo(Summary);
