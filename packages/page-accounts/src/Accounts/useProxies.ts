// Copyright 2017-2020 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

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

function createProxy (allAccounts: string[], delegate: AccountId, type: ProxyType, delay = BN_ZERO): Proxy {
  const address = delegate.toString();

  return {
    address,
    delay,
    isOwned: allAccounts.includes(address),
    type
  };
}

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
          const proxies = api.tx.proxy.addProxy.meta.args.length === 3
            ? (_proxies as ProxyDefinition[]).map(({ delay, delegate, proxyType }) =>
              createProxy(allAccounts, delegate, proxyType, delay)
            )
            : (_proxies as [AccountId, ProxyType][]).map(([delegate, proxyType]) =>
              createProxy(allAccounts, delegate, proxyType)
            );
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
