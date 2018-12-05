// Copyright 2017-2018 @polkadot/ui-keyring authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Prefix } from '@polkadot/keyring/address/types';
import { KeyringInstance as BaseKeyringInstance, KeyringPair, KeyringPair$Meta, KeyringPair$Json } from '@polkadot/keyring/types';
import { AccountSubject, AddressSubject, SingleAddress } from './observable/types';
import { KeyringAddress, KeyringJson, KeyringJson$Meta, KeyringStruct } from './types';

import store from 'store';
import createPair from '@polkadot/keyring/pair';
import testKeyring from '@polkadot/keyring/testing';
import { hexToU8a, isHex, isString } from '@polkadot/util';

import accounts from './observable/accounts';
import addresses from './observable/addresses';
import env from './observable/development';
import { accountKey, addressKey, accountRegex, addressRegex, MAX_PASS_LEN } from './defaults';
import keyringOption from './options';

// No accounts (or test accounts) should be loaded until after the chain determination.
// Chain determination occurs outside of Keyring. Loading `keyring.loadAll()` is triggered
// from the API after the chain is received
class Keyring implements KeyringStruct {
  private _accounts: AccountSubject;
  private _addresses: AddressSubject;
  private _keyring?: BaseKeyringInstance;
  private _prefix: Prefix;

  constructor () {
    this._accounts = accounts;
    this._addresses = addresses;
    this._keyring = undefined;
    this._prefix = 42;
  }

  get accounts () {
    return this._accounts;
  }

  get addresses () {
    return this._addresses;
  }

  get keyring (): BaseKeyringInstance {
    if (this._keyring) {
      return this._keyring;
    }

    throw new Error(`Keyring should be initialised via 'loadAll' before use`);
  }

  decodeAddress (key: string | Uint8Array): Uint8Array {
    return this.keyring.decodeAddress(key);
  }

  encodeAddress (key: string | Uint8Array): string {
    return this.keyring.encodeAddress(key);
  }

  setAddressPrefix (prefix: number): void {
    this._prefix = prefix as Prefix;
  }

  private setKeyring (keyring: BaseKeyringInstance): void {
    this._keyring = keyring;
  }

  private addAccountPairs (): void {
    this.keyring
      .getPairs()
      .forEach((pair: KeyringPair) => {
        const address = pair.address();

        this.accounts.add(address, {
          address,
          meta: pair.getMeta()
        });
      });
  }

  private addTimestamp (pair: KeyringPair): void {
    if (!pair.getMeta().whenCreated) {
      pair.setMeta({
        whenCreated: Date.now()
      });
    }
  }

  addAccountPair (pair: KeyringPair, password: string): KeyringPair {
    this.keyring.addPair(pair);
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
    const pair = this.keyring.addFromSeed(seed, meta);

    this.saveAccount(pair, password);

    return pair;
  }

  createAccountMnemonic (seed: string, password?: string, meta: KeyringPair$Meta = {}): KeyringPair {
    const pair = this.keyring.addFromMnemonic(seed, meta);

    this.saveAccount(pair, password);

    return pair;
  }

  encryptAccount (pair: KeyringPair, password: string): void {
    const json = pair.toJson(password);

    json.meta.whenEdited = Date.now();

    this.keyring.addFromJson(json);
    this.accounts.add(json.address, json);
  }

  forgetAccount (address: string): void {
    this.keyring.removePair(address);
    this.accounts.remove(address);
  }

  forgetAddress (address: string): void {
    this.addresses.remove(address);
  }

  getAccount (address: string | Uint8Array): KeyringAddress {
    return this.getAddress(address, 'account');
  }

  getAccounts (): Array<KeyringAddress> {
    const available = this.accounts.subject.getValue();

    return Object
      .keys(available)
      .map((address) =>
        this.getAddress(address, 'account')
      )
      .filter((account) =>
        env.isDevelopment() || account.getMeta().isTesting !== true
      );
  }

