// Copyright 2017-2025 @polkadot/app-society authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveSociety } from '@polkadot/api-derive/types';
import type { BN } from '@polkadot/util';

import React, { useMemo } from 'react';

import { CardSummary, styled, SummaryBox } from '@polkadot/react-components';
import { useApi, useBestNumber, useCall } from '@polkadot/react-hooks';
import { FormatBalance } from '@polkadot/react-query';

import { useTranslation } from '../translate.js';

interface Props {
  className?: string;
  info?: DeriveSociety;
  payoutTotal?: BN;
}

function Summary ({ className = '', info, payoutTotal }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const members = useCall<unknown[]>(api.derive.society.members);
  const bestNumber = useBestNumber();

  const pot = useMemo(
    () => info && info.pot.gtn(0)
      ? info.pot
      : null,
    [info]
  );

  return (
    <StyledSummaryBox className={className}>
      <section className='media--1100'>
        {info && members && (
          <CardSummary label={t('members')}>
            {members.length}&nbsp;/&nbsp;{info.maxMembers?.toString()}
          </CardSummary>
        )}
      </section>
      {bestNumber && (
        <>
          {api.consts.society.rotationPeriod && (
            <section>
              <CardSummary
                label={t('rotation')}
                progress={{
                  total: api.consts.society.rotationPeriod as unknown as BN,
                  value: bestNumber.mod(api.consts.society.rotationPeriod as unknown as BN),
                  withTime: true
                }}
              />
            </section>
          )}
          <section className='media--1200'>
            <CardSummary
              label={t('challenge')}
              progress={{
                total: api.consts.society.challengePeriod,
                value: bestNumber.mod(api.consts.society.challengePeriod),
                withTime: true
              }}
            />
          </section>
        </>
      )}
      <section>
        {payoutTotal && (
          <CardSummary label={t('payouts')}>
            <FormatBalance
              value={payoutTotal}
              withSi
            />
          </CardSummary>
        )}
        {pot && (
          <CardSummary label={t('pot')}>
            <FormatBalance
              value={pot}
              withSi
            />
          </CardSummary>
        )}
      </section>
    </StyledSummaryBox>
  );
}

const StyledSummaryBox = styled(SummaryBox)`
  .society--header--account {
    white-space: nowrap;

    .ui--AccountName {
      display: inline-block;
    }

    .ui--IdentityIcon {
      margin-right: 0.5rem;
    }
  }
`;

export default React.memo(Summary);
