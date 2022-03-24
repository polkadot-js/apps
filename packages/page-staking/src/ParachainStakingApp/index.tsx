// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import '@moonbeam-network/api-augment';

import type { AppProps, ThemeProps } from '@polkadot/react-components/types';
import type { Option, StorageKey, u32 } from '@polkadot/types';
import type { Perbill } from '@polkadot/types/interfaces/runtime';
import type { ParachainStakingCandidateMetadata, ParachainStakingDelegations, ParachainStakingInflationInflationInfo, ParachainStakingParachainBondConfig, ParachainStakingRoundInfo, ParachainStakingSetOrderedSetBond } from '@polkadot/types/lookup';

import React, { useEffect, useMemo, useState } from 'react';
import { Route, Switch } from 'react-router-dom';
import styled from 'styled-components';

import { Tabs } from '@polkadot/react-components';
import { useApi, useBestNumber, useCall } from '@polkadot/react-hooks';
import { BN } from '@polkadot/util';

import { useTranslation } from '../translate';
import CandidatesList from './CandidatesList';
import Summary from './Summary';
import { CandidateState } from './types';
import UserDelegations from './UserDelegations';

function ParachainStakingApp ({ basePath, className = '' }: AppProps): React.ReactElement<AppProps> {
  const { api } = useApi();
  const { t } = useTranslation();

  // summary info
  const roundInfo = useCall<ParachainStakingRoundInfo>(api.query.parachainStaking.round);
  const totalSelected = useCall<u32>(api.query.parachainStaking.totalSelected)?.toNumber();
  const totalSelectedStaked = useCall<BN>(api.query.parachainStaking.staked, [roundInfo?.current]);
  const inflation = (useCall<ParachainStakingInflationInflationInfo>(api.query.parachainStaking.inflationConfig));
  const inflationPrct = inflation?.annual.ideal.toHuman();
  const parachainBondInfo = useCall<ParachainStakingParachainBondConfig>(api.query.parachainStaking.parachainBondInfo);
  const parachainBondInfoPrct = parachainBondInfo?.percent.toHuman();
  const bestNumberFinalized = useBestNumber();
  const collatorCommission = (useCall<Perbill>(api.query.parachainStaking.collatorCommission));
  // Fetch all collator states using entries
  const allCandidates = useCall<[StorageKey, Option<ParachainStakingCandidateMetadata>][]>((api.query.parachainStaking.candidateInfo).entries, []);
  const allCandidatesTopDelegations = useCall<[StorageKey, Option<ParachainStakingDelegations>][]>((api.query.parachainStaking.topDelegations).entries, []);
  const allCandidatesBottomDelegations = useCall<[StorageKey, Option<ParachainStakingDelegations>][]>((api.query.parachainStaking.bottomDelegations).entries, []);
  // Sort them and extract nominator numbers
  const [allCandidatesSorted, setAllCandidatesSorted] = useState<CandidateState[]>([]);
  const [activeDelegatorsCount, setActiveDelegatorsCount] = useState(-1);
  const [allDelegatorsCount, setAllDelegatorsCount] = useState(-1);

  // list info
  const candidatePool = useCall<ParachainStakingSetOrderedSetBond>(api.query.parachainStaking.candidatePool);
  const selectedCandidates = useCall<string[]>(api.query.parachainStaking.selectedCandidates);

  useEffect(() => {
    let _allDelegatorCount = 0;
    let _activeDelegatorCount = 0;
    const sorted: CandidateState[] = [];

    if (!allCandidatesTopDelegations || !allCandidatesBottomDelegations || !selectedCandidates) {
      return;
    }

    // unwrap output
    allCandidates?.forEach(([storageKey, candidateInfoRaw], i) => {
      const topDelegations = allCandidatesTopDelegations[i][1].unwrap();
      const bottomDelegations = allCandidatesBottomDelegations[i][1].unwrap();
      const candidateInfo = candidateInfoRaw.unwrap();
      const candidateAddress = (storageKey.toHuman() as string[])[0];

      sorted.push({
        bottomDelegations: bottomDelegations.delegations,
        id: candidateAddress,
        topDelegations: topDelegations.delegations,
        totalBacking: candidateInfo.bond.add(topDelegations.total).add(bottomDelegations.total),
        ...candidateInfo
      } as CandidateState);

      // extract relevant nominator stats
      if (selectedCandidates.includes(candidateAddress)) {
        _activeDelegatorCount += candidateInfo.delegationCount.toNumber();
      }

      _allDelegatorCount += candidateInfo.delegationCount.toNumber();
    });
    // sort by total staked
    sorted.sort((a, b) => {
      return a.totalCounted.lt(b.totalCounted) ? 1 : -1;
    });
    setAllCandidatesSorted(sorted);
    setActiveDelegatorsCount(_activeDelegatorCount);
    setAllDelegatorsCount(_allDelegatorCount);
  }, [allCandidates, selectedCandidates, allCandidatesTopDelegations, allCandidatesBottomDelegations]);

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
  ]
  , [t]);

  return (
    <main className={`staking--App ${className}`}>
      <Tabs
        basePath={basePath}
        items={items}
      />
      <Switch>
        <Route path={`${basePath}/delegations`}>
          <UserDelegations
            roundInfo={roundInfo}
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
          <CandidatesList
            allCandidatesSorted={allCandidatesSorted}
          />
        </Route>
      </Switch>
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
