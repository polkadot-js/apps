// Copyright 2017-2020 @polkadot/app-bounties authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BountyIndex } from '@polkadot/types/interfaces';

import BN from 'bn.js';
import React from 'react';
import styled from 'styled-components';

import { DeriveBalancesAccount } from '@polkadot/api-derive/types';
import { useTranslation } from '@polkadot/app-treasury/translate';
import { CardSummary, SummaryBox } from '@polkadot/react-components';
import Progress from '@polkadot/react-components/Progress';
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

function Summary ({ activeBounties, className = '' }: Props): React.ReactElement<Props> {
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
    <SummaryBox className={`ui--BountySummary ${className}`}>
      <section className='NormalSection'>
        <CardSummary label={t<string>('active')}>
          {activeBounties}
        </CardSummary>
        <CardSummary label={t<string>('past')}>
          {bountyIndex?.toHuman()}
        </CardSummary>
        {bestNumber && spendPeriod?.gtn(0) && (
          <CardSummary label={t<string>('next bounty founding in')}>
            <BlockToTime
              blocks={spendPeriod.sub(bestNumber.mod(spendPeriod))}
              className='timer'
            />
          </CardSummary>
        )}
      </section>
      <section className='HighlightedSection'>
        <header>{t<string>('treasury')}</header>
        <div className='content'>
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
            >
              <BlockToTime
                blocks={spendPeriod}
                className='timer'
              />
            </CardSummary>
          )}
          {bestNumber && spendPeriod?.gtn(0) && (
            <Progress
              className='media--1000'
              size='mediumSmall'
              total={spendPeriod}
              value={bestNumber.mod(spendPeriod)} />
          )}
        </div>
      </section>
    </SummaryBox>
  );
}

export default React.memo(styled(Summary)`
  && label, && header {
    font-size: 0.714rem;
    font-weight: 600;
    text-transform: uppercase;
  }
  & .NormalSection {
    label {
      color: #8B8B8B;
    }
    .ui--Labelled-content {
      text-align: left;
    }
    article:first-child {
      padding: 0 1.5rem 0 0;
    }
    article:last-child .ui--Labelled-content {
      text-align: right;
    }
  }
  & .HighlightedSection {
    background-color: #fff;
    z-index: 10;
    position: relative;
    display: flex;
    flex-direction: column;
    header {
      position: relative;
      z-index: 30;
      margin: 0.286rem 0.5rem;
      text-align: left;
    }
    .content {
      margin: 0 1.15rem 1.2rem 5rem;
      position: relative;
      z-index: 30;
      display: flex;
      flex-direction: row;
      label {
        color: #4D4D4D;
      }
    }
    ::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      z-index: 20;
      width: 100%;
      height: 100%;
      opacity: 0.1;
    }
  }
  .ui--Labelled-content {
    font-size: 1rem;
    font-weight: 500;
    color: black;
    .ui--FormatBalance-postfix {
      font-weight: 500;
      color: black;
      opacity: 1;
    }
    .timeUnits, .ui--FormatBalance-unit {
      font-weight: 300;
      color: #8B8B8B;
      font-size: 1rem;
    }
  }
`);
