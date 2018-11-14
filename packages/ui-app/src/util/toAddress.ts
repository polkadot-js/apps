// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import keyring from '@polkadot/ui-keyring/index';
import { hexToU8a, isHex } from '@polkadot/util';

export default function toAddress (value?: string | Uint8Array): string | undefined {
  if (!value) {
    return;
  }

  try {
    return keyring.encodeAddress(
      isHex(value)
        ? hexToU8a(value)
        : keyring.decodeAddress(value)
    );
  } catch (error) {
    console.error('Unable to encode address', value);
  }
}
