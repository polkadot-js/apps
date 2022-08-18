// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Params } from './types';

import React from 'react';

import { CardSummary, SummaryBox } from '@polkadot/react-components';
import { formatNumber, isNumber } from '@polkadot/util';

import { useTranslation } from '../translate';

interface Props {
  className?: string;
  params: Params;
  poolCount?: number;
}

function Summary ({ className, params: { maxMembers, maxMembersPerPool, maxPools }, poolCount }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();

  return (
    <SummaryBox className={className}>
      <CardSummary label={t<string>('pools')}>
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
          <CardSummary label={t<string>('max. members')}>
            {formatNumber(maxMembers)}
          </CardSummary>
        )}
        {maxMembersPerPool > 0 && (
          <CardSummary label={t<string>('max. members / pool')}>
            {formatNumber(maxMembersPerPool)}
          </CardSummary>
        )}
      </section>
    </SummaryBox>
  );
}

export default React.memo(Summary);
