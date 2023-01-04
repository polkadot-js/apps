// Copyright 2017-2023 @polkadot/app-preimages authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import { CardSummary, Spinner, SummaryBox } from '@polkadot/react-components';
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
      <CardSummary label={t<string>('images')}>
        {hashes === undefined
          ? <Spinner noLabel />
          : formatNumber(hashes.length)
        }
      </CardSummary>
    </SummaryBox>
  );
}

export default React.memo(Summary);
