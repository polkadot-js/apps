// Copyright 2017-2021 @polkadot/test-supports authors & contributors
// SPDX-License-Identifier: Apache-2.0

import registry from '@polkadot/react-api/typeRegistry';
import { Registrar } from '@polkadot/react-hooks/useRegistrars';
import { bob, charlie, ferdie } from '@polkadot/test-support/keyring';

export const mockRegistration = {
  deposit: '20.2580 DOT',
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
  ],
  info: {
    additional: [],
    display: {
      Raw: 'Alice'
    },
    legal: {
      Raw: 'Alice Raw'
    },
    web: {
      Raw: 'https://al'
    }
  }
};

export const bobRegistrar: Registrar = { address: bob, index: 0 };
export const charlieRegistrar: Registrar = { address: charlie, index: 1 };
export const ferdieRegistrar: Registrar = { address: ferdie, index: 3 };

export const registrars: Registrar[] = [bobRegistrar, charlieRegistrar, ferdieRegistrar];

export const bobShortAddress = '5FHneW…M694ty';
export const charlieShortAddress = '5DAAnr…3PTXFy';
