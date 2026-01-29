// Copyright 2017-2025 @polkadot/app-council authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveElectionsInfo } from '@polkadot/api-derive/types';
import type { BlockNumber } from '@polkadot/types/interfaces';
import type { ComponentProps } from './types.js';

import React from 'react';

import { CardSummary, SummaryBox } from '@polkadot/react-components';
import { BN_THREE, BN_TWO, BN_ZERO, formatNumber } from '@polkadot/util';

import { useTranslation } from '../translate.js';

interface Props extends ComponentProps {
  bestNumber?: BlockNumber;
  className?: string;
  electionsInfo?: DeriveElectionsInfo;
  hasElections: boolean;
}

function Summary ({ bestNumber, className = '', electionsInfo, hasElections }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();

  return (
    <SummaryBox className={className}>
      <section>
        <CardSummary label={t('seats')}>
          {electionsInfo
            ? <>{formatNumber(electionsInfo.members.length)}{electionsInfo.desiredSeats && <>&nbsp;/&nbsp;{formatNumber(electionsInfo.desiredSeats)}</>}</>
            : <span className='--tmp'>99</span>}
        </CardSummary>
        {hasElections && (
          <>
            <CardSummary label={t('runners up')}>
              {electionsInfo
                ? <>{formatNumber(electionsInfo.runnersUp.length)}{electionsInfo.desiredRunnersUp && <>&nbsp;/&nbsp;{formatNumber(electionsInfo.desiredRunnersUp)}</>}</>
                : <span className='--tmp'>99 / 99</span>}
            </CardSummary>
            <CardSummary label={t('candidates')}>
              {electionsInfo
                ? formatNumber(electionsInfo.candidateCount)
                : <span className='--tmp'>99</span>}
            </CardSummary>
          </>
        )}
      </section>
      {electionsInfo?.voteCount && (
        <section>
          <CardSummary label={t('voting round')}>
            #{formatNumber(electionsInfo.voteCount)}
          </CardSummary>
        </section>
      )}
      {electionsInfo && bestNumber && electionsInfo.termDuration && electionsInfo.termDuration.gt(BN_ZERO) && (
        <section>
          <CardSummary
            label={t('term progress')}
            progress={{
              total: (electionsInfo && bestNumber) ? electionsInfo.termDuration : BN_THREE,
              value: (electionsInfo && bestNumber) ? bestNumber.mod(electionsInfo.termDuration) : BN_TWO,
              withTime: true
            }}
          />
        </section>
      )}
    </SummaryBox>
  );
}

export default React.memo(Summary);
