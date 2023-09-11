// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useMemo } from 'react';

import { CardSummary, styled, SummaryBox } from '@polkadot/react-components';
import { formatNumber } from '@polkadot/util';

import { useTranslation } from '../translate.js';
import { EraValidatorPerformance } from './Performance.js';

interface Props {
  className?: string;
  eraValidatorPerformances: EraValidatorPerformance[];
  expectedBlockCount?: number;
}

function Summary (
  { className = '',
    eraValidatorPerformances,
    expectedBlockCount }: Props
): React.ReactElement<Props> {
  const { t } = useTranslation();
  const committeeLength = useMemo(() => {
    return eraValidatorPerformances.filter((perf) => perf.isCommittee).length;
  }, [eraValidatorPerformances]
  );

  return (
    <SummaryBox className={className}>
      <section>
        <CardSummary label={t<string>('block production committee size')}>
          <span className={committeeLength ? '' : '--tmp'}>
            {formatNumber(committeeLength || 0)}
          </span>
        </CardSummary>
        <CardSummary label={t<string>('expected block count')}>
          <span className={expectedBlockCount ? '' : '--tmp'}>
            {formatNumber(expectedBlockCount || 0)}
          </span>
        </CardSummary>
      </section>
    </SummaryBox>
  );
}

export default React.memo(styled(Summary)`
  .validator--Account-block-icon {
    display: inline-block;
    margin-right: 0.75rem;
    margin-top: -0.25rem;
    vertical-align: middle;
  }

  .validator--Summary-authors {
    .validator--Account-block-icon+.validator--Account-block-icon {
      margin-left: -1.5rem;
    }
  }
`);
