// Copyright 2017-2021 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AppProps, ThemeProps } from '@polkadot/react-components/types';

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import { useApi, useBestNumber, useCall } from '@polkadot/react-hooks';
import { BN } from '@polkadot/util';

import { CollatorState2 } from './CollatorDetails';
import CollatorList from './CollatorList';
import Summary, { OwnerAmount } from './Summary';
import { RoundInfo } from './SummaryRound';

interface ApiResult{
  toHuman: () => string
}

interface CollatorState2Raw {
  unwrap: () => CollatorState2
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
  // Fetch all collator states using entries
  const allCollators = useCall<[Uint8Array, CollatorState2Raw][]>(api.query.parachainStaking.collatorState2.entries, []);
  // Sort them and extract nominator numbers
  const [allCollatorsSorted, setAllCollatorsSorted] = useState<CollatorState2[]>([]);
  const [activeNominatorsCount, setActiveNominatorsCount] = useState(0);
  const [allNominatorsCount, setAllNominatorsCount] = useState(0);

  // list info
  const candidatePool = useCall<OwnerAmount[]>(api.query.parachainStaking.candidatePool);
  const selectedCandidates = useCall<OwnerAmount[]>(api.query.parachainStaking.selectedCandidates);

  useEffect(() => {
    let _allNominatorCount = 0;
    let _activeNominatorCount = 0;
    const sorted: CollatorState2[] = [];

    // unwrap output
    allCollators?.forEach(([_, collatorStateRaw]) => {
      sorted.push(collatorStateRaw.unwrap());
    });
    // sort by total staked
    sorted.sort((a, b) => {
      return Number(BigInt(b.totalCounted) - BigInt(a.totalCounted));
    }).forEach((collatorState, i) => {
      // extract relevant nominator stats
      if (selectedCandidates?.length && i < selectedCandidates?.length) { _activeNominatorCount += collatorState.topNominators.length; }

      _allNominatorCount += collatorState.topNominators.length + collatorState.bottomNominators.length;
    });
    setAllCollatorsSorted(sorted);
    setActiveNominatorsCount(_activeNominatorCount);
    setAllNominatorsCount(_allNominatorCount);
  }, [allCollators, selectedCandidates]);

  return (
    <main className={`staking--App ${className}`}>

      <Summary
        bestNumberFinalized={bestNumberFinalized}
        roundInfo={roundInfo}
        stakingInfo={{
          activeNominatorsCount,
          allNominatorsCount,
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
        collatorInfo={{ maxNominatorsPerCollator: api.consts.parachainStaking.maxNominatorsPerCollator.toString(), minNomination: api.consts.parachainStaking.minNomination.toString() }}
      />
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
