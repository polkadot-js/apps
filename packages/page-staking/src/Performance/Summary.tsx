// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { SortedTargets } from '../types';

import React from 'react';
import styled from 'styled-components';

import SummarySession from '@polkadot/app-explorer/SummarySession';
import { CardSummary, Spinner, SummaryBox } from '@polkadot/react-components';
import { AccountId } from '@polkadot/types/interfaces';
import { formatNumber } from '@polkadot/util';

import { useTranslation } from '../translate';

interface Props {
  className?: string;
  eraValidators: AccountId[];
  currentSessionCommittee: AccountId[];
  targets: SortedTargets;
}

function Summary ({ className = '', currentSessionCommittee, eraValidators }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  return (
    <SummaryBox className={className}>
      <section>
        <CardSummary label={t<string>('era validators')}>
          {eraValidators.length > 0
            ? <>{formatNumber(eraValidators.length)}</>
            : <Spinner noLabel />
          }
        </CardSummary>
        <CardSummary label={t<string>('committee size')}>
          {currentSessionCommittee.length > 0
            ? <>{formatNumber(currentSessionCommittee.length)}</>
            : <Spinner noLabel />
          }
        </CardSummary>
      </section>
      <section>
        <SummarySession />
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
