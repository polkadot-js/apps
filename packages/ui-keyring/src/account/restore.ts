// Copyright 2017-2018 @polkadot/ui-keyring authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { KeyringPair, KeyringPair$Json } from '@polkadot/util-keyring/types';
import { State } from '../types';

import u8aFromString from '@polkadot/util/u8a/fromString';

import store from 'store';

import saveAccount from './save';
import { accountKey } from '../defaults';
import createOptions from '../options';

// Upload - account creation. takes values, encrypts it and stores in localStorage.
// (And displays the account in the drop down)
export default function accountRestore (state: State, json: KeyringPair$Json, password?: string): void {
  const { available, keyring } = state;

  const _address = json.address;

  if (_address) {

    // reference: loadAll
    keyring.addFromJson(json as KeyringPair$Json);
    available.account[_address] = json;

    // this is done in save.ts
    // createOptions(state);

    const pair: KeyringPair = keyring.getPair(_address);

    // FIXME - resolve why getting `ExtError: Unable to unencrypt using the supplied passphrase` when correct passphrase provided
    // Note: Use KeyringInstance, not Pair (otherwise it requires secret key)
    // const jsonDecrypted: KeyringPair$Json = pair.toJson(password);

    const jsonDecrypted: KeyringPair$Json = keyring.toJson(_address, password);

    // if password correct it sets hasSecretKey (private key) to true in @polkadot/util-keyring/pair/index.ts
    // pair.decodePkcs8(password, u8aFromString(jsonDecrypted.encoded));
    // if (pair.hasSecretKey()) {
      // saveAccount(state, pair, password);
    // }
    saveAccount(state, pair, password);
  }
}
