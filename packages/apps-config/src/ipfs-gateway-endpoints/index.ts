// Copyright 2017-2023 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { TFunction } from '../types';
import type { AuthIpfsEndpoint } from './types';

// Definitions here are with the following values -
//   info: the name of a logo as defined in ../ui/logos, specifically in namedLogos
//   text: the IPFS endpoint name
//   value: the IPFS endpoint domain
//   location: IPFS gateway location
export function createAuthIpfsEndpoints (t: TFunction): AuthIpfsEndpoint[] {
  return [
    {
      location: t('Singapore'),
      text: t('DCF'),
      value: 'https://crustipfs.xyz'
    },
    {
      location: t('Seattle'),
      text: t('Crust Network'),
      value: 'https://crustwebsites.net'
    },
    {
      location: t('Berlin'),
      text: t('⚡️ Thunder Gateway'),
      value: 'https://gw.crustapps.net'
    }
  ];
}

export type { AuthIpfsEndpoint };
