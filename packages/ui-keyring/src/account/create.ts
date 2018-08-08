// Copyright 2017-2018 @polkadot/ui-keyring authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { KeyringPair, KeyringPair$Json, KeyringPair$Meta } from '@polkadot/util-keyring/types';
import { State } from '../types';

import saveAccount from './save';

export default function accountCreate (state: State, seed: Uint8Array, password?: string, meta: KeyringPair$Meta = {}): KeyringPair {
  return state.keyring.addFromJson(
    saveAccount(
      state,
      state.keyring.addFromSeed(seed, meta),
      password
    ) as KeyringPair$Json
  );
}
