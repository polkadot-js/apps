// Copyright 2017-2018 @polkadot/ui-keyring authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { KeyringPair, KeyringPair$Meta } from '@polkadot/util-keyring/types';
import { State } from '../types';

import createOptions from '../options';
import saveAccount from './save';

/* Load account keyring pair into memory using account seed.
 * Save the account by providing the keyring pair and password to decrypt
 * the pair and to generate the secret key in keyring memory (whether locked or not).
 * Update keyring memory with latest state (so account is locked and user must enter password
 * if they attempt to send a transaction immediately after creating the account).
 * Lock account to remove secret key from keyring memory so user prompted for password.
 */
export default function accountCreate (state: State, seed: Uint8Array, password?: string, meta: KeyringPair$Meta = {}): KeyringPair {
  const pair = state.keyring.addFromSeed(seed, meta);

  saveAccount(state, pair, password);

  createOptions(state);
  pair.lock();

  return pair;
}
