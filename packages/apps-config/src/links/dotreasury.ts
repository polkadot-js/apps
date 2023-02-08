// Copyright 2017-2023 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BN } from '@polkadot/util';
import type { ExternalDef } from './types';

import { externalDotreasurySVG } from '../ui/logos/external';

export const Dotreasury: ExternalDef = {
  chains: {
    Kusama: 'ksm',
    Polkadot: 'dot'
  },
  create: (chain: string, path: string, data: BN | number | string): string =>
    `https://www.dotreasury.com/${chain}/${path}/${data.toString()}`,
  homepage: 'https://dotreasury.com/',
  isActive: true,
  paths: {
    bounty: 'bounties',
    tip: 'tips',
    treasury: 'proposals'
  },
  ui: {
    logo: externalDotreasurySVG
  }
};
