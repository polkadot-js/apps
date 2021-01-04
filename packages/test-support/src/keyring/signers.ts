// Copyright 2017-2021 @polkadot/test-support authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Keyring } from '@polkadot/keyring';
import { KeyringPair } from '@polkadot/keyring/types';

export function aliceSigner (): KeyringPair {
  const keyring = new Keyring({ type: 'sr25519' });

  return keyring.addFromUri('//Alice');
}
