// Copyright 2017-2021 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';

import { externalLogos } from '../ui/logos';

export default {
  chains: {
    // Kulupu: 'kulupu',
    Kusama: 'kusama',
    Polkadot: 'polkadot',
    Rococo: 'rococo'
  },
  create: (chain: string, path: string, data: BN | number | string): string =>
    `https://polkascan.io/${chain}/${path}/${data.toString()}`,
  isActive: true,
  logo: externalLogos.polkascan as string,
  paths: {
    address: 'account',
    block: 'block',
    council: 'council/motion',
    extrinsic: 'transaction',
    proposal: 'democracy/proposal',
    referendum: 'democracy/referendum',
    techcomm: 'techcomm/proposal',
    treasury: 'treasury/proposal'
  },
  url: 'https://polkascan.io/'
};
