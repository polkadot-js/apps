// Copyright 2017-2018 @polkadot/ui-keyring authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { KeyringPair, KeyringPair$Json } from '@polkadot/util-keyring/types';
import { State } from '../types';

import store from 'store';

import { accountKey } from '../defaults';
import createOptions from '../options';

export default function accountRestore (state: State, json: KeyringPair$Json, password?: string): boolean {
  const { available, keyring } = state;

  const _address = json.address;

  if (_address) {
    console.log('Load account keyring pair using account JSON into keyring memory');

    const pair: KeyringPair = keyring.addFromJson(json);
    available.account[_address] = json;

    try {
      console.log('Decrypting the pair with password to generate the secret key in keyring memory');
      pair.decodePkcs8(password);

      store.set(accountKey(_address), json);
      createOptions(state);

      // FIXME - console.log('Remove secret key from keyring memory');
      // pair.lock();

      return true;
    } catch (error) {
      console.error('Unable to restore account when invalid password provided');
      return false;
    }
  }
  return false;
}
