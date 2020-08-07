// Copyright 2017-2020 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AccountId, BalanceOf, ProxyDefinition, ProxyType } from '@polkadot/types/interfaces';
import { ITuple } from '@polkadot/types/types';

import BN from 'bn.js';
import { useEffect, useState } from 'react';
import { useAccounts, useApi, useIsMountedRef } from '@polkadot/react-hooks';
import { Vec } from '@polkadot/types';
import { BN_ZERO } from '@polkadot/util';

interface Proxy {
  address: string;
  delay: BN;
  isOwned: boolean;
  type: ProxyType;
}

interface State {
  hasOwned: boolean;
  owned: Proxy[];
  proxies: Proxy[];
}

const EMPTY_STATE: State = {
  hasOwned: false,
  owned: [],
  proxies: []
};

export default function useProxies (address?: string | null): State {
  const { api } = useApi();
  const { allAccounts } = useAccounts();
  const mountedRef = useIsMountedRef();
  const [known, setState] = useState<State>(EMPTY_STATE);

  useEffect((): void => {
    setState(EMPTY_STATE);

    address && api.query.proxy &&
      api.query.proxy
        .proxies<ITuple<[Vec<ITuple<[AccountId, ProxyType]> | ProxyDefinition>, BalanceOf]>>(address)
        .then(([_proxies]): void => {
          const proxies = _proxies.length === 0 || !Array.isArray(_proxies[0])
            ? (_proxies as ProxyDefinition[]).map(({ delay, delegate, proxyType }): Proxy => ({
              address: delegate.toString(),
              delay,
              isOwned: allAccounts.includes(delegate.toString()),
              type: proxyType
            }))
            : (_proxies as [AccountId, ProxyType][]).map(([delegate, type]): Proxy => ({
              address: delegate.toString(),
              delay: BN_ZERO,
              isOwned: allAccounts.includes(delegate.toString()),
              type
            }));
          const owned = proxies.filter(({ isOwned }) => isOwned);

          mountedRef.current && setState({
            hasOwned: owned.length !== 0,
            owned,
            proxies
          });
        })
        .catch(console.error);
  }, [allAccounts, api, address, mountedRef]);

  return known;
}
