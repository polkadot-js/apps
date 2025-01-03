// Copyright 2017-2025 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BN } from '@polkadot/util';
import type { ExternalDef } from './types.js';

import { externalPolkastatsPNG } from '../ui/logos/external/index.js';

// NOTE Not maintained, see breakage reports in
// https://github.com/polkadot-js/apps/issues/8903
export const Polkastats: ExternalDef = {
  chains: {
    Kusama: 'kusama',
    Polkadot: 'polkadot',
    Westend: 'westend'

  },
  create: (chain: string, path: string, data: BN | number | string): string =>
    `https://${chain}.polkastats.io/${path}/${data.toString()}`,
  homepage: 'https://polkastats.io/',
  isActive: true,
  paths: {
    address: 'account',
    block: 'block',
    extrinsic: 'extrinsic',
    validator: 'validator'
  },
  ui: {
    logo: externalPolkastatsPNG
  }
};
