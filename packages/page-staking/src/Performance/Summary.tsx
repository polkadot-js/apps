// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import styled from 'styled-components';

import SummarySession from '@polkadot/app-staking/Performance/SummarySession';
import { CardSummary, Spinner, SummaryBox } from '@polkadot/react-components';
import { formatNumber } from '@polkadot/util';

import { useTranslation } from '../translate';
import { ValidatorPerformance } from './Performance';

interface Props {
  className?: string;
  validatorPerformances: ValidatorPerformance[];
  era: number;
  session: number;
}

function Summary ({ className = '', era, session, validatorPerformances }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  const committeeLength = validatorPerformances.filter((performance) => performance.isCommittee).length;

  return (
    <SummaryBox className={className}>
      <section>
        <CardSummary label={t<string>('era validators')}>
          {validatorPerformances.length > 0
            ? <>{formatNumber(validatorPerformances.length)}</>
            : <Spinner noLabel />
          }
        </CardSummary>
        <CardSummary label={t<string>('committee size')}>
          {committeeLength > 0
            ? <>{formatNumber(committeeLength)}</>
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
