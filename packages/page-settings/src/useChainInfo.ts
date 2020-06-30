// Copyright 2017-2020 @polkadot/app-settings authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ChainInfo } from './types';

import { getSystemChainColor, getSystemIcon } from '@polkadot/apps-config/ui';
import { getSpecTypes } from '@polkadot/types-known';
import { registry } from '@polkadot/react-api';
import { useApi } from '@polkadot/react-hooks';
import { isNumber } from '@polkadot/util';

import { useEffect, useState } from 'react';

export default function useChainInfo (): ChainInfo | null {
  const { api, isApiReady, systemChain, systemName } = useApi();
  const [state, setState] = useState<ChainInfo | null>(null);

  useEffect((): void => {
    isApiReady && setState({
      chain: systemChain,
      color: getSystemChainColor(systemChain, systemName),
      genesisHash: api.genesisHash.toHex(),
      icon: getSystemIcon(systemName),
      metaCalls: Buffer.from(api.runtimeMetadata.asCallsOnly.toU8a()).toString('base64'),
      specVersion: api.runtimeVersion.specVersion.toNumber(),
      ss58Format: isNumber(api.registry.chainSS58) ? api.registry.chainSS58 : 42,
      tokenDecimals: isNumber(api.registry.chainDecimals) ? api.registry.chainDecimals : 12,
      tokenSymbol: api.registry.chainToken || 'Unit',
      types: getSpecTypes(registry, systemChain, api.runtimeVersion.specName, api.runtimeVersion.specVersion) as unknown as Record<string, string>
    });
  }, [api, isApiReady, systemChain, systemName]);

  return state;
}
