// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useMemo } from 'react';

import { CardSummary, Spinner, styled, SummaryBox } from '@polkadot/react-components';
import { formatNumber } from '@polkadot/util';

import { useTranslation } from '../translate.js';
import { EraValidatorPerformance } from './Performance.js';
import SummarySession from './SummarySession.js';

interface Props {
  className?: string;
  eraValidatorPerformances: EraValidatorPerformance[];
  era: number;
  session: number;
  expectedBlockCount?: number;
  finalizingCommitteeSize: number | undefined;
}

function Summary (
  { className = '',
    era,
    eraValidatorPerformances,
    expectedBlockCount,
    finalizingCommitteeSize,
    session }: Props
): React.ReactElement<Props> {
  const { t } = useTranslation();
  const committeeLength = useMemo(() => {
    return eraValidatorPerformances.filter((perf) => perf.isCommittee).length;
  }, [eraValidatorPerformances]
  );

  return (
    <SummaryBox className={className}>
      <section>
        <CardSummary label={t<string>('era validators')}>
          {eraValidatorPerformances.length
            ? <>{formatNumber(eraValidatorPerformances.length)}</>
            : <Spinner noLabel />
          }
        </CardSummary>
        <CardSummary label={t<string>('block production committee size')}>
          {committeeLength
            ? <>{formatNumber(committeeLength)}</>
            : <Spinner noLabel />
          }
        </CardSummary>
        <CardSummary label={t<string>('expected block count')}>
          {expectedBlockCount
            ? <>{formatNumber(expectedBlockCount)}</>
            : <Spinner noLabel />
          }
        </CardSummary>
        <CardSummary label={t<string>('finalizing committee size')}>
          {finalizingCommitteeSize !== undefined
            ? finalizingCommitteeSize
            : <Spinner noLabel />
          }
        </CardSummary>
      </section>
      <section>
        <SummarySession
          era={era}
          session={session}
        />
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
