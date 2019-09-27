// Copyright 2017-2019 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import keyring from '@polkadot/ui-keyring';
import { hexToU8a, isHex } from '@polkadot/util';

export default function toAddress (value?: string | Uint8Array | null): string | undefined {
  if (!value) {
    return;
  }

  let address: string | undefined;

  try {
    address = keyring.encodeAddress(
      isHex(value)
        ? hexToU8a(value)
        : keyring.decodeAddress(value)
    );
  } catch (error) {
    console.error('Unable to encode address', value);
  }

  return address;
}
