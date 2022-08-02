// Copyright 2017-2022 @polkadot/app-referenda authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Summary as SummaryType } from '../types';

import React from 'react';

import { CardSummary, Spinner, SummaryBox } from '@polkadot/react-components';
import { formatNumber } from '@polkadot/util';

import { useTranslation } from '../translate';

interface Props {
  className?: string;
  summary: SummaryType;
}

function Summary ({ className, summary: { refActive, refCount } }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  return (
    <SummaryBox className={className}>
      <section>
        <CardSummary label={t<string>('active')}>
          {refActive === undefined
            ? <Spinner noLabel />
            : formatNumber(refActive)
          }
        </CardSummary>
        <CardSummary label={t<string>('total')}>
          {refCount === undefined
            ? <Spinner noLabel />
            : formatNumber(refCount)
          }
        </CardSummary>
      </section>
    </SummaryBox>
  );
}

export default React.memo(Summary);
