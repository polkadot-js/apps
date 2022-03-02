// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Params } from './types';

import React from 'react';

import { CardSummary, SummaryBox } from '@polkadot/react-components';
import { formatNumber } from '@polkadot/util';

import { useTranslation } from '../translate';

interface Props {
  className?: string;
  params: Params;
}

function Summary ({ className, params: { maxDelegators, maxDelegatorsPool, maxPools } }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();

  return (
    <SummaryBox className={className}>
      <section>
        {maxDelegators && (
          <CardSummary label={t<string>('max. pools')}>
            {formatNumber(maxPools)}
          </CardSummary>
        )}
        {maxDelegatorsPool && (
          <CardSummary label={t<string>('max. delegators')}>
            {formatNumber(maxDelegators)}
          </CardSummary>
        )}
        {maxPools && (
          <CardSummary label={t<string>('max. delegators / pool')}>
            {formatNumber(maxDelegatorsPool)}
          </CardSummary>
        )}
      </section>
    </SummaryBox>
  );
}

export default React.memo(Summary);
