// Copyright 2017-2023 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BN } from '@polkadot/util';

import { externalLogos } from '../ui/logos';

const getNetwork = (_chain: string) => {
  const chain = _chain === 'kusama' ? 'rmrk' : _chain;

  return `https://kodadot.xyz/${chain}/u/`;
};

export default {
  chains: {
    Kusama: 'kusama',
    Statemine: 'statemine',
    Westend: 'westend',
    Westmint: 'westmint'
  },
  create: (_chain: string, _path: string, data: BN | number | string): string => `${getNetwork(_chain)}${data.toString()}`,
  isActive: true,
  logo: externalLogos.kodadot as string,
  paths: {
    address: 'account'
  },
  url: 'https://kodadot.xyz'
};
