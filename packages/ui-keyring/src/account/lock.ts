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
export default function accountLock (state: State, json: KeyringPair$Json): KeyringPair | undefined {
  const address = json.address;
  const pair = accountLoad(state, json);

  if (!address || !pair) {
    throw Error('Unable to load account from memory using the JSON address');
  }

  try {
    // FIXME - generates error `Uncaught (in promise) Error: bad secret key size` from nacl-fast.js
    pair.lock();
    store.set(accountKey(address), json);
    state.accounts.add(address, json);
    createOptions(state);

    return pair;
  } catch (error) {
    console.error('Unable to lock account when invalid password provided', error);
  }
}
