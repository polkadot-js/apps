// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { BN } from '@polkadot/util';
import type { PoolAccounts } from './types';

import { useMemo } from 'react';

import { createNamedHook, useApi } from '@polkadot/react-hooks';
import { bnToU8a, stringToU8a, u8aConcat } from '@polkadot/util';

const EMPTY_H256 = new Uint8Array(32);
const ADDR_PREFIX = stringToU8a('modlpy/npols');

export function createAccount (api: ApiPromise, poolId: BN, index: number): string {
  return api.registry.createType(
    'AccountId32',
    u8aConcat(ADDR_PREFIX, new Uint8Array([index]), bnToU8a(poolId, { bitLength: 32 }), EMPTY_H256)
  ).toString();
}

function usePoolAccountsImpl (poolId: BN): PoolAccounts {
  const { api } = useApi();

  return useMemo(
    () => ({
      accountReward: createAccount(api, poolId, 1),
      accountStash: createAccount(api, poolId, 0)
    }),
    [api, poolId]
  );
}

export default createNamedHook('usePoolAccounts', usePoolAccountsImpl);
