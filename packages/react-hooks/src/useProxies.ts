// Copyright 2017-2021 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';

import { useAccounts } from '@polkadot/react-hooks/useAccounts';
import { useApi } from '@polkadot/react-hooks/useApi';
import { useCall } from '@polkadot/react-hooks/useCall';
import { AccountId, ProxyDefinition, ProxyType } from '@polkadot/types/interfaces';

export function useProxies (): [ProxyDefinition[], BN][] | undefined {
  const { api } = useApi();
  const { allAccounts } = useAccounts();

  return useCall<[ProxyDefinition[], BN][]>(api.query.proxy?.proxies.multi, [allAccounts], {
    transform: (result: [([AccountId, ProxyType] | ProxyDefinition)[], BN][]): [ProxyDefinition[], BN][] =>
      api.tx.proxy.addProxy.meta.args.length === 3
        ? result as [ProxyDefinition[], BN][]
        : (result as [[AccountId, ProxyType][], BN][]).map(([arr, bn]): [ProxyDefinition[], BN] =>
          [arr.map(([delegate, proxyType]): ProxyDefinition => api.createType('ProxyDefinition', {
            delegate,
            proxyType
          })), bn]
        )
  });
}
