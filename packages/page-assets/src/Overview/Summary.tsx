// Copyright 2017-2025 @polkadot/app-assets authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import { CardSummary, SummaryBox } from '@polkadot/react-components';
import { formatNumber } from '@polkadot/util';

import { useTranslation } from '../translate.js';

interface Props {
  className?: string;
  numAssets?: number;
}

function Summary ({ className, numAssets }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  return (
    <SummaryBox className={className}>
      <CardSummary label={t('assets')}>
        {formatNumber(numAssets)}
      </CardSummary>
    </SummaryBox>
  );
}

export default React.memo(Summary);
