// Copyright 2017-2020 @polkadot/app-bounties authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BountyIndex } from '@polkadot/types/interfaces';

import BN from 'bn.js';
import React from 'react';
import styled from 'styled-components';

import { DeriveBalancesAccount } from '@polkadot/api-derive/types';
import { useTranslation } from '@polkadot/app-treasury/translate';
import { CardSummary, SummaryBox } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';
import { BlockToTime, FormatBalance } from '@polkadot/react-query';
import { Balance } from '@polkadot/types/interfaces';
import { stringToU8a } from '@polkadot/util';

interface Props {
  activeBounties?: number;
  className?: string;
}
const TREASURY_ACCOUNT = stringToU8a('modlpy/trsry'.padEnd(32, '\0'));
const PM_DIV = new BN(1000000);

function Summary ({ activeBounties, className }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();

  const bountyIndex = useCall<BountyIndex>((api.query.bounties || api.query.treasury).bountyCount);
  const bestNumber = useCall<Balance>(api.derive.chain.bestNumber);
  const treasuryBalance = useCall<DeriveBalancesAccount>(api.derive.balances.account, [TREASURY_ACCOUNT]);
  const spendPeriod = api.consts.treasury.spendPeriod;

  const value = treasuryBalance?.freeBalance.gtn(0)
    ? treasuryBalance.freeBalance
    : null;
  const burn = treasuryBalance?.freeBalance.gtn(0) && !api.consts.treasury.burn.isZero()
    ? api.consts.treasury.burn.mul(treasuryBalance?.freeBalance).div(PM_DIV)
    : null;

  return (
    <SummaryBox className={className}>
      <section>
        <CardSummary label={t<string>('active')}>
          {activeBounties}
        </CardSummary>
        <CardSummary label={t<string>('past')}>
          {bountyIndex?.toHuman()}
        </CardSummary>
        {bestNumber && (
          <CardSummary label={t<string>('next bounty founding in')}>
            <BlockToTime
              blocks={bestNumber.mod(spendPeriod)}
              className='timer'
            />
          </CardSummary>
        )}
      </section>
      <section>
        {value && (
          <CardSummary label={t<string>('available')}>
            <FormatBalance
              value={value}
              withSi
            />
          </CardSummary>
        )}
        {burn && (
          <CardSummary
            className='media--1000'
            label={t<string>('next burn')}
          >
            <FormatBalance
              value={burn}
              withSi
            />
          </CardSummary>
        )}
        {bestNumber && spendPeriod?.gtn(0) && (
          <CardSummary
            label={t<string>('spend period')}
            progress={{
              total: spendPeriod,
              value: bestNumber.mod(spendPeriod),
              withTime: true
            }}
          />

        )}
      </section>
    </SummaryBox>
  );
}

export default React.memo(styled(Summary)`

`);
