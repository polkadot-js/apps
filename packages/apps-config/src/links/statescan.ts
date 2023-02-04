// Copyright 2017-2023 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BN } from '@polkadot/util';
import type { ExternalDef } from './types';

import { externalLogos } from '../ui/logos';

export const Statescan: ExternalDef = {
  chains: {
    Litentry: 'litentry',
    Statemine: 'statemine',
    Westmint: 'westmint'
  },
  create: (chain: string, path: string, data: BN | number | string): string =>
    `https://${chain}.statescan.io/${path}/${data.toString()}`,
  homepage: 'https://statescan.io/',
  isActive: true,
  paths: {
    address: 'account',
    block: 'block'
  },
  uiLogo: externalLogos.statescan as string
};
