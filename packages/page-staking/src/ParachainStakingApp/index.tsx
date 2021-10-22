// Copyright 2017-2021 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0
import type { AppProps, ThemeProps } from '@polkadot/react-components/types';


import React from 'react';

import styled from 'styled-components';
import {  useApi,  useBestNumber, useCall } from '@polkadot/react-hooks';

import { RoundInfo } from './SummaryRound';
import Summary, {OwnerAmount } from './Summary';


function ParachainStakingApp ({ basePath, className = '' }: AppProps): React.ReactElement<AppProps> {
  const { api } = useApi();
  const roundInfo = useCall<RoundInfo<unknown>>(api.query.parachainStaking.round);
  const totalSelected = Number(useCall<unknown>(api.query.parachainStaking.totalSelected));
  const totalSelectedStaked = (useCall<unknown>(api.query.parachainStaking.staked,[roundInfo?.current]));
  const totalStaked = (useCall<unknown>(api.query.parachainStaking.total));
  const inflation = (useCall<{annual:{ideal:any}}|undefined>(api.query.parachainStaking.inflationConfig));
  const inflationPrct=inflation?.annual.ideal.toHuman()
  const parachainBondInfo = (useCall<{percent:any}|undefined>(api.query.parachainStaking.parachainBondInfo));
  const parachainBondInfoPrct=parachainBondInfo?.percent.toHuman()
  const candidatePool = useCall<OwnerAmount[]>(api.query.parachainStaking.candidatePool);
  const bestNumberFinalized = useBestNumber();


  return (
    <main className={`staking--App ${className}`}>

      <Summary
        roundInfo={roundInfo}
        stakingInfo={{
          totalSelected,
          totalCollatorCount:candidatePool?.length,
          totalSelectedStaked:totalSelectedStaked?(totalSelectedStaked as any).toHuman():"",
          totalStaked:totalStaked?(totalStaked as any).toHuman():"",
          inflationPrct,
          parachainBondInfoPrct
        }}
        bestNumberFinalized={bestNumberFinalized}
      />
    </main>
  );
}


export const ParachainStakingPanel= React.memo(styled(ParachainStakingApp)(({ theme }: ThemeProps) => `
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
