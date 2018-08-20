// Copyright 2017-2018 @polkadot/ui-keyring authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { KeyringPair$Json } from '@polkadot/util-keyring/types';
import { State, KeyringJson } from './types';

import store from 'store';
import addressEncode from '@polkadot/util-keyring/address/encode';
import isHex from '@polkadot/util/is/hex';
import hexToU8a from '@polkadot/util/hex/toU8a';

import saveAddress from './address/meta';
import createOptions from './options';
import { accountRegex, addressRegex } from './defaults';

export default function loadAll (state: State): void {
  const { available, keyring } = state;

  store.each((json: KeyringJson, key: string) => {
    if (accountRegex.test(key)) {
      keyring.addFromJson(json as KeyringPair$Json);
      available.account[json.address] = json;
    } else if (addressRegex.test(key)) {
      const address = isHex(json.address)
        ? addressEncode(hexToU8a(json.address))
        : json.address;

      // NOTE This is a fix for an older version where publicKeys instead of addresses
      // were saved. Here we clean the old and replace with a new address-specific key
      if (address !== json.address) {
        json.address = address;

        store.remove(key);
        saveAddress(state, address, json.meta);
      }

      available.address[json.address] = json;
    }
  });

  createOptions(state);
}
