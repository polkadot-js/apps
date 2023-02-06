// Copyright 2017-2023 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BN } from '@polkadot/util';
import type { ExternalDef } from './types';

import { externalKodadotPNG } from '../ui/logos/external';

const getNetwork = (_chain: string) => {
  const chain = _chain === 'kusama' ? 'rmrk' : _chain;

  return `https://kodadot.xyz/${chain}/u/`;
};

export const KodaDot: ExternalDef = {
  chains: {
    Kusama: 'kusama',
    Statemine: 'statemine',
    Westend: 'westend',
    Westmint: 'westmint'
  },
  create: (_chain: string, _path: string, data: BN | number | string): string =>
    `${getNetwork(_chain)}${data.toString()}`,
  homepage: 'https://kodadot.xyz',
  isActive: true,
  paths: {
    address: 'account'
  },
  uiLogo: externalKodadotPNG
};
