// Copyright 2017-2025 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { keyring } from '@polkadot/ui-keyring';
import { hexToU8a, isHex } from '@polkadot/util';
import { ethereumEncode } from '@polkadot/util-crypto';

export function toAddress (value?: string | Uint8Array | null, allowIndices = false, bytesLength?: 20 | 32): string | undefined {
  if (value) {
    try {
      const u8a = isHex(value)
        ? hexToU8a(value)
        : keyring.decodeAddress(value);

      if (!allowIndices && u8a.length !== 32 && u8a.length !== 20) {
        throw new Error('AccountIndex values not allowed');
      } else if (bytesLength && u8a.length !== bytesLength) {
        throw new Error('Invalid key length');
      }

      if (u8a.length === 20) {
        return ethereumEncode(u8a);
      } else {
        return keyring.encodeAddress(u8a);
      }
    } catch {
      // undefined return below indicates invalid/transient
    }
  }

  return undefined;
}
