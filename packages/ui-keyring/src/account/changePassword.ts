// Copyright 2017-2018 @polkadot/ui-keyring authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { State } from '../types';

import updateAccount from './update';

/*
 * Load account keyring pair from memory using account address.
 * Verify old password by trying to decrypt the pair with password to generate the secret key in keyring memory if locked.
 * Update account password with new password when secret key is in keyring memory.
 * Remove secret key from keyring memory.
 */
export default function changeAccountPassword (state: State, address: string, password: string, newPassword: string): boolean {
  const { keyring } = state;

  if (!address || !password || !newPassword) {
    throw Error('Unable to load account without an address or password being provided');
  }

  const pair = keyring.getPair(address);

  if (!pair) {
    throw Error('Unable to load account from memory using the provided address');
  }

  try {
    pair.decodePkcs8(password);

    updateAccount(state, pair, password, newPassword);

    pair.lock();

    return true;
  } catch (error) {
    console.error('Unable to decrypt account with given password: ', error);
  }
  return false;
}
