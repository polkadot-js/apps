// Copyright 2017-2021 @polkadot/app-gilt authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Vec } from '@polkadot/types';
import type { BalanceOf, ProxyDefinition } from '@polkadot/types/interfaces';
import type { ITuple } from '@polkadot/types/types';

import { useEffect, useState } from 'react';

import { useAccounts, useApi, useIsMountedRef } from '@polkadot/react-hooks';

type ProxyResult = ITuple<[Vec<ProxyDefinition>, BalanceOf]>;
type Result = [string, ProxyResult][];

export function useProxies (): Result {
  const { api } = useApi();
  const { allAccounts } = useAccounts();
  const mountedRef = useIsMountedRef();
  const [state, setState] = useState<Result>([]);

  useEffect((): void => {
    if (allAccounts.length) {
      api.query.proxy.proxies
        .multi<ProxyResult>(allAccounts)
        .then((result) =>
          mountedRef.current && setState(
            result
              .map((r, index): [string, ProxyResult] => [allAccounts[index], r])
              .filter(([, [p]]) => p.length)
          )
        )
        .catch(console.error);
    }
  }, [allAccounts, api, mountedRef]);

  return state;
}
