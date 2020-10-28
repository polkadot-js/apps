// Copyright 2017-2020 @polkadot/app-settings authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ChainInfo } from './types';

import { useMemo } from 'react';

import { getSystemChainColor, getSystemIcon } from '@polkadot/apps-config/ui';
import { getSpecTypes } from '@polkadot/types-known';
import { DEFAULT_DECIMALS, DEFAULT_SS58, registry } from '@polkadot/react-api';
import { useApi } from '@polkadot/react-hooks';
import { isNumber } from '@polkadot/util';

export default function useChainInfo (): ChainInfo | null {
  const { api, isApiReady, systemChain, systemName } = useApi();

  return useMemo(
    () => isApiReady
      ? {
        chain: systemChain,
        color: getSystemChainColor(systemChain, systemName),
        genesisHash: api.genesisHash.toHex(),
        icon: getSystemIcon(systemName),
        metaCalls: Buffer.from(api.runtimeMetadata.asCallsOnly.toU8a()).toString('base64'),
        specVersion: api.runtimeVersion.specVersion.toNumber(),
        ss58Format: isNumber(api.registry.chainSS58) ? api.registry.chainSS58 : DEFAULT_SS58.toNumber(),
        tokenDecimals: isNumber(api.registry.chainDecimals) ? api.registry.chainDecimals : DEFAULT_DECIMALS.toNumber(),
        tokenSymbol: api.registry.chainToken || 'Unit',
        types: getSpecTypes(registry, systemChain, api.runtimeVersion.specName, api.runtimeVersion.specVersion) as unknown as Record<string, string>
      }
      : null,
    [api, isApiReady, systemChain, systemName]
  );
}
