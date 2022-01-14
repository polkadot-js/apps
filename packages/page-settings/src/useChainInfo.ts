// Copyright 2017-2022 @polkadot/app-settings authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ChainInfo } from './types';

import { useMemo } from 'react';

import { getSystemColor, getSystemIcon } from '@polkadot/apps-config';
import { DEFAULT_DECIMALS, DEFAULT_SS58 } from '@polkadot/react-api';
import { createNamedHook, useApi } from '@polkadot/react-hooks';
import { getSpecTypes } from '@polkadot/types-known';
import { formatBalance, isNumber } from '@polkadot/util';
import { base64Encode } from '@polkadot/util-crypto';

function useChainInfoImpl (): ChainInfo | null {
  const { api, isApiReady, isEthereum, specName, systemChain, systemName } = useApi();

  return useMemo(
    () => isApiReady
      ? {
        chain: systemChain,
        chainType: isEthereum
          ? 'ethereum'
          : 'substrate',
        color: getSystemColor(systemChain, systemName, specName),
        genesisHash: api.genesisHash.toHex(),
        icon: getSystemIcon(systemName, specName),
        metaCalls: base64Encode(api.runtimeMetadata.asCallsOnly.toU8a()),
        specVersion: api.runtimeVersion.specVersion.toNumber(),
        ss58Format: isNumber(api.registry.chainSS58)
          ? api.registry.chainSS58
          : DEFAULT_SS58.toNumber(),
        tokenDecimals: (api.registry.chainDecimals || [DEFAULT_DECIMALS.toNumber()])[0],
        tokenSymbol: (api.registry.chainTokens || formatBalance.getDefaults().unit)[0],
        types: getSpecTypes(api.registry, systemChain, api.runtimeVersion.specName, api.runtimeVersion.specVersion) as unknown as Record<string, string>
      }
      : null,
    [api, isApiReady, specName, systemChain, systemName, isEthereum]
  );
}

export default createNamedHook('useChainInfo', useChainInfoImpl);
