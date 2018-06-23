// Copyright 2017-2018 @polkadot/ui-keyring authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { KeyringPair, KeyringPair$Meta } from '@polkadot/util-keyring/types';
import { State } from '../types';

import saveAccount from './save';

export default function accountCreate (state: State, seed: Uint8Array, password?: string, meta: KeyringPair$Meta = {}): KeyringPair {
  const pair = state.keyring.addFromSeed(seed, meta);

  saveAccount(state, pair, password);

  return pair;
}
