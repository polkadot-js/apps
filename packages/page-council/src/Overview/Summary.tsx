// Copyright 2017-2020 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BlockNumber } from '@polkadot/types/interfaces';
import { ComponentProps } from './types';

import React from 'react';
import { SummaryBox, CardSummary } from '@polkadot/react-components';
import { formatNumber } from '@polkadot/util';

import { useTranslation } from '../translate';

interface Props extends ComponentProps {
  bestNumber?: BlockNumber;
  className?: string;
}

function Summary ({ bestNumber, className, electionsInfo }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();

  if (!electionsInfo) {
    return null;
  }

  const { candidateCount, desiredSeats, members, runnersUp, termDuration, voteCount } = electionsInfo;

  return (
    <SummaryBox className={className}>
      <section>
        <CardSummary label={t('seats')}>
          {formatNumber(members.length)}/{formatNumber(desiredSeats)}
        </CardSummary>
        <CardSummary label={t('runners up')}>
          {formatNumber(runnersUp.length)}
        </CardSummary>
        <CardSummary label={t('candidates')}>
          {formatNumber(candidateCount)}
        </CardSummary>
      </section>
      {voteCount && (
        <section>
          <CardSummary label={t('voting round')}>
            #{formatNumber(voteCount)}
          </CardSummary>
        </section>
      )}
      {bestNumber && termDuration?.gtn(0) && (
        <section>
          <CardSummary
            label={t('term progress')}
            progress={{
              total: termDuration,
              value: bestNumber.mod(termDuration),
              withTime: true
            }}
          />
        </section>
      )}
    </SummaryBox>
  );
}

export default React.memo(Summary);
