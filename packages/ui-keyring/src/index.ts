// Copyright 2017-2018 @polkadot/ui-keyring authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { KeyringPair, KeyringPair$Meta } from '@polkadot/util-keyring/types';
import { KeyringAddress, KeyringInstance, KeyringOption$Type, KeyringOption, KeyringOptions, State } from './types';

import testKeyring from '@polkadot/util-keyring/testing';

import loadAll from './loadAll';
import createAccount from './account/create';
import forgetAccount from './account/forget';
import isAvailable from './isAvailable';
import saveAccount from './account/save';
import saveAccountMeta from './account/meta';
import forgetAddress from './address/forget';
import getAddress from './address/get';
import getAddresses from './address/all';
import saveAddress from './address/meta';
import saveRecent from './address/metaRecent';
import setTestMode from './setTestMode';

const state: State = {
  isTestMode: false,
  available: {
    account: {},
    address: {}
  },
  keyring: testKeyring(),
  options: {}
};

loadAll(state);

export default ({
  createAccount: (seed: Uint8Array, password?: string, meta?: KeyringPair$Meta): KeyringPair =>
    createAccount(state, seed, password, meta),
  forgetAccount: (address: string): void =>
    forgetAccount(state, address),
  forgetAddress: (address: string): void =>
    forgetAddress(state, address),
  isAvailable: (address: string | Uint8Array): boolean =>
    isAvailable(state, address),
  getAddress: (address: string | Uint8Array): KeyringAddress =>
    getAddress(state, address),
  getAddresses: (): Array<KeyringAddress> =>
    getAddresses(state),
  getOptions: (type: KeyringOption$Type): KeyringOptions =>
    state.options[type],
  getPair: (address: string | Uint8Array): KeyringPair =>
    state.keyring.getPair(address),
  getPairs: (): Array<KeyringPair> =>
    state.keyring.getPairs().filter((pair) =>
      state.isTestMode || pair.getMeta().isTesting !== true
    ),
  loadAll: (): void =>
    loadAll(state),
  saveAccount: (pair: KeyringPair, password?: string): void =>
    saveAccount(state, pair, password),
  saveAccountMeta: (pair: KeyringPair, meta: KeyringPair$Meta): void =>
    saveAccountMeta(state, pair, meta),
  saveAddress: (address: string, meta: KeyringPair$Meta): void =>
    saveAddress(state, address, meta),
  saveRecent: (address: string): KeyringOption =>
    saveRecent(state, address),
  setTestMode: (isTest: boolean): void =>
    setTestMode(state, isTest)
} as KeyringInstance);
