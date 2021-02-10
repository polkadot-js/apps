// Copyright 2017-2021 @polkadot/app-crowdloan authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import { CardSummary, SummaryBox } from '@polkadot/react-components';
import { formatNumber } from '@polkadot/util';

import { useTranslation } from './translate';

interface Props {
  className?: string;
  fundCount: number;
}

function Summary ({ className, fundCount }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  return (
    <SummaryBox className={className}>
      <CardSummary label={t<string>('funds')}>
        {formatNumber(fundCount)}
      </CardSummary>
    </SummaryBox>
  );
}

export default React.memo(Summary);
