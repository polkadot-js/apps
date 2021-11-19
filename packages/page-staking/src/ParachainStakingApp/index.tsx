// Copyright 2017-2021 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AppProps, ThemeProps } from '@polkadot/react-components/types';

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import { useApi, useBestNumber, useCall } from '@polkadot/react-hooks';

import Summary, { OwnerAmount } from './Summary';
import { RoundInfo } from './SummaryRound';
import CollatorList from './CollatorList';
import { BN, formatNumber } from '@polkadot/util';

interface ApiResult{
  toHuman: () => string
}
interface CandidateInfo{
  totalCounted:string
  totalBacking:string
  bond:string
  minContribution:string
}

function ParachainStakingApp ({ className = '' }: AppProps): React.ReactElement<AppProps> {
  const { api } = useApi();

  // summary info
  const roundInfo = useCall<RoundInfo<unknown>>(api.query.parachainStaking.round);
  const totalSelected = Number(useCall<string>(api.query.parachainStaking.totalSelected));
  const totalSelectedStaked = (useCall<BN>(api.query.parachainStaking.staked, [roundInfo?.current]));
  const inflation = (useCall<{annual: {ideal: ApiResult}}|undefined>(api.query.parachainStaking.inflationConfig));
  const inflationPrct = inflation?.annual.ideal.toHuman();
  const parachainBondInfo = (useCall<{percent: ApiResult}|undefined>(api.query.parachainStaking.parachainBondInfo));
  const parachainBondInfoPrct = parachainBondInfo?.percent.toHuman();
  const bestNumberFinalized = useBestNumber();
  const collatorCommission = (useCall<ApiResult|undefined>(api.query.parachainStaking.collatorCommission));

  // list info
  const candidatePool = useCall<OwnerAmount[]>(api.query.parachainStaking.candidatePool);


  return (
    <main className={`staking--App ${className}`}>

      <Summary
        bestNumberFinalized={bestNumberFinalized}
        roundInfo={roundInfo}
        stakingInfo={{
          inflationPrct,
          parachainBondInfoPrct,
          totalCollatorCount: candidatePool?.length,
          totalSelected,
          totalSelectedStaked,
          collatorCommission:collatorCommission?.toHuman()
        }}
      />
      <CollatorList collators={candidatePool} collatorInfo={{minNomination:api.consts.parachainStaking.minNomination,maxNominatorsPerCollator:api.consts.parachainStaking.maxNominatorsPerCollator}} />
    </main>
  );
}

export const ParachainStakingPanel = React.memo(styled(ParachainStakingApp)(({ theme }: ThemeProps) => `
  .staking--hidden {
    display: none;
  }

  .staking--Chart {
    margin-top: 1.5rem;

    h1 {
      margin-bottom: 0.5rem;
    }

    .ui--Spinner {
      margin: 2.5rem auto;
    }
  }

  .staking--optionsBar {
    margin: 0.5rem 0 1rem;
    text-align: center;
    white-space: normal;

    .staking--buttonToggle {
      display: inline-block;
      margin-right: 1rem;
      margin-top: 0.5rem;
    }
  }

  .ui--Expander.stakeOver {
    .ui--Expander-summary {
      color: var(--color-error);

    ${theme.theme === 'dark'
    ? `font-weight: bold;
      .ui--FormatBalance-value {

        > .ui--FormatBalance-postfix {
          opacity: 1;
        }
      }`
    : ''};
    }
  }
`));
