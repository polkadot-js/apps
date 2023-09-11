// Copyright 2017-2023 @polkadot/app-contracts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { SupportedChainId } from '@azns/resolver-core';
import { useResolveAddressToDomain } from '@azns/resolver-react';

import { useApi } from './useApi.js';

export const systemNameToChainId: Map<string, SupportedChainId.AlephZero | SupportedChainId.AlephZeroTestnet> = new Map([
  ['Aleph Zero', SupportedChainId.AlephZero],
  ['Aleph Zero Testnet', SupportedChainId.AlephZeroTestnet]
]);

export const useAddressToDomain = (address: string | undefined): ReturnType<typeof useResolveAddressToDomain> => {
  const { api, systemChain } = useApi();

  const chainId = systemNameToChainId.get(systemChain);

  const results = useResolveAddressToDomain(address, { chainId, customApi: api });

  if (!chainId) {
    return {
      allPrimaryDomains: undefined,
      error: undefined,
      hasError: false,
      isLoading: false,
      primaryDomain: undefined
    };
  }

  return results;
};
