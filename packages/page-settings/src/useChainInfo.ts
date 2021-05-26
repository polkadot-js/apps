// Copyright 2017-2021 @polkadot/app-settings authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { ChainInfo } from './types';

import { useMemo } from 'react';

import { getSystemColor, getSystemIcon } from '@polkadot/apps-config';
import { DEFAULT_DECIMALS, DEFAULT_SS58 } from '@polkadot/react-api';
import { useApi } from '@polkadot/react-hooks';
import { getSpecTypes } from '@polkadot/types-known';
import { formatBalance, isNumber } from '@polkadot/util';

function createInfo (api: ApiPromise, systemChain: string, systemName: string, specName: string): ChainInfo {
  return {
    chain: systemChain,
    color: getSystemColor(systemChain, systemName, specName),
    genesisHash: api.genesisHash.toHex(),
    icon: getSystemIcon(systemName),
    metaCalls: Buffer.from(api.runtimeMetadata.asCallsOnly.toU8a()).toString('base64'),
    specVersion: api.runtimeVersion.specVersion.toNumber(),
    ss58Format: isNumber(api.registry.chainSS58) ? api.registry.chainSS58 : DEFAULT_SS58.toNumber(),
    tokenDecimals: (api.registry.chainDecimals || [DEFAULT_DECIMALS.toNumber()])[0],
    tokenSymbol: (api.registry.chainTokens || formatBalance.getDefaults().unit)[0],
    types: getSpecTypes(api.registry, systemChain, api.runtimeVersion.specName, api.runtimeVersion.specVersion) as unknown as Record<string, string>
  };
}

export default function useChainInfo (): ChainInfo | null {
  const { api, isApiReady, specName, systemChain, systemName } = useApi();

  return useMemo(
    () => isApiReady
      ? createInfo(api, systemChain, systemName, specName)
      : null,
    [api, isApiReady, specName, systemChain, systemName]
  );
}
