// Copyright 2017-2025 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BN } from '@polkadot/util';
import type { ExternalDef } from './types.js';

import { externalMoonbeamAppsSVG } from '../ui/logos/external/index.js';

export const MoonbeamApps: ExternalDef = {
  chains: {
    'Moonbase Alpha': 'moonbase-alpha',
    Moonbeam: 'moonbeam',
    Moonriver: 'moonriver'
  },
  create: (chain: string, path: string, data: BN | number | string): string =>
    `https://apps.moonbeam.network/${chain}/${path}/${data.toString()}`,
  homepage: 'https://apps.moonbeam.network/',
  isActive: true,
  paths: {
    referenda: 'referendum'
  },
  ui: {
    logo: externalMoonbeamAppsSVG
  }
};
