// Copyright 2017-2020 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';

import { externalLogos } from '../ui/logos';

export default {
  chains: {
    Kusama: 'kusama',
    'Kusama CC3': 'kusama',
    Polkadot: 'polkadot'
  },
  create: (chain: string, path: string, data: BN | number | string): string =>
    `https://${chain}.polkassembly.io/${path}/${data.toString()}`,
  isActive: true,
  logo: externalLogos.polkassembly as string,
  paths: {
    council: 'motion',
    proposal: 'proposal',
    referendum: 'referendum',
    tip: 'tip',
    treasury: 'treasury'
  },
  url: 'https://polkassembly.io/'
};
