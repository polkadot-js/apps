// Copyright 2017-2025 @polkadot/app-gilt authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { u128 } from '@polkadot/types';
import type { ActiveGiltsTotal } from '@polkadot/types/interfaces';

import React from 'react';

import { CardSummary, SummaryBox } from '@polkadot/react-components';
import { useApi, useBestNumber } from '@polkadot/react-hooks';
import { BN, BN_HUNDRED, BN_QUINTILL, formatNumber } from '@polkadot/util';

import { useTranslation } from '../translate.js';

interface Props {
  activeTotal?: ActiveGiltsTotal;
  className?: string;
  isDisabled: boolean;
}

const DIVIDOR_NU = 10_000;
const DIVISOR_BN = new BN(10_000);

function Summary ({ activeTotal, className, isDisabled }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const bestNumber = useBestNumber();

  return (
    <SummaryBox className={className}>
      <section>
        <CardSummary label={t('active')}>
          {isDisabled ? t('no') : t('yes')}
        </CardSummary>
        {activeTotal && (
          <CardSummary label={t('index')}>
            {formatNumber(activeTotal.index)}
          </CardSummary>
        )}
      </section>
      {activeTotal && (
        <section>
          <CardSummary label={t('proportion')}>
            {(activeTotal.proportion.mul(DIVISOR_BN).imul(BN_HUNDRED).div(BN_QUINTILL).toNumber() / DIVIDOR_NU).toFixed(2)}%
          </CardSummary>
          <CardSummary label={t('target')}>
            {(activeTotal.target.mul(DIVISOR_BN).imul(BN_HUNDRED).div(BN_QUINTILL).toNumber() / DIVIDOR_NU).toFixed(2)}%
          </CardSummary>
        </section>
      )}
      <section>
        {bestNumber && (
          <CardSummary
            label={t('intake')}
            progress={{
              total: api.consts.gilt.intakePeriod as u128,
              value: bestNumber.mod(api.consts.gilt.intakePeriod as u128),
              withTime: true
            }}
          />
        )}
      </section>
    </SummaryBox>
  );
}

export default React.memo(Summary);
