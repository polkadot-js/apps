// Copyright 2017-2018 @polkadot/ui-keyring authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { KeyringPair, KeyringPair$Json } from '@polkadot/util-keyring/types';
import { State } from '../types';

import store from 'store';

import { accountKey } from '../defaults';
import createOptions from '../options';
import accountLoad from './load';

/* Load account keyring pair into memory using account JSON file.
 * Decrypt the pair with password to generate the secret key in keyring memory (whether locked or not).
 * Remove secret key from keyring memory by locking the pair.
 */
export default function accountLock (state: State, json: KeyringPair$Json, password?: string): KeyringPair | undefined {
  const address = json.address;
  const pair = accountLoad(state, json);

  if (!address || !pair) {
    throw Error('Unable to load account from memory using the JSON address');
  }

  try {
    pair.decodePkcs8(password);
    store.set(accountKey(address), json);
    state.keyring.addFromJson(json as KeyringPair$Json);
    state.accounts.add(address, json);
    createOptions(state);
    pair.lock();

    return pair;
  } catch (error) {
    console.error('Unable to lock account when invalid password provided', error);
  }
}
