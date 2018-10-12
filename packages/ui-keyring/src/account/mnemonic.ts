// Copyright 2017-2018 @polkadot/ui-keyring authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { KeyringPair, KeyringPair$Meta } from '@polkadot/keyring/types';
import { State } from '../types';

import saveAccount from './save';

export default function mnemonicCreate (state: State, seed: string, password?: string, meta: KeyringPair$Meta = {}): KeyringPair {
  const pair = state.keyring.addFromMnemonic(seed, meta);

  saveAccount(state, pair, password);

  return pair;
}
