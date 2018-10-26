// Copyright 2017-2018 @polkadot/ui-keyring authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { KeyringPair, KeyringPair$Json } from '@polkadot/keyring/types';
import { State } from '../types';

import createPair from '@polkadot/keyring/pair';
import { decodeAddress } from '@polkadot/keyring';
import { hexToU8a } from '@polkadot/util';

import addAccountPair from './addPair';

export default function accountRestore (state: State, json: KeyringPair$Json, password: string): KeyringPair {
  const pair = createPair(
    {
      publicKey: decodeAddress(json.address),
      secretKey: new Uint8Array()
    },
    json.meta,
    hexToU8a(json.encoded)
  );

  // unlock, save account and then lock (locking cleans secretKey, so needs to be last)
  pair.decodePkcs8(password);
  addAccountPair(state, pair, password);
  pair.lock();

  return pair;
}
