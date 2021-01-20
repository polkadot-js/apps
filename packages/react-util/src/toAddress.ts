// Copyright 2017-2021 @canvas-ui/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

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
