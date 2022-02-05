// Copyright 2017-2022 @polkadot/app-uniques authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import { CardSummary, SummaryBox } from '@polkadot/react-components';
import { formatNumber } from '@polkadot/util';

import { useTranslation } from '../translate';

interface Props {
  numUniques?: number;
}

function Summary ({ numUniques }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  return (
    <SummaryBox>
      <CardSummary label={t<string>('unique classes')}>
        {formatNumber(numUniques)}
      </CardSummary>
    </SummaryBox>
  );
}

export default React.memo(Summary);
