// Copyright 2017-2018 @polkadot/ui-keyring authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { KeyringPair, KeyringPair$Json } from '@polkadot/util-keyring/types';
import { State } from '../types';

import hexToU8a from '@polkadot/util/hex/toU8a';
import createPair from '@polkadot/util-keyring/pair';
import decodeAddress from '@polkadot/util-keyring/address/decode';

export default function accountRestore (state: State, json: KeyringPair$Json, password: string): KeyringPair {
  const pair = createPair(
    {
      publicKey: decodeAddress(json.address),
      secretKey: new Uint8Array()
    },
    json.meta,
    hexToU8a(json.encoded)
  );

  pair.decodePkcs8(password);
  pair.lock();
  state.keyring.addPair(pair);

  if (!json.meta.whenCreated) {
    json.meta.whenCreated = Date.now();
  }

  state.keyring.addFromJson(json);
  state.accounts.add(json.address, json);

  return pair;
}
