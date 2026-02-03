// Copyright 2017-2026 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveBalancesAll } from '@polkadot/api-derive/types';
import type { BN } from '@polkadot/util';

import { useMemo } from 'react';

import { createNamedHook } from './createNamedHook.js';
import { useApi } from './useApi.js';
import { useCall } from './useCall.js';
import { useStakingAsyncApis } from './useStakingAsyncApis.js';

export interface VestingInfo {
  isVesting: boolean;
  vestedBalance: BN;
  vestedClaimable: BN;
  vesting: {
    startingBlock: BN;
    endBlock: BN;
    perBlock: BN;
    locked: BN;
    vested: BN;
  }[];
  vestingTotal: BN;
  vestingLocked: BN;
}

/**
 * Gets the account vesting information from the correct chain.
 * After Asset Hub migration, vesting data lives on Asset Hub (paraId 1000),
 * not on the relay chain. This hook automatically queries the correct chain.
 *
 * @param accountAddress The account address of which vesting info is to be returned
 * @returns vesting information for the account
 */
function useVestingImpl (accountAddress: string): VestingInfo | undefined {
  const { api } = useApi();
  const { ahApi, isRelayChain } = useStakingAsyncApis();

  // Determine which API to use for vesting queries
  // If on relay chain, vesting data is on Asset Hub
  // Otherwise, vesting data is on the current chain
  const vestingApi = isRelayChain && ahApi ? ahApi : api;

  const balancesAll = useCall<DeriveBalancesAll>(vestingApi.derive.balances?.all, [accountAddress]);

  return useMemo((): VestingInfo | undefined => {
    if (!balancesAll) {
      return undefined;
    }

    return {
      isVesting: balancesAll.isVesting,
      vestedBalance: balancesAll.vestedBalance,
      vestedClaimable: balancesAll.vestedClaimable,
      vesting: balancesAll.vesting,
      vestingLocked: balancesAll.vestingLocked,
      vestingTotal: balancesAll.vestingTotal
    };
  }, [balancesAll]);
}

export const useVesting = createNamedHook('useVesting', useVestingImpl);
