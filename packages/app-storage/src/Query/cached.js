// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type BN from 'bn.js';
import type { StorageDef$Key } from '@polkadot/storage/types';

import withStorageDiv from '@polkadot/rx-react/with/storageDiv';
import u8aToHexShort from '@polkadot/util/u8a/toHexShort';
import isU8a from '@polkadot/util/is/u8a';

export default function cached (key: StorageDef$Key, params?: Array<*> = []): React$ComponentType<*> {
  return withStorageDiv(key, { params })(
    (value?: boolean | BN | Date | Uint8Array): string => {
      if (typeof value === typeof true) {
        // flowlint-next-line sketchy-null-bool:off
        return value
          ? 'Yes'
          : 'No';
      }

      // flowlint-next-line sketchy-null-bool:off
      if (!value) {
        return 'unknown';
      }

      if (isU8a(value)) {
        // $FlowFixMe type has been determined
        return u8aToHexShort(value, 256);
      }

      return value.toString();
    },
    { className: 'ui disabled dropdown selection' }
  );
}
