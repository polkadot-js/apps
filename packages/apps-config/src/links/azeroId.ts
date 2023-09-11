// Copyright 2017-2023 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { ExternalDef } from './types.js';

import { resolveAddressToDomain, SupportedChainId } from '@azns/resolver-core';

import { externalAzeroIdLogoBlackSVG, externalAzeroIdLogoPrimarySVG } from '../ui/logos/external/index.js';

async function getSubdomainFromAddress (
  address: string,
  options: {
    chainId: SupportedChainId.AlephZero| SupportedChainId.AlephZeroTestnet;
    customApi?: ApiPromise;
  }
) {
  try {
    const { primaryDomain } = await resolveAddressToDomain(address, options);
    const domainParts = primaryDomain?.split('.');

    return domainParts?.slice(0, -1).join('.') || undefined;
  } catch {
    return undefined;
  }
}

export const AzeroId: ExternalDef = {
  chains: {
    'Aleph Zero': SupportedChainId.AlephZero
  },
  create: (_chain, _path, data, _hash, customApi) => {
    return getSubdomainFromAddress(data.toString(), { chainId: SupportedChainId.AlephZero, customApi })
      .then((domain) => domain && `https://${domain}.azero.id/`);
  },
  homepage: 'https://azero.id/',
  isActive: true,
  paths: {
    address: 'account',
    validator: 'validator'
  },
  ui: {
    logo: {
      dark: externalAzeroIdLogoPrimarySVG,
      light: externalAzeroIdLogoBlackSVG
    }
  }
};

export const TzeroId: ExternalDef = {
  chains: {
    'Aleph Zero Testnet': SupportedChainId.AlephZeroTestnet
  },
  create: (_chain, _path, data, _hash, customApi) => {
    return getSubdomainFromAddress(data.toString(), { chainId: SupportedChainId.AlephZeroTestnet, customApi })
      .then((domain) => domain && `https://${domain}.tzero.id/`);
  },
  homepage: 'https://tzero.id/',
  isActive: true,
  paths: {
    address: 'account',
    validator: 'validator'
  },
  ui: {
    logo: {
      dark: externalAzeroIdLogoPrimarySVG,
      light: externalAzeroIdLogoBlackSVG
    }
  }
};
