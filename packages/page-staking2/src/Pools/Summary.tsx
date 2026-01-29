// Copyright 2017-2025 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Params } from './types.js';

import React from 'react';

import { CardSummary, SummaryBox } from '@polkadot/react-components';
import { formatNumber, isNumber } from '@polkadot/util';

import { useTranslation } from '../translate.js';

interface Props {
  className?: string;
  params: Params;
  poolCount?: number;
}

function Summary ({ className, params: { maxMembers, maxMembersPerPool, maxPools }, poolCount }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();

  return (
    <SummaryBox className={className}>
      <CardSummary label={t('pools')}>
        {isNumber(poolCount) && (
          <>
            {formatNumber(poolCount)}
            {maxPools > 0 && (
              <>&nbsp;/&nbsp;{formatNumber(maxPools)}</>
            )}
          </>
        )}
      </CardSummary>
      <section>
        {maxMembers > 0 && (
          <CardSummary label={t('max. members')}>
            {formatNumber(maxMembers)}
          </CardSummary>
        )}
        {maxMembersPerPool > 0 && (
          <CardSummary label={t('max. members / pool')}>
            {formatNumber(maxMembersPerPool)}
          </CardSummary>
        )}
      </section>
    </SummaryBox>
  );
}

export default React.memo(Summary);
