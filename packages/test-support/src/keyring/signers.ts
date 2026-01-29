// Copyright 2017-2025 @polkadot/test-support authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { KeyringPair } from '@polkadot/keyring/types';

import { Keyring } from '@polkadot/keyring';

export function aliceSigner (): KeyringPair {
  const keyring = new Keyring({ type: 'sr25519' });

  return keyring.addFromUri('//Alice');
}

export function bobSigner (): KeyringPair {
  const keyring = new Keyring({ type: 'sr25519' });

  return keyring.addFromUri('//Bob');
}

export function charlieSigner (): KeyringPair {
  const keyring = new Keyring({ type: 'sr25519' });

  return keyring.addFromUri('//Charlie');
}

export function daveSigner (): KeyringPair {
  const keyring = new Keyring({ type: 'sr25519' });

  return keyring.addFromUri('//Dave');
}

export function eveSigner (): KeyringPair {
  const keyring = new Keyring({ type: 'sr25519' });

  return keyring.addFromUri('//Eve');
}

export function ferdieSigner (): KeyringPair {
  const keyring = new Keyring({ type: 'sr25519' });

  return keyring.addFromUri('//Ferdie');
}
