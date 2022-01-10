// Copyright 2017-2022 @polkadot/test-supports authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Registrar } from '@polkadot/react-hooks/types';

import registry from '@polkadot/react-api/typeRegistry';

import { bob, charlie, ferdie } from '../keyring';

export const mockRegistration = {
  judgements: [
    [
      registry.createType('RegistrarIndex', '0'),
      {
        isReasonable: true
      }
    ],
    [
      registry.createType('RegistrarIndex', '1'),
      {
        isKnownGood: true
      }
    ],
    [
      registry.createType('RegistrarIndex', '2'),
      {
        isErroneous: true
      }
    ],
    [
      registry.createType('RegistrarIndex', '3'),
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
