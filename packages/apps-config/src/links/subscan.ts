// Copyright 2017-2020 @polkadot/apps-config authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import BN from 'bn.js';

export default {
  chains: {
    Kusama: 'kusama',
    'Kusama CC3': 'kusama'
  },
  create: (chain: string, path: string, data: BN | number | string): string =>
    `https://${chain}.subscan.io/${path}/${data.toString()}`,
  isActive: true,
  paths: {
    address: 'account',
    block: 'block',
    council: 'council',
    extrinsic: 'extrinsic',
    proposal: 'proposal',
    referendum: 'referenda',
    techcomm: 'tech',
    treasury: 'treasury'
  },
  url: 'https://subscan.io/'
};
