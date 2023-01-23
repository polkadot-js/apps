// Copyright 2017-2023 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BN } from '@polkadot/util';
import type { ExternalDef } from './types';

import { externalLogos } from '../ui/logos';

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
  isActive: true,
  logo: externalLogos.singular as string,
  paths: {
    address: 'account'
  },
  url: 'https://singular.app'
};
