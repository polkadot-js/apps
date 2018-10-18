// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { decodeAddress, encodeAddress } from '@polkadot/keyring';
import { hexToU8a, isHex } from '@polkadot/util';

export default function toAddress (value?: string | Uint8Array): string | undefined {
  if (!value) {
    return;
  }

  try {
    return encodeAddress(
      isHex(value)
        ? hexToU8a(value as string)
        : decodeAddress(value)
    );
  } catch (error) {
    console.error('Unable to encode address', value);
  }
}
