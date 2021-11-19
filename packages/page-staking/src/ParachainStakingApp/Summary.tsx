// Copyright 2017-2021 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BlockNumber } from '@polkadot/types/interfaces';

import React from 'react';
import styled from 'styled-components';

import { CardSummary, Spinner, SummaryBox } from '@polkadot/react-components';
import { FormatBalance } from '@polkadot/react-query';
import { BN, formatNumber } from '@polkadot/util';

import { useTranslation } from '../translate';
import SummaryRound, { RoundInfo } from './SummaryRound';

interface Props {
  className?: string;
  roundInfo: RoundInfo<unknown>;
  stakingInfo: StakingInfo;
  bestNumberFinalized: BlockNumber|undefined
}

export interface OwnerAmount {owner: string, amount: BN}

interface StakingInfo{
  collatorCommission: string|undefined,
  totalSelected: number,
  totalSelectedStaked: BN,
  totalCollatorCount: number,
  selectedCollatorCount: number,
  inflationPrct: string|undefined
  parachainBondInfoPrct: string|undefined
  activeNominatorsCount: number
  allNominatorsCount: number
}

function Summary ({ bestNumberFinalized, className = '', roundInfo, stakingInfo: { activeNominatorsCount, allNominatorsCount, collatorCommission, inflationPrct, parachainBondInfoPrct, selectedCollatorCount, totalCollatorCount, totalSelected, totalSelectedStaked } }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  return (
    <SummaryBox className={`${className}`}>
      <section>
        <CardSummary label={t<string>('collators')}>
          {totalSelected
            ? <>{formatNumber(selectedCollatorCount)}&nbsp;/&nbsp;{formatNumber(totalSelected)}</> // TODO:differntiate the two
            : <Spinner noLabel />
          }
        </CardSummary>
        <CardSummary
          className='media--900'
          label={t<string>('waiting')}
        >
          {totalCollatorCount
            ? formatNumber(totalCollatorCount - totalSelected)
            : <Spinner noLabel />
          }
        </CardSummary>
      </section>
      <section>
        <CardSummary
          className='media--1000'
          label={
            t<string>('active / nominators')
          }
        >
          {activeNominatorsCount > 0
            ? (
              <>
                {formatNumber(activeNominatorsCount)}
                {allNominatorsCount > 0 && (
                  <>&nbsp;/&nbsp;{formatNumber(allNominatorsCount)}</>
                )}
              </>
            )
            : <Spinner noLabel />
          }
        </CardSummary>
        {(totalSelectedStaked && totalSelectedStaked.toString() !== '0') && (
          <CardSummary
            className='media--1300'
            label={t<string>('total staked by selected candidates')}
          >
            <FormatBalance value={totalSelectedStaked} />
          </CardSummary>
        )}

        <CardSummary
          className='media--1200'
          label={t<string>('inflation')}
        >
          {(inflationPrct)
            ? (
              <>{inflationPrct}</>

            )
            : <Spinner noLabel />}
        </CardSummary>
        <CardSummary
          className='media--1200'
          label={t<string>('% of inflation for parachain rent')} // TODO: add translation??
        >
          {(parachainBondInfoPrct)
            ? (
              <>{parachainBondInfoPrct}</>

            )
            : <Spinner noLabel />}
        </CardSummary>
        <CardSummary
          className='media--1200'
          label={t<string>('% collator commission')} // TODO: add translation??
        >
          {(collatorCommission)
            ? (
              <>{collatorCommission}</>

            )
            : <Spinner noLabel />}
        </CardSummary>
      </section>
      <section>
        <SummaryRound
          bestNumberFinalized={bestNumberFinalized}
          roundInfo={roundInfo}
        />
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
