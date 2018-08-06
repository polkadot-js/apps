// Copyright 2017-2018 @polkadot/ui-keyring authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { KeyringPair, KeyringPair$Json } from '@polkadot/util-keyring/types';
import { State } from '../types';

import u8aFromString from '@polkadot/util/u8a/fromString';

import store from 'store';

import { accountKey } from '../defaults';
import createOptions from '../options';

export default function accountRestore (state: State, json: KeyringPair$Json, password?: string): void {
  const { available, keyring } = state;

  const _address = json.address;

  if (_address) {
    // load the account into keyring memory
    const pair = keyring.addFromJson(json);
    available.account[_address] = json;

    // unlock account
    try {
      pair.decodePkcs8(password);
    } catch (error) {
      console.error('Unable to restore account when invalid password provided');
    }

    store.set(accountKey(_address), json);

    createOptions(state);
  }
}
