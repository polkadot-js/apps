// Copyright 2017-2018 @polkadot/ui-keyring authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { KeyringAddress, KeyringJson$Meta, State } from '../types';

import isString from '@polkadot/util/is/string';
import addressDecode from '@polkadot/util-keyring/address/decode';
import addressEncode from '@polkadot/util-keyring/address/encode';

export default function get (state: State, _address: string | Uint8Array, type: 'account' | 'address' = 'address'): KeyringAddress {
  const address = isString(_address)
    ? _address
    : addressEncode(_address);
  const publicKey = addressDecode(address);
  const subject = type === 'account'
    ? state.accounts.subject
    : state.addresses.subject;

  return {
    address: (): string =>
      address,
    isValid: (): boolean =>
      !!subject.getValue()[address],
    publicKey: (): Uint8Array =>
      publicKey,
    getMeta: (): KeyringJson$Meta =>
      subject.getValue()[address].json.meta
  };
}
