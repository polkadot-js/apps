// Copyright 2017-2021 @polkadot/app-settings authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { ChainInfo } from './types';

import { useMemo } from 'react';

import { getSystemChainColor, getSystemIcon } from '@polkadot/apps-config';
import { DEFAULT_DECIMALS, DEFAULT_SS58 } from '@polkadot/react-api';
import { useApi } from '@polkadot/react-hooks';
import { getSpecTypes } from '@polkadot/types-known';
import { isNumber } from '@polkadot/util';

function createInfo (api: ApiPromise, systemChain: string, systemName: string): ChainInfo {
  return {
    chain: systemChain,
    color: getSystemChainColor(systemChain, systemName),
    genesisHash: api.genesisHash.toHex(),
    icon: getSystemIcon(systemName),
    metaCalls: Buffer.from(api.runtimeMetadata.asCallsOnly.toU8a()).toString('base64'),
    specVersion: api.runtimeVersion.specVersion.toNumber(),
    ss58Format: isNumber(api.registry.chainSS58) ? api.registry.chainSS58 : DEFAULT_SS58.toNumber(),
    tokenDecimals: isNumber(api.registry.chainDecimals) ? api.registry.chainDecimals : DEFAULT_DECIMALS.toNumber(),
    tokenSymbol: api.registry.chainToken || 'Unit',
    types: getSpecTypes(api.registry, systemChain, api.runtimeVersion.specName, api.runtimeVersion.specVersion) as unknown as Record<string, string>
  };
}

export default function useChainInfo (): ChainInfo | null {
  const { api, isApiReady, systemChain, systemName } = useApi();

  return useMemo(
    () => isApiReady
      ? createInfo(api, systemChain, systemName)
      : null,
    [api, isApiReady, systemChain, systemName]
  );
}
