// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import addressDecode from '@polkadot/util-keyring/address/decode';
import addressEncode from '@polkadot/util-keyring/address/encode';

export default function addressToAddress (value?: string | Uint8Array): string | undefined {
  if (!value) {
    return;
  }

  try {
    return addressEncode(
      addressDecode(value)
    );
  } catch (error) {
    console.error('Unable to encode address', value);
  }
}
