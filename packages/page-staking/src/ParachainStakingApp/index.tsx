// Copyright 2017-2021 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveStakingOverview } from '@polkadot/api-derive/types';
import type { AppProps, ThemeProps } from '@polkadot/react-components/types';
import type { HeaderExtended } from '@polkadot/api-derive/types';
import type { BlockNumber } from '@polkadot/types/interfaces';


import type { ElectionStatus, ParaValidatorIndex, ValidatorId } from '@polkadot/types/interfaces';

import React, { useCallback, useMemo, useState } from 'react';
import { Route, Switch } from 'react-router';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';

import { HelpOverlay, Tabs } from '@polkadot/react-components';
import { useAccounts, useApi, useAvailableSlashes, useBestNumber, useCall, useCallMulti, useFavorites, useOwnStashInfos } from '@polkadot/react-hooks';
import { isFunction } from '@polkadot/util';

import basicMd from '../md/basic.md';
// import Summary from '../Overview/Summary';
import Actions from '../Actions';
import ActionsBanner from '../ActionsBanner';
import { STORE_FAVS_BASE } from '../constants';
import Overview from '../Overview';
import Payouts from '../Payouts';
import Query from '../Query';
import Slashes from '../Slashes';
import Targets from '../Targets';
//import useSortedTargets from './useSortedTargets';
const HIDDEN_ACC = ['actions', 'payout'];

import type { SortedTargets } from '../types';


import SummarySession from '@polkadot/app-explorer/SummarySession';
import { CardSummary, Spinner, SummaryBox } from '@polkadot/react-components';
import { formatNumber } from '@polkadot/util';

import { useTranslation } from '../translate';
import useSortedTargets from '../useSortedTargets';
import { RoundInfo } from './SummaryRound';
import Summary, {OwnerAmount } from './Summary';

// function extractNominatorInfo(state:NominatorState[]|undefined,selectedCandidates:string[]):NominatorInfo{
//   console.log("extractNominatorInfo",state)
//   let nominatorCount=0
//   let totalNominatorStaked:number=0
//   if (!state||state.length==0){
//     return {nominatorCount:0,totalNominatorStaked:0}
//   }
//   state.forEach((nominator)=>{
//     let isSelected=false
//     nominator[1].nominations.forEach((nomination)=>{
//       if (selectedCandidates.includes(nomination.owner)){
//         totalNominatorStaked+=Number(nomination.amount)
//         isSelected=true
//       }
//     })
//     if (isSelected){
//       nominatorCount+=1
//     }
//   })
//   return {nominatorCount,totalNominatorStaked}
// }

