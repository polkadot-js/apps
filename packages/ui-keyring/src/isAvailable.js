// Copyright 2017-2018 @polkadot/ui-keyring authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { State } from './types';

import isString from '@polkadot/util/is/string';
import addressEncode from '@polkadot/util-keyring/address/encode';

export default function isAvailable (state: State, _address: Uint8Array | string): boolean {
  const address = isString(_address)
    // flowlint-next-line unclear-type:off
    ? ((_address: any): string)
    : addressEncode(_address);

  console.log('isAvailable', address, state.available.account[address], state.available.address[address]);

  return !state.available.account[address] && !state.available.address[address];
}
