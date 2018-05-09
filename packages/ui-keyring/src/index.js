// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { KeyringPair } from '@polkadot/util-keyring/types';
import type { KeyringInstance, State } from './types';

import testKeyring from '@polkadot/util-keyring/testing';

import loadAll from './loadAll';
import saveJson from './saveJson';

const state: State = {
  keyring: testKeyring()
};

loadAll(state);

export default ({
  ...state.keyring,
  loadJson: (): void =>
    loadAll(state),
  saveJson: (pair: KeyringPair, password?: string): void =>
    saveJson(state, pair, password)
}: KeyringInstance);
