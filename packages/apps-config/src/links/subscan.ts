// Copyright 2017-2020 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';

import { externalLogos } from '../ui/logos';

export default {
  chains: {
    Edgeware: 'edgeware',
    Kulupu: 'kulupu',
    Kusama: 'kusama',
    'Kusama CC3': 'kusama',
    Polkadot: 'polkadot',
    'Polkadot CC1': 'polkadot-cc1',
    Westend: 'westend'
  },
  create: (chain: string, path: string, data: BN | number | string): string =>
    `https://${chain}.subscan.io/${path}/${data.toString()}`,
  isActive: true,
  logo: externalLogos.subscan as string,
  paths: {
    address: 'account',
    block: 'block',
    council: 'council',
    extrinsic: 'extrinsic',
    proposal: 'democracy_proposal',
    referendum: 'referenda',
    techcomm: 'tech',
    treasury: 'treasury'
  },
  url: 'https://subscan.io/'
};
