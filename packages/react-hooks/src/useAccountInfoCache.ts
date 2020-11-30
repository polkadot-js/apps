// Copyright 2017-2020 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveAccountInfo } from '@polkadot/api-derive/types';
import type { AccountId, AccountIndex, Address } from '@polkadot/types/interfaces';

import { useEffect, useState } from 'react';

import { useApi } from './useApi';
import { useIsMountedRef } from './useIsMountedRef';

type VoidFn = () => void;

const CACHE: Record<string, DeriveAccountInfo> = {};

export function useAccountInfoCache (value: AccountId | AccountIndex | Address | string | null | undefined, isCached: boolean): DeriveAccountInfo | undefined {
  const mountedRef = useIsMountedRef();
  const { api } = useApi();
  const [state, setState] = useState<DeriveAccountInfo | undefined>(CACHE[value?.toString() || '']);

  useEffect((): () => void => {
    const address = value?.toString() || '';
    let unsubscribe: VoidFn | undefined;

    if (!isCached || !CACHE[address]) {
      api.derive.accounts
        .info(value, (state): void => {
          mountedRef.current && setState(
            CACHE[address] = state
          );
        })
        .then((u): void => {
          unsubscribe = u;
        })
        .catch(console.error);
    }

    return () => unsubscribe && unsubscribe();
  }, [api, isCached, mountedRef, value]);

  return state;
}
