// Copyright 2017-2019 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { keccakAsHex } from '@polkadot/util-crypto';

export default function pkToEthAddr (publicKey: Uint8Array): string {
  const address = `0x${keccakAsHex(publicKey).slice(-40)}`;
  const hash = keccakAsHex(address.substr(2)).substr(2);
  let result = '0x';

  for (let n = 0; n < 40; n++) {
    result = `${result}${
      parseInt(hash[n], 16) > 7
        ? address[n + 2].toUpperCase()
        : address[n + 2]
    }`;
  }

  return result;
}
