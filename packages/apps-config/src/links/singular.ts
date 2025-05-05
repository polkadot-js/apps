// Copyright 2017-2025 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BN } from '@polkadot/util';
import type { ExternalDef } from './types.js';

import { externalSingularSVG } from '../ui/logos/external/index.js';

const getNetwork = (_chain: string) => {
  switch (_chain) {
    case 'statemine':
      return 'statemine/';
    default:
      return '';
  }
};

export const Singular: ExternalDef = {
  chains: {
    Kusama: 'kusama',
    Statemine: 'statemine'
  },
  create: (_chain: string, _path: string, data: BN | number | string): string =>
    `https://singular.app/space/${getNetwork(_chain)}${data.toString()}`,
  homepage: 'https://singular.app',
  isActive: true,
  paths: {
    address: 'account'
  },
  ui: {
    logo: externalSingularSVG
  }
};
