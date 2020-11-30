// Copyright 2017-2020 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveAccountInfo } from '@polkadot/api-derive/types';
import type { AccountId, AccountIndex, Address } from '@polkadot/types/interfaces';

import { useEffect, useState } from 'react';

import { useApi } from './useApi';

type VoidFn = () => void;

const CACHE: Record<string, DeriveAccountInfo> = {};

export function useAccountInfoCache (value: AccountId | AccountIndex | Address | string | null | undefined, isCached: boolean): DeriveAccountInfo | undefined {
  const { api } = useApi();
  const [state, setState] = useState<DeriveAccountInfo | undefined>(CACHE[value?.toString() || '']);

  useEffect((): () => void => {
    const address = value?.toString() || '';
    let unsubscribe: VoidFn | undefined;

    if (isCached) {
      if (!CACHE[address]) {
        api.derive.accounts
          .info(value)
          .then((state) => setState(CACHE[address] = state))
          .catch(console.error);
      }
    } else {
      api.derive.accounts
        .info(value, (state) => setState(CACHE[address] = state))
        .then((u): void => {
          unsubscribe = u;
        })
        .catch(console.error);
    }

    return () => unsubscribe && unsubscribe();
  }, [api, isCached, value]);

  return state;
}
