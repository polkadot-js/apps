// Copyright 2017-2023 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BN } from '@polkadot/util';
import type { ExternalDef } from './types';

import { externalStatescanSVG } from '../ui/logos/external';

export const Statescan: ExternalDef = {
  chains: {
    Collectives: 'Collectives',
    Kusama: 'kusama',
    Litentry: 'litentry',
    Litmus: 'litmus',
    Statemine: 'statemine',
    Statemint: 'statemint',
    'Westend Collectives': 'westend-collectives',
    Westmint: 'westmint'
  },
  create: (chain: string, path: string, data: BN | number | string): string =>
    `https://${chain}.statescan.io/#/${path}/${data.toString()}`,
  homepage: 'https://statescan.io/',
  isActive: true,
  paths: {
    address: 'accounts',
    block: 'blocks'
  },
  ui: {
    logo: externalStatescanSVG
  }
};
