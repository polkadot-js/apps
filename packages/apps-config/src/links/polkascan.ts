// Copyright 2017-2023 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BN } from '@polkadot/util';
import type { ExternalDef } from './types';

import { externalLogos } from '../ui/logos';

export const Polkascan: ExternalDef = {
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
    democracyProposal: 'democracy/proposal',
    democracyReferendum: 'democracy/referendum',
    extrinsic: 'transaction',
    techcomm: 'techcomm/proposal',
    treasury: 'treasury/proposal'
  },
  url: 'https://polkascan.io/'
};
