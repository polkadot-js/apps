// Copyright 2017-2022 @polkadot/app-democracy authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveElectionsInfo } from '@polkadot/api-derive/types';
import type { BlockNumber } from '@polkadot/types/interfaces';
import type { ComponentProps } from './types';

import React from 'react';

import { CardSummary, SummaryBox } from '@polkadot/react-components';
import { BN_ZERO, formatNumber } from '@polkadot/util';

import { useTranslation } from '../translate';

interface Props extends ComponentProps {
  bestNumber?: BlockNumber;
  className?: string;
  electionsInfo?: DeriveElectionsInfo;
  hasElections: boolean;
}

function Summary ({ bestNumber, className = '', electionsInfo, hasElections }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();

  if (!electionsInfo) {
    return null;
  }

  const { candidateCount, desiredRunnersUp, desiredSeats, members, runnersUp, termDuration, voteCount } = electionsInfo;

  return (
    <SummaryBox className={className}>
      <section>
        <CardSummary label={t<string>('seats')}>
          {formatNumber(members.length)}{desiredSeats && <>&nbsp;/&nbsp;{formatNumber(desiredSeats)}</>}
        </CardSummary>
        {hasElections && (
          <>
            <CardSummary label={t<string>('runners up')}>
              {formatNumber(runnersUp.length)}{desiredRunnersUp && <>&nbsp;/&nbsp;{formatNumber(desiredRunnersUp)}</>}
            </CardSummary>
            <CardSummary label={t<string>('candidates')}>
              {formatNumber(candidateCount)}
            </CardSummary>
          </>
        )}
      </section>
      {voteCount && (
        <section>
          <CardSummary label={t<string>('voting round')}>
            #{formatNumber(voteCount)}
          </CardSummary>
        </section>
      )}
      {bestNumber && termDuration && termDuration.gt(BN_ZERO) && (
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
