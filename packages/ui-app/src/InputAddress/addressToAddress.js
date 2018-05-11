// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import addressDecode from '@polkadot/util-keyring/address/decode';
import addressEncode from '@polkadot/util-keyring/address/encode';

export default function addressToAddress (value?: string | Uint8Array): ?string {
  // flowlint-next-line sketchy-null-string:off
  if (value) {
    try {
      return addressEncode(
        addressDecode(value)
      );
    } catch (error) {
      console.error('Unable to encode address', value);
    }
  }
}
