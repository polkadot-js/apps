// Copyright 2017-2018 @polkadot/ui-keyring authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { State } from './types';

import { encodeAddress } from '@polkadot/keyring';
import { isString } from '@polkadot/util';

export default function isAvailable (state: State, _address: Uint8Array | string): boolean {
  const accounts = state.accounts.subject.getValue();
  const addresses = state.addresses.subject.getValue();

  const address = isString(_address)
    ? _address
    : encodeAddress(_address);

  return !accounts[address] && !addresses[address];
}
