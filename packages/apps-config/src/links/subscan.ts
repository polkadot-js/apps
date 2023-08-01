// Copyright 2017-2023 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BN } from '@polkadot/util';
import type { ExternalDef } from './types.js';

import { externalSubscanPNG } from '../ui/logos/external/index.js';

export const Subscan: ExternalDef = {
  chains: {
    'Aleph Zero': 'alephzero'
  },
  create: (chain: string, path: string, data: BN | number | string): string =>
    `https://${chain}.subscan.io/${path}/${data.toString()}`,
  homepage: 'https://subscan.io/',
  isActive: true,
  paths: {
    address: 'account',
    block: 'block',
    bounty: 'bounty',
    council: 'council',
    democracyProposal: 'democracy_proposal',
    democracyReferendum: 'referenda',
    extrinsic: 'extrinsic',
    fellowshipReferenda: 'fellowship',
    referenda: 'referenda_v2',
    techcomm: 'tech',
    tip: 'treasury_tip',
    treasury: 'treasury',
    validator: 'validator'
  },
  ui: {
    logo: externalSubscanPNG
  }
};
