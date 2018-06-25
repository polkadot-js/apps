// Copyright 2017-2018 @polkadot/ui-keyring authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { State } from './types';

import isString from '@polkadot/util/is/string';
import addressEncode from '@polkadot/util-keyring/address/encode';

export default function isAvailable (state: State, _address: Uint8Array | string): boolean {
  const address = isString(_address)
    ? _address
    : addressEncode(_address);

  return !state.available.account[address] && !state.available.address[address];
}
