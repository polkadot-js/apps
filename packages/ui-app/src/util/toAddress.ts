// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import addressDecode from '@polkadot/util-keyring/address/decode';
import addressEncode from '@polkadot/util-keyring/address/encode';
import isHex from '@polkadot/util/is/hex';
import hexToU8a from '@polkadot/util/hex/toU8a';

export default function toAddress (value?: string | Uint8Array): string | undefined {
  if (!value) {
    return;
  }

  try {
    return addressEncode(
      isHex(value)
        ? hexToU8a(value as string)
        : addressDecode(value)
    );
  } catch (error) {
    console.error('Unable to encode address', value);
  }
}
