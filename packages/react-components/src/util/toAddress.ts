// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import keyring from '@polkadot/ui-keyring';
import { hexToU8a, isHex, assert } from '@polkadot/util';

export default function toAddress (value?: string | Uint8Array | null, allowIndices = false): string | undefined {
  if (value) {
    try {
      const u8a = isHex(value)
        ? hexToU8a(value)
        : keyring.decodeAddress(value);

      assert(allowIndices || u8a.length === 32, 'AccountIndex values not allowed');

      return keyring.encodeAddress(u8a);
    } catch (error) {
      console.error('Unable to encode address', (error as Error).message, value);
    }
  }

  return undefined;
}
