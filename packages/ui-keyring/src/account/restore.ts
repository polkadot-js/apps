// Copyright 2017-2018 @polkadot/ui-keyring authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { KeyringPair, KeyringPair$Json } from '@polkadot/util-keyring/types';
import { State } from '../types';

import store from 'store';

import { accountKey } from '../defaults';
import createOptions from '../options';

/*
 * Load account keyring pair into memory using account JSON file.
 * Decrypt the pair with password to generate the secret key in keyring memory (whether locked or not).
 * Remove secret key from keyring memory.
 */
export default function accountRestore (state: State, json: KeyringPair$Json, password?: string): KeyringPair | undefined {
  const { available, keyring } = state;
  const _address = json.address;

  if (!_address) {
    return;
  }

  const pair: KeyringPair = keyring.addFromJson(json);

  try {
    pair.decodePkcs8(password);

    store.set(accountKey(_address), json);

    createOptions(state);
    pair.lock();

    return pair;
  } catch (error) {
    console.error('Unable to restore account when invalid password provided');
    return;
  }
}
