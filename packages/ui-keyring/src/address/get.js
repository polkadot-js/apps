// Copyright 2017-2018 @polkadot/ui-keyring authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { KeyringAddress, KeyringJson$Meta, State } from '../types';

import isString from '@polkadot/util/is/string';
import addressDecode from '@polkadot/util-keyring/address/decode';
import addressEncode from '@polkadot/util-keyring/address/encode';

export default function get (state: State, _address: string | Uint8Array): KeyringAddress {
  const address = isString(_address)
    // flowlint-next-line unclear-type:off
    ? ((_address: any): string)
    : addressEncode(_address);
  const publicKey = addressDecode(address);

  return {
    address: (): string =>
      address,
    isValid: (): boolean =>
      !!state.available.address[address],
    publicKey: (): Uint8Array =>
      publicKey,
    getMeta: (): KeyringJson$Meta =>
      state.available.address[address].meta
  };
}
