// Copyright 2017-2025 @polkadot/app-nis authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Vec } from '@polkadot/types';
import type { BalanceOf, ProxyDefinition } from '@polkadot/types/interfaces';
import type { ITuple } from '@polkadot/types/types';

import { useEffect, useState } from 'react';

import { createNamedHook, useAccounts, useApi, useIsMountedRef } from '@polkadot/react-hooks';

type ProxyResult = ITuple<[Vec<ProxyDefinition>, BalanceOf]>;

function useProxiesImpl (): Record<string, string[]> {
  const { api } = useApi();
  const { allAccounts } = useAccounts();
  const mountedRef = useIsMountedRef();
  const [state, setState] = useState<Record<string, string[]>>({});

  useEffect((): void => {
    if (allAccounts.length) {
      api.query.proxy.proxies
        .multi<ProxyResult>(allAccounts)
        .then((result) =>
          mountedRef.current && setState(
            result
              .map(([p], index): [string, string[]] => [
                allAccounts[index],
                p.map(({ delegate }) => delegate.toString())
              ])
              .filter(([, p]) => p.length)
              .reduce((all, [a, p]) => ({ ...all, [a]: p }), {})
          )
        )
        .catch(console.error);
    }
  }, [allAccounts, api, mountedRef]);

  return state;
}

export const useProxies = createNamedHook('useProxies', useProxiesImpl);
