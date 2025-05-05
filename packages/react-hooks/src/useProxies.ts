// Copyright 2017-2025 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { AccountId } from '@polkadot/types/interfaces';
import type { KitchensinkRuntimeProxyType, PalletProxyProxyDefinition } from '@polkadot/types/lookup';
import type { BN } from '@polkadot/util';

import { createNamedHook } from './createNamedHook.js';
import { useAccounts } from './useAccounts.js';
import { useApi } from './useApi.js';
import { useCall } from './useCall.js';

const OPTS = {
  transform: (result: [([AccountId, KitchensinkRuntimeProxyType] | PalletProxyProxyDefinition)[], BN][], api: ApiPromise): [PalletProxyProxyDefinition[], BN][] =>
    api.tx.proxy.addProxy.meta.args.length === 3
      ? result as [PalletProxyProxyDefinition[], BN][]
      : (result as [[AccountId, KitchensinkRuntimeProxyType][], BN][]).map(([arr, bn]): [PalletProxyProxyDefinition[], BN] =>
        [arr.map(([delegate, proxyType]): PalletProxyProxyDefinition =>
          api.createType('ProxyDefinition', {
            delegate,
            proxyType
          })), bn]
      )
};

function useProxiesImpl (): [PalletProxyProxyDefinition[], BN][] | undefined {
  const { api } = useApi();
  const { allAccounts } = useAccounts();

  return useCall<[PalletProxyProxyDefinition[], BN][]>(api.query.proxy?.proxies.multi, [allAccounts], OPTS);
}

export const useProxies = createNamedHook('useProxies', useProxiesImpl);
