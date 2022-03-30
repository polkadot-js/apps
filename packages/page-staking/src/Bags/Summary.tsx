// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { u64 } from '@polkadot/types';

import React from 'react';

import { CardSummary, Spinner, SummaryBox } from '@polkadot/react-components';
import { formatNumber } from '@polkadot/util';

import { useTranslation } from '../translate';

interface Props {
  className?: string;
  ids?: u64[];
}

function Summary ({ className = '', ids }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  return (
    <SummaryBox className={className}>
      <CardSummary label={t<string>('total bags')}>
        {ids
          ? formatNumber(ids.length)
          : <Spinner noLabel />
        }
      </CardSummary>
    </SummaryBox>
  );
}

export default React.memo(Summary);
