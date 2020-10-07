// Copyright 2017-2020 @canvas-ui/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';

export default {
  chains: {
    Kusama: 'kusama',
    'Kusama CC3': 'kusama'
  },
  create: (chain: string, path: string, data: BN | number | string): string =>
    `https://${chain}.polkassembly.io/${path}/${data.toString()}`,
  isActive: true,
  paths: {
    council: 'motion',
    proposal: 'proposal',
    referendum: 'referendum',
    treasury: 'treasury'
  },
  url: 'https://polkassembly.io/'
};
