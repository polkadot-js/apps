// Copyright 2017-2023 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BN } from '@polkadot/util';
import type { ExternalDef } from './types';

import { externalSubsquareSVG } from '../ui/logos/external';

export const Subsquare: ExternalDef = {
  chains: {
    Acala: 'acala',
    Altair: 'altair',
    Basilisk: 'basilisk',
    Bifrost: 'bifrost',
    Centrifuge: 'centrifuge',
    Crust: 'crust',
    'Darwinia Crab': 'crab',
    HydraDX: 'hydradx',
    Interlay: 'interlay',
    Karura: 'karura',
    Khala: 'khala',
    Kusama: 'kusama',
    Litmus: 'litmus',
    Phala: 'phala',
    Polkadot: 'polkadot',
    Rococo: 'rococo',
    'Turing Network': 'turing',
    Zeitgeist: 'zeitgeist',
    kintsugi: 'kintsugi'
  },
  create: (chain: string, path: string, data: BN | number | string): string =>
    `https://${chain}.subsquare.io/${path}/${data.toString()}`,
  homepage: 'https://subsquare.io/',
  isActive: true,
  paths: {
    bounty: 'treasury/bounty',
    council: 'council/motion',
    democracyExternal: 'democracy/external',
    democracyProposal: 'democracy/proposal',
    democracyReferendum: 'democracy/referendum',
    fellowshipReferenda: 'fellowship/referendum',
    referenda: 'referenda/referendum',
    tip: 'treasury/tip',
    treasury: 'treasury/proposal'
  },
  ui: {
    logo: externalSubsquareSVG
  }
};
