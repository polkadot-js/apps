// Copyright 2017-2025 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BN } from '@polkadot/util';

import React from 'react';

import { CardSummary, SummaryBox } from '@polkadot/react-components';
import { FormatBalance } from '@polkadot/react-query';
import { BN_THREE, BN_TWO, formatNumber } from '@polkadot/util';

import { useTranslation } from '../translate.js';

interface Props {
  activeCap: BN;
  activeRaised: BN;
  className?: string;
  fundCount?: number;
  isLoading?: boolean;
  totalCap: BN;
  totalRaised: BN;
}

function Summary ({ activeCap, activeRaised, className, fundCount, isLoading, totalCap, totalRaised }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  return (
    <SummaryBox className={className}>
      <CardSummary label={t('funds')}>
        {fundCount === undefined
          ? <span className='--tmp'>99</span>
          : formatNumber(fundCount)}
      </CardSummary>
      <CardSummary
        label={`${t('active raised / cap')}`}
        progress={{
          hideValue: true,
          isBlurred: isLoading,
          total: isLoading ? BN_THREE : activeCap,
          value: isLoading ? BN_TWO : activeRaised
        }}
      >
        <span className={isLoading ? '--tmp' : ''}>
          <FormatBalance
            value={activeRaised}
            withCurrency={false}
            withSi
          />
          &nbsp;/&nbsp;
          <FormatBalance
            value={activeCap}
            withSi
          />
        </span>
      </CardSummary>
      <CardSummary
        label={`${t('total raised / cap')}`}
        progress={{
          hideValue: true,
          isBlurred: isLoading,
          total: isLoading ? BN_THREE : totalCap,
          value: isLoading ? BN_TWO : totalRaised
        }}
      >
        <span className={isLoading ? '--tmp' : ''}>
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
        </span>
      </CardSummary>
    </SummaryBox>
  );
}

export default React.memo(Summary);
