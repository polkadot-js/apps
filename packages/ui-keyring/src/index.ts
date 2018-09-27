// Copyright 2017-2018 @polkadot/ui-keyring authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { KeyringPair, KeyringPair$Meta, KeyringPair$Json } from '@polkadot/util-keyring/types';
import { SingleAddress } from './observable/types';
import { KeyringAddress, KeyringInstance, KeyringJson$Meta, State } from './types';

import store from 'store';
import hexToU8a from '@polkadot/util/hex/toU8a';
import isString from '@polkadot/util/is/string';
import createPair from '@polkadot/util-keyring/pair';
import addressDecode from '@polkadot/util-keyring/address/decode';
import addressEncode from '@polkadot/util-keyring/address/encode';
import testKeyring from '@polkadot/util-keyring/testing';

import accounts from './observable/accounts';
import addresses from './observable/addresses';
import development from './observable/development';
import loadAll from './loadAll';
import isAvailable from './isAvailable';
import isPassValid from './isPassValid';
import saveAddress from './address/meta';
import saveRecent from './address/metaRecent';
import { accountKey } from './defaults';

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

  addAccountPair (json: KeyringPair$Json): void {
    if (!json.meta.whenCreated) {
      json.meta.whenCreated = Date.now();
    }

    this.state.keyring.addFromJson(json);
    this.state.accounts.add(json.address, json);
  }

  backupAccount (pair: KeyringPair, password: string): KeyringPair$Json {
    if (!pair.isLocked()) {
      pair.lock();
    }

    pair.decodePkcs8(password);

    return pair.toJson(password);
  }

  createAccount (seed: Uint8Array, password?: string, meta?: KeyringPair$Meta): KeyringPair {
    const pair = this.state.keyring.addFromSeed(seed, meta);

    this.saveAccount(pair, password);

    return pair;
  }

  forgetAccount (address: string): void {
    this.state.keyring.removePair(address);
    this.state.accounts.remove(address);
  }

  forgetAddress (address: string): void {
    this.state.addresses.remove(address);
  }

  isAvailable (address: string | Uint8Array): boolean {
    return isAvailable(this.state, address);
  }

  isPassValid (password: string): boolean {
    return isPassValid(this.state, password);
  }

  getAccounts (): Array<KeyringAddress> {
    const available = this.state.accounts.subject.getValue();

    return Object
      .keys(available)
      .map((address) =>
        this.getAddress(address, 'account')
      )
      .filter((account) =>
        !account.getMeta().isTesting
      );
  }

  getAddress (_address: string | Uint8Array, type: 'account' | 'address' = 'address'): KeyringAddress {
    const address = isString(_address)
      ? _address
      : addressEncode(_address);
    const publicKey = addressDecode(address);
    const subject = type === 'account'
      ? this.state.accounts.subject
      : this.state.addresses.subject;

    return {
      address: (): string =>
        address,
      isValid: (): boolean =>
        !!subject.getValue()[address],
      publicKey: (): Uint8Array =>
        publicKey,
      getMeta: (): KeyringJson$Meta =>
        subject.getValue()[address].json.meta
    };
  }

  getAddresses (): Array<KeyringAddress> {
    const available = this.state.addresses.subject.getValue();

    return Object
      .keys(available)
      .map((address) =>
        this.getAddress(address)
      );
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
    const pair = createPair(
      {
        publicKey: addressDecode(json.address),
        secretKey: new Uint8Array()
      },
      json.meta,
      hexToU8a(json.encoded)
    );

    pair.decodePkcs8(password);
    pair.lock();
    this.state.keyring.addPair(pair);
    this.addAccountPair(json);

    return pair;
  }

  saveAccount (pair: KeyringPair, password?: string): void {
    const json = pair.toJson(password);

    if (!json.meta.whenCreated) {
      json.meta.whenCreated = Date.now();
    }

    this.state.keyring.addFromJson(json);
    this.state.accounts.add(json.address, json);
  }

  saveAccountMeta (pair: KeyringPair, meta: KeyringPair$Meta): void {
    const address = pair.address();
    const json = store.get(accountKey(address));

    pair.setMeta(meta);
    json.meta = pair.getMeta();

    this.state.accounts.add(json.address, json);
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
