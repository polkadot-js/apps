// Copyright 2017-2023 @polkadot/app-referenda authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BN } from '@polkadot/util';
import type { Summary as SummaryType } from '../types';

import React from 'react';

import { CardSummary, SummaryBox } from '@polkadot/react-components';
import { FormatBalance } from '@polkadot/react-query';
import { formatNumber } from '@polkadot/util';

import { useTranslation } from '../translate';

interface Props {
  className?: string;
  issuanceActive?: BN;
  issuanceInactive?: BN;
  issuanceTotal?: BN;
  summary: SummaryType;
  withIssuance?: boolean;
}

function Summary ({ className, issuanceActive, issuanceInactive, issuanceTotal, summary: { refActive, refCount }, withIssuance }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  return (
    <SummaryBox className={className}>
      <section>
        <CardSummary label={t<string>('active')}>
          {refActive === undefined
            ? <span className='--placeholder'>99</span>
            : formatNumber(refActive)
          }
        </CardSummary>
        <CardSummary label={t<string>('total')}>
          {refCount === undefined
            ? <span className='--placeholder'>99</span>
            : formatNumber(refCount)
          }
        </CardSummary>
      </section>
      {withIssuance && (
        <section>
          {issuanceInactive && (
            <CardSummary
              className='media--1000'
              label={t<string>('inactive issuance')}
            >
              <FormatBalance
                value={issuanceInactive}
                withSi
              />
            </CardSummary>
          )}
          {issuanceActive && issuanceInactive && (
            <CardSummary
              className='media--800'
              label={t<string>('active issuance')}
            >
              <FormatBalance
                value={issuanceActive}
                withSi
              />
            </CardSummary>
          )}
          <CardSummary label={t<string>('total issuance')}>
            <FormatBalance
              className={issuanceTotal ? '' : '--placeholder'}
              value={issuanceTotal || 1}
              withSi
            />
          </CardSummary>
        </section>
      )}
    </SummaryBox>
  );
}

export default React.memo(Summary);
