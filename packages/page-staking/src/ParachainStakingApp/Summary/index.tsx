// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BlockNumber } from '@polkadot/types/interfaces';
import type { ParachainStakingRoundInfo } from '../types';

import React from 'react';

import { CardSummary, Spinner, SummaryBox } from '@polkadot/react-components';
import { FormatBalance } from '@polkadot/react-query';
import { formatNumber } from '@polkadot/util';

import { useTranslation } from '../../translate';
import { StakingInfo } from '../types';
import SummaryRound from './SummaryRound';

interface Props {
  className?: string;
  roundInfo?: ParachainStakingRoundInfo;
  stakingInfo: StakingInfo;
  bestNumberFinalized: BlockNumber|undefined
}

function Summary ({ bestNumberFinalized, className = '', roundInfo, stakingInfo: { activeDelegatorsCount, allDelegatorsCount, collatorCommission, inflationPrct, parachainBondInfoPrct, selectedCollatorCount, totalCollatorCount, totalSelected, totalSelectedStaked } }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  return (
    <SummaryBox className={`${className}`}>
      <section>
        <CardSummary label={t<string>('collators')}>
          {totalSelected
            ? <>{formatNumber(selectedCollatorCount)}&nbsp;/&nbsp;{formatNumber(totalSelected)}</>
            : <Spinner noLabel />
          }
        </CardSummary>
        <CardSummary
          className='media--900'
          label={t<string>('waiting')}
        >
          {totalCollatorCount && totalSelected
            ? totalCollatorCount - totalSelected > 0 ? formatNumber(totalCollatorCount - totalSelected) : 0
            : <Spinner noLabel />
          }
        </CardSummary>
      </section>
      <section>
        <CardSummary
          className='media--1000'
          label={
            t<string>('active / delegators')
          }
        >
          {activeDelegatorsCount >= 0
            ? (
              <>
                {formatNumber(activeDelegatorsCount)}
                {allDelegatorsCount > 0 && (
                  <>&nbsp;/&nbsp;{formatNumber(allDelegatorsCount)}</>
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
          label={t<string>('% of inflation for parachain rent')}
        >
          {(parachainBondInfoPrct)
            ? (
              <>{parachainBondInfoPrct}</>

            )
            : <Spinner noLabel />}
        </CardSummary>
        <CardSummary
          className='media--1200'
          label={t<string>('% collator commission')}
        >
          {(collatorCommission)
            ? (
              <>{collatorCommission}</>

            )
            : <Spinner noLabel />}
        </CardSummary>
      </section>
      <section>
        <CardSummary
          className='media--1200'
          label={t<string>('current round')}
        >
          {roundInfo
            ? roundInfo.current.toHuman()
            : <Spinner noLabel />}
        </CardSummary>
        <SummaryRound
          bestNumberFinalized={bestNumberFinalized}
          roundInfo={roundInfo}
        />
      </section>
    </SummaryBox>
  );
}

export default React.memo(Summary);
