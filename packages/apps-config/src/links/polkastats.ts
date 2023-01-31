// Copyright 2017-2023 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BN } from '@polkadot/util';
import type { ExternalDef } from './types';

import { externalLogos } from '../ui/logos';

export const Polkastats: ExternalDef = {
  chains: {
    Kusama: 'kusama',
    Polkadot: 'polkadot',
    Westend: 'westend'

  },
  create: (chain: string, path: string, data: BN | number | string): string =>
    `https://${chain}.polkastats.io/${path}/${data.toString()}`,
  isActive: true,
  logo: externalLogos.polkastats as string,
  paths: {
    address: 'account',
    block: 'block',
    extrinsic: 'extrinsic',
    validator: 'validator'
  },
  url: 'https://polkastats.io/'
};
