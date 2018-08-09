// Copyright 2017-2018 @polkadot/ui-keyring authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { KeyringPair, KeyringPair$Json } from '@polkadot/util-keyring/types';
import { State } from '../types';

/*
 * Load account keyring pair from memory using account address.
 * Decrypt the pair with password to generate the secret key in keyring memory if locked.
 * Obtain account JSON using password when secret key is in keyring memory.
 * Remove secret key from keyring memory.
 */
export default function accountBackup (state: State, _address: string, password: string): KeyringPair$Json | void {
  const { keyring } = state;
  let jsonDecrypted = undefined;

  if (!_address || !password) {
    console.error('Missing address or password');
    return;
  }

  const pair = keyring.getPair(_address);

  if (!pair) {
    return;
  }

  try {
    pair.decodePkcs8(password);
    jsonDecrypted = keyring.toJson(_address, password);
    pair.lock();

    return jsonDecrypted;
  } catch (error) {
    console.error('Unable to decrypt account with given password: ', error);
  }
}
