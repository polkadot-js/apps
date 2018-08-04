// Copyright 2017-2018 @polkadot/ui-keyring authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { KeyringPair, KeyringPair$Json } from '@polkadot/util-keyring/types';
import { State } from '../types';

import u8aFromString from '@polkadot/util/u8a/fromString';

// Download - takes what is in the keyring and creates the json, in this case the json does not go to storage
export default function accountBackup (state: State, _address: string, password?: string): KeyringPair$Json | void {
  const { keyring } = state;

  if (!_address) {
    return;
  }

  const pair: KeyringPair = keyring.getPair(_address);

  // FIXME - resolve why getting `ExtError: Unable to unencrypt using the supplied passphrase` when correct passphrase provided
  // FIXME - shouldn't this be somehow called after `decodePkcs8` below, since `toJson` may require secret key to be available in state of decode.ts of util-keyring
  const jsonDecrypted: KeyringPair$Json = pair.toJson(password);
  // const jsonDecrypted = store.get(accountKey(_address));

  // if password correct it sets hasSecretKey (private key) to true in @polkadot/util-keyring/pair/index.ts
  pair.decodePkcs8(password, u8aFromString(jsonDecrypted.encoded));
  if (pair.hasSecretKey()) {
    return jsonDecrypted;
  }
  return;
}
