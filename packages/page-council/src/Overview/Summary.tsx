// Copyright 2017-2021 @polkadot/app-democracy authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveElectionsInfo } from '@polkadot/api-derive/types';
import type { BlockNumber } from '@polkadot/types/interfaces';
import type { ComponentProps } from './types';

import React from 'react';

import { CardSummary, SummaryBox } from '@polkadot/react-components';
import { formatNumber } from '@polkadot/util';

import { useTranslation } from '../translate';

interface Props extends ComponentProps {
  bestNumber?: BlockNumber;
  className?: string;
  electionsInfo?: DeriveElectionsInfo;
}

function Summary ({ bestNumber, className = '', electionsInfo }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();

  if (!electionsInfo) {
    return null;
  }

  const { candidateCount, desiredRunnersUp, desiredSeats, members, runnersUp, termDuration, voteCount } = electionsInfo;

  return (
    <SummaryBox className={className}>
      <section>
        <CardSummary label={t<string>('seats')}>
          {formatNumber(members.length)}&nbsp;/&nbsp;{formatNumber(desiredSeats)}
        </CardSummary>
        <CardSummary label={t<string>('runners up')}>
          {formatNumber(runnersUp.length)}&nbsp;/&nbsp;{formatNumber(desiredRunnersUp)}
        </CardSummary>
        <CardSummary label={t<string>('candidates')}>
          {formatNumber(candidateCount)}
        </CardSummary>
      </section>
      {voteCount && (
        <section>
          <CardSummary label={t<string>('voting round')}>
            #{formatNumber(voteCount)}
          </CardSummary>
        </section>
      )}
      {bestNumber && termDuration?.gtn(0) && (
        <section>
          <CardSummary
            label={t<string>('term progress')}
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
