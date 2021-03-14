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
  totalCap: BN;
  totalRaised: BN;
}

function Summary ({ className, fundCount, totalCap, totalRaised }: Props): React.ReactElement<Props> {
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
          total: totalCap,
          value: totalRaised
        }}
      >
        <FormatBalance
          value={totalRaised}
          withCurrency={false}
          withSi
        />
        &nbsp;/&nbsp;
        <FormatBalance
          value={totalCap}
          withSi
        />
      </CardSummary>
    </SummaryBox>
  );
}

export default React.memo(Summary);
