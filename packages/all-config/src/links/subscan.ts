// Copyright 2017-2020 @polkadot/apps-config authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import BN from 'bn.js';

export default {
  isActive: false,
  chains: {
    Kusama: 'kusama',
    'Kusama CC3': 'kusama'
  },
  paths: {
    address: 'account',
    block: 'block',
    extrinsic: 'extrinsic'
  },
  create: (chain: string, path: string, data: BN | number | string): string =>
    `https://${chain}.subscan.io/${path}/${data.toString()}`
};
