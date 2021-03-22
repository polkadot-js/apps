// Copyright 2017-2021 @polkadot/app-society authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type BN from 'bn.js';
import type { DeriveSociety } from '@polkadot/api-derive/types';

import React, { useMemo } from 'react';
import styled from 'styled-components';

import { CardSummary, SummaryBox } from '@polkadot/react-components';
import { useApi, useBestNumber, useCall } from '@polkadot/react-hooks';
import { FormatBalance } from '@polkadot/react-query';

import { useTranslation } from '../translate';

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
    <SummaryBox className={className}>
      <section className='media--1100'>
        {info && members && (
          <CardSummary label={t<string>('members')}>
            {members.length}&nbsp;/&nbsp;{info.maxMembers.toString()}
          </CardSummary>
        )}
      </section>
      {bestNumber && (
        <>
          <section>
            <CardSummary
              label={t<string>('rotation')}
              progress={{
                total: api.consts.society.rotationPeriod,
                value: bestNumber.mod(api.consts.society.rotationPeriod),
                withTime: true
              }}
            />
          </section>
          <section className='media--1200'>
            <CardSummary
              label={t<string>('challenge')}
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
          <CardSummary label={t<string>('payouts')}>
            <FormatBalance
              value={payoutTotal}
              withSi
            />
          </CardSummary>
        )}
        {pot && (
          <CardSummary label={t<string>('pot')}>
            <FormatBalance
              value={pot}
              withSi
            />
          </CardSummary>
        )}
      </section>
    </SummaryBox>
  );
}

export default React.memo(styled(Summary)`
  .society--header--account {
    white-space: nowrap;

    .ui--AccountName {
      display: inline-block;
    }

    .ui--IdentityIcon {
      margin-right: 0.5rem;
    }
  }
`);
