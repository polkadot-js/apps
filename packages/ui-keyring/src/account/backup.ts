// Copyright 2017-2018 @polkadot/ui-keyring authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { KeyringPair, KeyringPair$Json } from '@polkadot/util-keyring/types';
import { State } from '../types';

import u8aFromString from '@polkadot/util/u8a/fromString';

import store from 'store';

import { accountKey } from '../defaults';

export default function accountBackup (state: State, _address: string, password?: string): KeyringPair$Json | void {

  if (!_address) {
    return;
  }

  const pair: KeyringPair = state.keyring.getPair(_address);

  // const json = pair.toJson(password);
  const json = store.get(accountKey(_address));

  // if password correct it sets hasSecretKey (private key) to true in @polkadot/util-keyring/pair/index.ts
  pair.decodePkcs8(password, u8aFromString(json.encoded));
  if (pair.hasSecretKey()) {
    return json;
  }
  return;
}
