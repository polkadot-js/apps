// Copyright 2017-2018 @polkadot/ui-keyring authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { KeyringPair, KeyringPair$Meta, KeyringPair$Json } from '@polkadot/util-keyring/types';
import { SingleAddress } from './observable/types';
import { KeyringAddress, KeyringInstance, State } from './types';

import testKeyring from '@polkadot/util-keyring/testing';

import accounts from './observable/accounts';
import addresses from './observable/addresses';
import development from './observable/development';
import loadAll from './loadAll';
import addPair from './account/addPair';
import backupAccount from './account/backup';
import createAccount from './account/create';
import forgetAccount from './account/forget';
import restoreAccount from './account/restore';
import isAvailable from './isAvailable';
import saveAccount from './account/save';
import saveAccountMeta from './account/meta';
import forgetAddress from './address/forget';
import getAccounts from './account/all';
import getAddress from './address/get';
import getAddresses from './address/all';
import saveAddress from './address/meta';
import saveRecent from './address/metaRecent';

class Keyring implements KeyringInstance {
  private state: State;

  constructor () {
    this.state = {
      accounts,
      addresses,
      keyring: testKeyring()
    };

    this.loadAll();
  }

  addPair (json: KeyringPair$Json): void {
    return addPair(this.state, json);
  }

  backupAccount (pair: KeyringPair, password: string): KeyringPair$Json {
    return backupAccount(this.state, pair, password);
  }

  createAccount (seed: Uint8Array, password?: string, meta?: KeyringPair$Meta): KeyringPair {
    return createAccount(this.state, seed, password, meta);
  }

  forgetAccount (address: string): void {
    return forgetAccount(this.state, address);
  }

  forgetAddress (address: string): void {
    return forgetAddress(this.state, address);
  }

  isAvailable (address: string | Uint8Array): boolean {
    return isAvailable(this.state, address);
  }

  getAccounts (): Array<KeyringAddress> {
    return getAccounts(this.state);
  }

  getAddress (address: string | Uint8Array): KeyringAddress {
    return getAddress(this.state, address);
  }

  getAddresses (): Array<KeyringAddress> {
    return getAddresses(this.state);
  }

  getPair (address: string | Uint8Array): KeyringPair {
    return this.state.keyring.getPair(address);
  }

  getPairs (): Array<KeyringPair> {
    return this.state.keyring.getPairs().filter((pair) =>
      development.isDevelopment() || pair.getMeta().isTesting !== true
    );
  }

  loadAll (): void {
    return loadAll(this.state);
  }

  restoreAccount (json: KeyringPair$Json, password: string): KeyringPair {
    return restoreAccount(this.state, json, password);
  }

  saveAccount (pair: KeyringPair, password?: string): void {
    return saveAccount(this.state, pair, password);
  }

  saveAccountMeta (pair: KeyringPair, meta: KeyringPair$Meta): void {
    return saveAccountMeta(this.state, pair, meta);
  }

  saveAddress (address: string, meta: KeyringPair$Meta): void {
    return saveAddress(this.state, address, meta);
  }

  saveRecent (address: string): SingleAddress {
    return saveRecent(this.state, address);
  }

  setDevMode (isDevelopment: boolean): void {
    return development.set(isDevelopment);
  }
}

const keyringInstance = new Keyring();

export default keyringInstance;
