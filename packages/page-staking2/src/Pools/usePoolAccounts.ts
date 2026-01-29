// Copyright 2017-2025 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { BN } from '@polkadot/util';
import type { PoolAccounts } from './types.js';

import { useMemo } from 'react';

import { createNamedHook, useApi } from '@polkadot/react-hooks';
import { bnToU8a, stringToU8a, u8aConcat } from '@polkadot/util';

const EMPTY_H256 = new Uint8Array(32);
const MOD_PREFIX = stringToU8a('modl');
const U32_OPTS = { bitLength: 32, isLe: true };

function createAccount (api: ApiPromise, palletId: Uint8Array, poolId: BN, index: number): string {
  return api.registry.createType('AccountId32', u8aConcat(
    MOD_PREFIX,
    palletId,
    new Uint8Array([index]),
    bnToU8a(poolId, U32_OPTS),
    EMPTY_H256
  )).toString();
}

export function createAccounts (api: ApiPromise, poolId: BN): PoolAccounts {
  const palletId = api.consts.nominationPools.palletId.toU8a();

  return {
    rewardId: createAccount(api, palletId, poolId, 1),
    stashId: createAccount(api, palletId, poolId, 0)
  };
}

function usePoolAccountsImpl (poolId: BN): PoolAccounts {
  const { api } = useApi();

  return useMemo(
    () => createAccounts(api, poolId),
    [api, poolId]
  );
}

export default createNamedHook('usePoolAccounts', usePoolAccountsImpl);
