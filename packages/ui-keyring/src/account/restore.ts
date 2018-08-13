// Copyright 2017-2018 @polkadot/ui-keyring authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { KeyringPair, KeyringPair$Json } from '@polkadot/util-keyring/types';
import { State } from '../types';

import store from 'store';

import { accountKey } from '../defaults';
import createOptions from '../options';
import accountLoad from './load';

/*
 * Load account keyring pair into memory using account JSON file.
 * Decrypt the pair with password to generate the secret key in keyring memory (whether locked or not).
 * Remove secret key from keyring memory.
 */
export default function accountRestore (state: State, json: KeyringPair$Json, password?: string): KeyringPair | undefined {
  const _address = json.address;
  const pair = accountLoad(state, json);

  if (!_address || !pair) {
    throw Error('Unable to load account to restore from memory using the JSON address');
  }

  try {
    pair.decodePkcs8(password);
    store.set(accountKey(_address), json);

    createOptions(state);
    pair.lock();

    return pair;
  } catch (error) {
    console.error('Unable to restore account when invalid password provided', error);
  }
}
