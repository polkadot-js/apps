// Copyright 2017-2021 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type BN from 'bn.js';

import { externalLogos } from '../ui/logos';

export default {
  chains: {
    Kusama: 'kusama',
    Polkadot: 'polkadot'
  },
  create: (chain: string, path: string, data: BN | number | string): string =>
    `https://dotscanner.com/${chain}/${path}/${data.toString()}?utm_source=polkadotjs`,
  isActive: true,
  logo: externalLogos.dotscanner as string,
  paths: {
    address: 'account',
    block: 'block'
  },
  url: 'https://dotscanner.com/'
};
