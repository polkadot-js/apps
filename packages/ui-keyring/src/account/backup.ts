// Copyright 2017-2018 @polkadot/ui-keyring authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { KeyringPair, KeyringPair$Json } from '@polkadot/util-keyring/types';
import { State } from '../types';

export default function accountBackup (state: State, _address: string, password: string): KeyringPair$Json | void {
  const { keyring } = state;
  let jsonDecrypted: KeyringPair$Json = undefined;

  if (!_address || !password) {
    console.log('Missing address or password');
    return;
  }

  console.log('Load account keyring pair using account address from keyring memory');
  const pair: KeyringPair = keyring.getPair(_address);

  if (!pair) {
    return;
  }

  const isLocked = !pair.hasSecretKey();

  console.log('Account locked: ', isLocked);

  if (isLocked) {
    try {
      console.log('Decrypting the pair with password to generate the secret key in keyring memory');
      pair.decodePkcs8(password);

      console.log('Obtaining account JSON using password with secret key now in keyring memory');
      jsonDecrypted = keyring.toJson(_address, password);

      // FIXME - console.log('Remove secret key from keyring memory');
      // pair.lock();

      return jsonDecrypted;
    } catch (error) {
      console.error('Unable to decrypt account with given password: ', error);
      return;
    }
  } else {
    try {
      console.log('Obtaining account JSON using password with secret key already in keyring memory');
      jsonDecrypted = keyring.toJson(_address, password);

      // FIXME - console.log('Remove secret key from keyring memory');
      // pair.lock();

      return jsonDecrypted;
    } catch (error) {
      console.error('Unable to decrypt account without password: ', error);
      return;
    }
  }
  return;
}
