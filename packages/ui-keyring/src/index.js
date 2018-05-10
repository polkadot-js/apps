// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { KeyringPair, KeyringPair$Meta } from '@polkadot/util-keyring/types';
import type { KeyringInstance, KeyringOption$Type, KeyringOption, KeyringOptions, State } from './types';

import testKeyring from '@polkadot/util-keyring/testing';

import loadAll from './loadAll';
import saveAccount from './save/account';
import saveAccountMeta from './save/accountMeta';
import saveRecent from './save/recent';

const state: State = {
  available: {
    account: {},
    address: {}
  },
  keyring: testKeyring(),
  options: {}
};

loadAll(state);

export default ({
  ...state.keyring,
  getOptions: (type: KeyringOption$Type): KeyringOptions =>
    state.options[type],
  loadAll: (): void =>
    loadAll(state),
  saveAccount: (pair: KeyringPair, password?: string): void =>
    saveAccount(state, pair, password),
  saveAccountMeta: (pair: KeyringPair, meta: KeyringPair$Meta): void =>
    saveAccountMeta(state, pair, meta),
  saveRecent: (address: string): KeyringOption =>
    saveRecent(state, address)
}: KeyringInstance);
