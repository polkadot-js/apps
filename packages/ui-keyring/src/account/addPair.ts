// Copyright 2017-2018 @polkadot/ui-keyring authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { KeyringPair } from '@polkadot/util-keyring/types';
import { State } from '../types';

import saveAccount from './save';

export default function addAccountPair (state: State, pair: KeyringPair, password: string): KeyringPair {
  state.keyring.addPair(pair);

  saveAccount(state, pair, password);

  return pair;
}
