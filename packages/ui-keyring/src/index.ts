// Copyright 2017-2018 @polkadot/ui-keyring authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { KeyringPair, KeyringPair$Meta, KeyringPair$Json } from '@polkadot/keyring/types';
import { SingleAddress } from './observable/types';
import { KeyringAddress, KeyringInstance, State } from './types';

import store from 'store';
import testKeyring from '@polkadot/keyring/testing';
import createPair from '@polkadot/keyring/pair';
import { decodeAddress } from '@polkadot/keyring';
import { hexToU8a } from '@polkadot/util';

import accounts from './observable/accounts';
import addresses from './observable/addresses';
import development from './observable/development';
import { accountKey } from './defaults';
import loadAll from './loadAll';
import isAvailable from './isAvailable';
import isPassValid from './isPassValid';
import forgetAddress from './address/forget';
import getAddress from './address/get';
import getAddresses from './address/all';
import saveAddress from './address/meta';
import saveRecent from './address/metaRecent';

// NOTE Everything is loaded in API after chain is received
// loadAll(state);

// FIXME The quicker we get in https://github.com/polkadot-js/apps/issues/138
// the better, this is now completely out of control
class Keyring implements KeyringInstance {
  private state: State;

  constructor () {
    this.state = {
      accounts,
      addresses,
      keyring: testKeyring()
    };
  }

  addAccountPair (pair: KeyringPair, password: string): KeyringPair {
    const { keyring } = this.state;

    keyring.addPair(pair);

    this.saveAccount(pair, password);

    return pair;
  }

  backupAccount (pair: KeyringPair, password: string): KeyringPair$Json {
    if (!pair.isLocked()) {
      pair.lock();
    }

    pair.decodePkcs8(password);

    return pair.toJson(password);
  }

  createAccount (seed: Uint8Array, password?: string, meta: KeyringPair$Meta = {}): KeyringPair {
    const { keyring } = this.state;

    const pair = keyring.addFromSeed(seed, meta);

    this.saveAccount(pair, password);

    return pair;
  }

  createAccountMnemonic (seed: string, password?: string, meta: KeyringPair$Meta = {}): KeyringPair {
    const { keyring } = this.state;

    const pair = keyring.addFromMnemonic(seed, meta);

    this.saveAccount(pair, password);

    return pair;
  }

  encryptAccount (pair: KeyringPair, password: string): void {
    const { accounts, keyring } = this.state;
    const json = pair.toJson(password);

    json.meta.whenEdited = Date.now();

    keyring.addFromJson(json);
    accounts.add(json.address, json);
  }

  forgetAccount (address: string): void {
    const { accounts, keyring } = this.state;

    keyring.removePair(address);
    accounts.remove(address);
  }

  forgetAddress (address: string): void {
    forgetAddress(this.state, address);
  }

  isAvailable (address: string | Uint8Array): boolean {
    return isAvailable(this.state, address);
  }

  isPassValid (password: string): boolean {
    return isPassValid(this.state, password);
  }

  getAccounts (): Array<KeyringAddress> {
    const { accounts } = this.state;
    const available = accounts.subject.getValue();

    return Object
      .keys(available)
      .map((address) =>
        getAddress(this.state, address, 'account')
      )
      .filter((account) =>
        !account.getMeta().isTesting
      );
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
    loadAll(this.state);
  }

  restoreAccount (json: KeyringPair$Json, password: string): KeyringPair {
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
    this.addAccountPair(pair, password);
    pair.lock();

    return pair;
  }

  saveAccount (pair: KeyringPair, password?: string): void {
    const { accounts, keyring } = this.state;
    const json = pair.toJson(password);

    if (!json.meta.whenCreated) {
      json.meta.whenCreated = Date.now();
    }

    keyring.addFromJson(json);
    accounts.add(json.address, json);
  }

  saveAccountMeta (pair: KeyringPair, meta: KeyringPair$Meta): void {
    const { accounts } = this.state;
    const address = pair.address();
    const json = store.get(accountKey(address));

    pair.setMeta(meta);
    json.meta = pair.getMeta();

    accounts.add(json.address, json);
  }

  saveAddress (address: string, meta: KeyringPair$Meta): void {
    saveAddress(this.state, address, meta);
  }

  saveRecent (address: string): SingleAddress {
    return saveRecent(this.state, address);
  }

  setDevMode (isDevelopment: boolean): void {
    development.set(isDevelopment);
  }
}

const keyringInstance = new Keyring();

export default keyringInstance;
