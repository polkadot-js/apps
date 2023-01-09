// Copyright 2017-2023 @polkadot/app-whitelist authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import { CardSummary, SummaryBox } from '@polkadot/react-components';
import { formatNumber } from '@polkadot/util';

import { useTranslation } from '../translate';

interface Props {
  className?: string;
  hashes?: string[];
}

function Summary ({ className, hashes }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  return (
    <SummaryBox className={className}>
      <CardSummary label={t<string>('hashes')}>
        {hashes === undefined
          ? <span className='--placeholder'>99</span>
          : formatNumber(hashes.length)
        }
      </CardSummary>
    </SummaryBox>
  );
}

export default React.memo(Summary);
