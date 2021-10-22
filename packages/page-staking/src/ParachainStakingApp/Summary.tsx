// Copyright 2017-2021 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveStakingOverview } from '@polkadot/api-derive/types';
import type { SortedTargets } from '../types';
import type { BlockNumber } from '@polkadot/types/interfaces';


import React from 'react';
import styled from 'styled-components';

import { CardSummary, Spinner, SummaryBox } from '@polkadot/react-components';
import { formatNumber } from '@polkadot/util';
import { useTranslation } from '../translate';
import SummaryRound, { RoundInfo } from './SummaryRound';

interface Props {
  className?: string;
  //isVisible: boolean;
  roundInfo:RoundInfo<unknown>;
  stakingInfo:StakingInfo;
  bestNumberFinalized:BlockNumber|undefined
  // nominators?: string[];
  // stakingOverview?: DeriveStakingOverview;
  // targets: SortedTargets;
}

export interface OwnerAmount {owner:string,amount:string}

// export type NominatorState=[[number],{nominations:OwnerAmount[],revocations:any[],total:string,scheduled_revocations_count:number,scheduled_revocations_total:number,status:string}]

// export type NominatorInfo={nominatorCount:number,totalNominatorStaked:number}

interface StakingInfo{
  totalSelected:number,
  totalSelectedStaked:string,
  totalCollatorCount:number,
  // nominatorInfo:NominatorInfo,
  totalStaked:string
  inflationPrct:string|undefined
  parachainBondInfoPrct:string|undefined
}


function Summary ({ className = '',roundInfo, bestNumberFinalized,stakingInfo:{parachainBondInfoPrct,inflationPrct,totalSelected,totalSelectedStaked,totalCollatorCount,totalStaked} } : Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  console.log("bestNumberFinalized 2",bestNumberFinalized)

  return (
    <SummaryBox className={`${className}`}>
      <section>
        <CardSummary label={t<string>('collators')}>
          {totalSelected
            ? <>{formatNumber(totalSelected)}&nbsp;/&nbsp;{formatNumber(totalSelected)}</> //TODO:differntiate the two
            : <Spinner noLabel />
          }
        </CardSummary>
        <CardSummary
          className='media--900'
          label={t<string>('waiting')}
        >
          {totalCollatorCount
            ? formatNumber(totalCollatorCount-totalSelected)
            : <Spinner noLabel />
          }
        </CardSummary>
      </section>
      <section>
        {/* {(idealStake > 0) && Number.isFinite(idealStake) && (
          <CardSummary
            className='media--1400'
            label={t<string>('ideal staked')}
          >
            <>{(idealStake * 100).toFixed(1)}%</>
          </CardSummary>
        )} */}
{(totalSelectedStaked !=="0") && (
          <CardSummary
            className='media--1300'
            label={t<string>('staked by selected candidates')}
          >
            <>{(totalSelectedStaked)}</>
          </CardSummary>
        )}
        {(totalStaked !=="0") && (
          <CardSummary
            className='media--1300'
            label={t<string>('total staked')}
          >
            <>{(totalStaked)}</>
          </CardSummary>
        )}

<CardSummary
            className='media--1200'
            label={t<string>('inflation')}
          >
        {(inflationPrct)? (
            <>{inflationPrct}</>
          
        ): <Spinner noLabel />}
        </CardSummary>
        <CardSummary
          className='media--1200'
          label={t<string>('parachain bond')}
        >
        {(parachainBondInfoPrct)? (
            <>{parachainBondInfoPrct}</>
          
        ): <Spinner noLabel />}
        </CardSummary>
      </section>
      <section>
        <SummaryRound roundInfo={roundInfo} bestNumberFinalized={bestNumberFinalized} />
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
