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
const ADDR_PREFIX_WST = stringToU8a('modlpy/nopls');

export function createAccount (api: ApiPromise, poolId: BN, index: number): string {
  return api.registry.createType(
    'AccountId32',
    u8aConcat(
      // HACK: We have a naming issue between Substrate master as well as Westend. Since
      // we don't quite have access to palletId, we here check the specName and adjust
      // accordingly
      api.runtimeVersion.specName.eq('westend')
        ? ADDR_PREFIX_WST
        : ADDR_PREFIX,
      new Uint8Array([index]),
      bnToU8a(poolId, { bitLength: 32 }),
      EMPTY_H256
    )
  ).toString();
}

function usePoolAccountsImpl (poolId: BN): PoolAccounts {
  const { api } = useApi();

  return useMemo(
    () => ({
      rewardId: createAccount(api, poolId, 1),
      stashId: createAccount(api, poolId, 0)
    }),
    [api, poolId]
  );
}

export default createNamedHook('usePoolAccounts', usePoolAccountsImpl);