function ParachainStakingApp ({ basePath, className = '' }: AppProps): React.ReactElement<AppProps> {
  const { t } = useTranslation();
  const { api } = useApi();
  //const { areAccountsLoaded, hasAccounts } = useAccounts();
  // const { pathname } = useLocation();
  // const [withLedger, setWithLedger] = useState(false);
  // const [favorites, toggleFavorite] = useFavorites(STORE_FAVS_BASE);
  //const stakingOverview = useCall<DeriveStakingOverview>(api.derive.staking.overview);
  const roundInfo = useCall<RoundInfo<unknown>>(api.query.parachainStaking.round);
  // const roundInfo:RoundInfo<number>|undefined=roundInfoRaw?{
  //   first:(roundInfoRaw?.first as any).toNumber(),
  //   current:(roundInfoRaw?.current as any).toNumber(),
  //   length:(roundInfoRaw?.length as any).toNumber()
  // }:undefined
  const totalSelected = Number(useCall<unknown>(api.query.parachainStaking.totalSelected));
  console.log("totalSelected",totalSelected)
  const totalSelectedStaked = (useCall<unknown>(api.query.parachainStaking.staked,[roundInfo?.current]));
  console.log("totalSelectedStaked",totalSelectedStaked)
  const totalStaked = (useCall<unknown>(api.query.parachainStaking.total));
  console.log("totalStaked",totalStaked)
  const inflation = (useCall<{annual:{ideal:any}}|undefined>(api.query.parachainStaking.inflationConfig));
  const inflationPrct=inflation?.annual.ideal.toHuman()
  console.log("inflationPrct",inflationPrct)
  const parachainBondInfo = (useCall<{percent:any}|undefined>(api.query.parachainStaking.parachainBondInfo));
  const parachainBondInfoPrct=parachainBondInfo?.percent.toHuman()
  console.log("parachainBondInfoPrct",parachainBondInfoPrct)
  // const selectedCandidates = useCall<string[]>(api.query.parachainStaking.selectedCandidates);
  const candidatePool = useCall<OwnerAmount[]>(api.query.parachainStaking.candidatePool);
  // const head=useCall<HeaderExtended>(api.derive.chain.getHeader())
//   const header = //useCall<{number:BlockNumber}>(api.derive.chain.subscribeNewHeads);
// console.log("HEADER",header)
  const bestNumberFinalized = useBestNumber();// header?.number
  console.log("bestNumberFinalized",bestNumberFinalized,bestNumberFinalized?.toHuman(),Number(bestNumberFinalized))

  //let nominatorState = useCall<NominatorState[]>(api.query.parachainStaking.nominatorState2,[null]);
  // @ts-ignore
  // console.log("nominatorState",nominatorState?.toHuman())
  //   // @ts-ignore
  // if (nominatorState?.toHuman()==null){
  //   nominatorState=[]
  // }
  // async function test(){
  //   console.log("TEST",(await api.query.parachainStaking.nominatorState2()).toHuman())
  // }
  // test()
  //const nominatorInfo=extractNominatorInfo(nominatorState||[],selectedCandidates||[])
//   const [isInElection, paraValidators] = useCallMulti<[boolean, Record<string, boolean>]>([
//     api.query.staking.eraElectionStatus,
//     api.query.session.validators,
//     (api.query.parasShared || api.query.shared)?.activeValidatorIndices
//   ], optionsParaValidators);
  // const ownStashes = useOwnStashInfos();
  // const slashes = useAvailableSlashes();
  // const targets = useSortedTargets(favorites, withLedger);

  // const hasQueries = useMemo(
  //   () => hasAccounts && !!(api.query.imOnline?.authoredBlocks) && !!(api.query.staking.activeEra),
  //   [api, hasAccounts]
  // );

  // const ownValidators = useMemo(
  //   () => (ownStashes || []).filter(({ isStashValidating }) => isStashValidating),
  //   [ownStashes]
  // );

  // const toggleLedger = useCallback(
  //   () => setWithLedger(true),
  //   []
  // );

  // const items = useMemo(() => [
  //   {
  //     isRoot: true,
  //     name: 'overview',
  //     text: t<string>('Overview')
  //   },
  //   {
  //     name: 'actions',
  //     text: t<string>('Account actions')
  //   },
  //   isFunction(api.query.staking.activeEra) && hasAccounts && ownStashes && (ownStashes.length !== 0) && {
  //     name: 'payout',
  //     text: t<string>('Payouts')
  //   },
  //   {
  //     alias: 'returns',
  //     name: 'targets',
  //     text: t<string>('Targets')
  //   },
  //   {
  //     name: 'waiting',
  //     text: t<string>('Waiting')
  //   },
  //   {
  //     count: slashes.reduce((count, [, unapplied]) => count + unapplied.length, 0),
  //     name: 'slashes',
  //     text: t<string>('Slashes')
  //   },
  //   {
  //     hasParams: true,
  //     name: 'query',
  //     text: t<string>('Validator stats')
  //   }
  // ].filter((q): q is { name: string; text: string } => !!q), [api, hasAccounts, ownStashes, slashes, t]);

  return (
    <main className={`staking--App ${className}`}>
      {/* <HelpOverlay md={basicMd as string} /> */}
      {/* <Tabs
        basePath={basePath}
        hidden={
          areAccountsLoaded && !hasAccounts
            ? HIDDEN_ACC
            : undefined
        }
        items={items}
      /> */}
      <Summary
        //isVisible={true}//{pathname === basePath}
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
        // targets={targets}
      />
      {/* <Switch>
        <Route path={`${basePath}/payout`}>
          <Payouts
            isInElection={isInElection}
            ownValidators={ownValidators}
          />
        </Route>
        <Route path={[`${basePath}/query/:value`, `${basePath}/query`]}>
          <Query />
        </Route>
        <Route path={`${basePath}/slashes`}>
          <Slashes
            ownStashes={ownStashes}
            slashes={slashes}
          />
        </Route>
        <Route path={`${basePath}/targets`}>
          <Targets
            isInElection={isInElection}
            ownStashes={ownStashes}
            stakingOverview={stakingOverview}
            targets={targets}
            toggleFavorite={toggleFavorite}
            toggleLedger={toggleLedger}
          />
        </Route>
        <Route path={`${basePath}/waiting`}>
          <Overview
            favorites={favorites}
            hasQueries={hasQueries}
            isIntentions
            stakingOverview={stakingOverview}
            targets={targets}
            toggleFavorite={toggleFavorite}
            toggleLedger={toggleLedger}
          />
        </Route>
      </Switch> */}
      {/* <Actions
        className={pathname === `${basePath}/actions` ? '' : 'staking--hidden'}
        isInElection={isInElection}
        ownStashes={ownStashes}
        targets={targets}
      /> */}
      {/* {basePath === pathname && hasAccounts && (ownStashes?.length === 0) && (
        <ActionsBanner />
      )} */}
      {/* <Overview
        className={basePath === pathname ? '' : 'staking--hidden'}
        favorites={favorites}
        hasQueries={hasQueries}
        paraValidators={paraValidators}
        stakingOverview={stakingOverview}
        targets={targets}
        toggleFavorite={toggleFavorite}
      /> */}
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
