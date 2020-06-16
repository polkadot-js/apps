// Copyright 2017-2020 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ProxyType } from '@polkadot/types/interfaces';

import { useEffect, useState } from 'react';
import { useAccounts, useApi, useIsMountedRef } from '@polkadot/react-hooks';

interface Proxy {
  address: string;
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
        .proxies(address)
        .then(([_proxies]): void => {
          const proxies = _proxies.map(([accountId, type]): Proxy => ({
            address: accountId.toString(),
            isOwned: allAccounts.includes(accountId.toString()),
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