  getAddress (_address: string | Uint8Array, type: 'account' | 'address' = 'address'): KeyringAddress {
    const address = isString(_address)
      ? _address
      : this.encodeAddress(_address);
    const publicKey = this.decodeAddress(address);
    const subject = type === 'account'
      ? this.accounts.subject
      : this.addresses.subject;

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
    const available = this.addresses.subject.getValue();

    return Object
      .keys(available)
      .map((address) =>
        this.getAddress(address)
      );
  }

  getPair (address: string | Uint8Array): KeyringPair {
    return this.keyring.getPair(address);
  }

  getPairs (): Array<KeyringPair> {
    return this.keyring.getPairs().filter((pair: KeyringPair) =>
      env.isDevelopment() || pair.getMeta().isTesting !== true
    );
  }

  isAvailable (_address: Uint8Array | string): boolean {
    const accountsValue = this.accounts.subject.getValue();
    const addressesValue = this.addresses.subject.getValue();
    const address = isString(_address)
      ? _address
      : this.encodeAddress(_address);

    return !accountsValue[address] && !addressesValue[address];
  }

  isPassValid (password: string): boolean {
    return password.length > 0 && password.length <= MAX_PASS_LEN;
  }

  loadAll (): void {
    const keyring = testKeyring();

    keyring.setAddressPrefix(this._prefix);

    this.setKeyring(keyring);
    this.addAccountPairs();

    store.each((json: KeyringJson, key: string) => {
      if (accountRegex.test(key)) {
        if (!json.meta.isTesting && (json as KeyringPair$Json).encoded) {
          const pair = keyring.addFromJson(json as KeyringPair$Json);

          this.accounts.add(pair.address(), json);
        }

        const [, hexAddr] = key.split(':');

        if (hexAddr.substr(0, 2) !== '0x') {
          store.remove(key);
          store.set(accountKey(hexAddr), json);
        }
      } else if (addressRegex.test(key)) {
        const address = this.encodeAddress(
          isHex(json.address)
            ? hexToU8a(json.address)
            : this.decodeAddress(json.address)
        );
        const [, hexAddr] = key.split(':');

        this.addresses.add(address, json);

        if (hexAddr.substr(0, 2) !== '0x') {
          store.remove(key);
          store.set(addressKey(hexAddr), json);
        }
      }
    });

    keyringOption.init(this);
  }

  restoreAccount (json: KeyringPair$Json, password: string): KeyringPair {
    const pair = createPair(
      {
        publicKey: this.decodeAddress(json.address),
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
    this.addTimestamp(pair);

    const json = pair.toJson(password);

    this.keyring.addFromJson(json);
    this.accounts.add(json.address, json);
  }

  saveAccountMeta (pair: KeyringPair, meta: KeyringPair$Meta): void {
    const address = pair.address();
    const json = store.get(accountKey(address));

    pair.setMeta(meta);
    json.meta = pair.getMeta();

    this.accounts.add(json.address, json);
  }

  saveAddress (address: string, meta: KeyringPair$Meta): void {
    const available = this.addresses.subject.getValue();

    const json = (available[address] && available[address].json) || {
      address,
      meta: {
        isRecent: void 0,
        whenCreated: Date.now()
      }
    };

    Object.keys(meta).forEach((key) => {
      json.meta[key] = meta[key];
    });

    delete json.meta.isRecent;

    this.addresses.add(address, json);
  }

  saveRecent (address: string): SingleAddress {
    const available = this.addresses.subject.getValue();

    if (!available[address]) {
      const json = {
        address,
        meta: {
          isRecent: true,
          whenCreated: Date.now()
        }
      };

      this.addresses.add(address, (json as KeyringJson));
    }

    return this.addresses.subject.getValue()[address];
  }

  setDevMode (isDevelopment: boolean): void {
    env.set(isDevelopment);
  }
}

const keyringInstance = new Keyring();

export default keyringInstance;
