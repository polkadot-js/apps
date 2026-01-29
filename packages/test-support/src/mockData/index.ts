// Copyright 2017-2025 @polkadot/test-supports authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Registrar } from '@polkadot/react-hooks/types';

import { statics } from '@polkadot/react-api';

import { bob, charlie, ferdie } from '../keyring/index.js';

export const mockRegistration = {
  judgements: [
    [
      statics.registry.createType('RegistrarIndex', '0'),
      {
        isReasonable: true
      }
    ],
    [
      statics.registry.createType('RegistrarIndex', '1'),
      {
        isKnownGood: true
      }
    ],
    [
      statics.registry.createType('RegistrarIndex', '2'),
      {
        isErroneous: true
      }
    ],
    [
      statics.registry.createType('RegistrarIndex', '3'),
      {
        isReasonable: true
      }
    ]
  ]
};

export const bobRegistrar: Registrar = { address: bob, index: 0 };
export const charlieRegistrar: Registrar = { address: charlie, index: 1 };
export const ferdieRegistrar: Registrar = { address: ferdie, index: 3 };

export const registrars: Registrar[] = [bobRegistrar, charlieRegistrar, ferdieRegistrar];

export const bobShortAddress = '5FHneW…M694ty';
export const charlieShortAddress = '5DAAnr…3PTXFy';
export const ferdieShortAddress = '5CiPPs…SK2DjL';
