// Copyright 2017-2020 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

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
      // noop, undefined return indicates invalid/transient
    }
  }

  return undefined;
}
