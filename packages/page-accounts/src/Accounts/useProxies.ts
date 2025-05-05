// Copyright 2017-2025 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Vec } from '@polkadot/types';
import type { AccountId, BalanceOf } from '@polkadot/types/interfaces';
import type { KitchensinkRuntimeProxyType, PalletProxyProxyDefinition } from '@polkadot/types/lookup';
import type { ITuple } from '@polkadot/types/types';
import type { BN } from '@polkadot/util';

import { useEffect, useState } from 'react';

import { createNamedHook, useAccounts, useApi, useIsMountedRef } from '@polkadot/react-hooks';
import { BN_ZERO } from '@polkadot/util';

interface Proxy {
  address: string;
  delay: BN;
  isOwned: boolean;
  type: KitchensinkRuntimeProxyType;
}

interface State {
  isEmpty: boolean;
  owned: Proxy[];
  proxies: Proxy[];
}

function createProxy (allAccounts: string[], delegate: AccountId, type: KitchensinkRuntimeProxyType, delay = BN_ZERO): Proxy {
  const address = delegate.toString();

  return {
    address,
    delay,
    isOwned: allAccounts.includes(address),
    type
  };
}

function useProxiesImpl (address?: string | null): State | null {
  const { api } = useApi();
  const { allAccounts } = useAccounts();
  const mountedRef = useIsMountedRef();
  const [known, setState] = useState<State | null>(null);

  useEffect((): void => {
    setState(null);

    address &&
      api.query.proxy
        ?.proxies<ITuple<[Vec<ITuple<[AccountId, KitchensinkRuntimeProxyType]> | PalletProxyProxyDefinition>, BalanceOf]>>(address)
        .then(([_proxies]): void => {
          const proxies = api.tx.proxy.addProxy.meta.args.length === 3
            ? (_proxies as PalletProxyProxyDefinition[]).map(({ delay, delegate, proxyType }) =>
              createProxy(allAccounts, delegate, proxyType, delay)
            )
            : (_proxies as [AccountId, KitchensinkRuntimeProxyType][]).map(([delegate, proxyType]) =>
              createProxy(allAccounts, delegate, proxyType)
            );
          const owned = proxies.filter(({ isOwned }) => isOwned);

          mountedRef.current && setState({
            isEmpty: owned.length === 0,
            owned,
            proxies
          });
        })
        .catch(console.error);
  }, [allAccounts, api, address, mountedRef]);

  return known;
}

export default createNamedHook('useProxies', useProxiesImpl);
