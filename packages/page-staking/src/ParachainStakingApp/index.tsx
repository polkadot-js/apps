// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AppProps, ThemeProps } from '@polkadot/react-components/types';

import React, { useEffect, useMemo, useState } from 'react';
import { Route, Switch, useLocation } from 'react-router-dom';
import styled from 'styled-components';

import { Tabs } from '@polkadot/react-components';
import { useApi, useBestNumber, useCall } from '@polkadot/react-hooks';
import { BN } from '@polkadot/util';

import { useTranslation } from '../translate';
import CollatorList from './CollatorList';
import Summary from './Summary';
import { ApiResult, CollatorState, CollatorStateRaw, OwnerAmount, RoundInfo } from './types';
import UserDelegations from './UserDelegations';

function ParachainStakingApp ({ basePath, className = '' }: AppProps): React.ReactElement<AppProps> {
  const { api } = useApi();
  const { t } = useTranslation();
  const { pathname } = useLocation();

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
  // Fetch all collator states using entries
  const allCollators = useCall<[Uint8Array, CollatorStateRaw][]>((api.query.parachainStaking.candidateState).entries, []);
  // Sort them and extract nominator numbers
  const [allCollatorsSorted, setAllCollatorsSorted] = useState<CollatorState[]>([]);
  const [activeDelegatorsCount, setActiveDelegatorsCount] = useState(-1);
  const [allDelegatorsCount, setAllDelegatorsCount] = useState(-1);

  // list info
  const candidatePool = useCall<OwnerAmount[]>(api.query.parachainStaking.candidatePool);
  const selectedCandidates = useCall<OwnerAmount[]>(api.query.parachainStaking.selectedCandidates);

  useEffect(() => {
    let _allDelegatorCount = 0;
    let _activeDelegatorCount = 0;
    const sorted: CollatorState[] = [];

    // unwrap output
    allCollators?.forEach(([_, collatorStateRaw]) => {
      sorted.push(collatorStateRaw.unwrap());
    });
    // sort by total staked
    sorted.sort((a, b) => {
      return Number(BigInt(b.totalCounted) - BigInt(a.totalCounted));
    }).forEach((collatorState, i) => {
      // TODO: move this work to the relevant location??
      // extract relevant nominator stats
      if (selectedCandidates?.length && i < selectedCandidates?.length) { _activeDelegatorCount += collatorState.topDelegations.length; }

      _allDelegatorCount += collatorState.topDelegations.length + collatorState.bottomDelegations.length;
    });
    setAllCollatorsSorted(sorted);
    setActiveDelegatorsCount(_activeDelegatorCount);
    setAllDelegatorsCount(_allDelegatorCount);
  }, [allCollators, selectedCandidates]);

  const items = useMemo(() => [
    {
      isRoot: true,
      name: 'overview',
      text: t<string>('Overview')
    },
    {
      name: 'delegations',
      text: t<string>('Account delegations')
    }
    // isFunction(api.query.staking.activeEra) && hasAccounts && ownStashes && (ownStashes.length !== 0) && {
    //   name: 'payout',
    //   text: t<string>('Payouts')
    // },
    // {
    //   alias: 'returns',
    //   name: 'targets',
    //   text: t<string>('Targets')
    // },
    // {
    //   name: 'waiting',
    //   text: t<string>('Waiting')
    // },
    // {
    //   count: slashes.reduce((count, [, unapplied]) => count + unapplied.length, 0),
    //   name: 'slashes',
    //   text: t<string>('Slashes')
    // },
    // {
    //   hasParams: true,
    //   name: 'query',
    //   text: t<string>('Validator stats')
    // }
  ] // .filter((q): q is { name: string; text: string } => !!q)
  , [t]);

  return (
    <main className={`staking--App ${className}`}>
      <Tabs
        basePath={basePath}
        // hidden={
        //   areAccountsLoaded && !hasAccounts
        //     ? HIDDEN_ACC
        //     : undefined
        // }
        items={items}
      />
      <Switch>
        <Route path={`${basePath}/delegations`}>
          <UserDelegations
            allCollators={allCollatorsSorted}
          />
        </Route>
        <Route path={`${basePath}`}>
          <Summary
            bestNumberFinalized={bestNumberFinalized}
            roundInfo={roundInfo}
            stakingInfo={{
              activeDelegatorsCount,
              allDelegatorsCount,
              collatorCommission: collatorCommission?.toHuman(),
              inflationPrct,
              parachainBondInfoPrct,
              selectedCollatorCount: selectedCandidates?.length,
              totalCollatorCount: candidatePool?.length,
              totalSelected,
              totalSelectedStaked
            }}
          />
          <CollatorList
            allCollatorsSorted={allCollatorsSorted}
            collatorInfo={{ maxDelegatorsPerCandidate: (api.consts.parachainStaking.maxDelegatorsPerCandidate).toString(), minDelegation: (api.consts.parachainStaking.minDelegation).toString() }}
          />
        </Route>
      </Switch>
      {/* <Summary
        bestNumberFinalized={bestNumberFinalized}
        roundInfo={roundInfo}
        stakingInfo={{
          activeDelegatorsCount,
          allDelegatorsCount,
          collatorCommission: collatorCommission?.toHuman(),
          inflationPrct,
          parachainBondInfoPrct,
          selectedCollatorCount: selectedCandidates?.length,
          totalCollatorCount: candidatePool?.length,
          totalSelected,
          totalSelectedStaked
        }}
      />
      <CollatorList
        allCollatorsSorted={allCollatorsSorted}
        collatorInfo={{ maxDelegatorsPerCandidate: (api.consts.parachainStaking.maxDelegatorsPerCandidate).toString(), minDelegation: (api.consts.parachainStaking.minDelegation).toString() }}
      /> */}
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
