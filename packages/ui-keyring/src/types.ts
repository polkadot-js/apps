// Copyright 2017-2018 @polkadot/ui-keyring authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { KeyringInstance as BaseKeyringInstance, KeyringPair, KeyringPair$Meta, KeyringPair$Json } from '@polkadot/keyring/types';
import { AccountSubject, AddressSubject, SingleAddress } from './observable/types';

export type KeyringJson$Meta = {
  isRecent?: boolean,
  isTesting?: boolean,
  name?: string,
  whenCreated?: number,
  whenEdited?: number,
  whenUsed?: number,
  [index: string]: any
};

export type KeyringJson = {
  address: string,
  meta: KeyringJson$Meta
};

export type KeyringAddress = {
  address: () => string,
  isValid: () => boolean,
  publicKey: () => Uint8Array,
  getMeta: () => KeyringJson$Meta
};

export interface KeyringStruct {
  readonly accounts: AccountSubject;
  readonly addresses: AddressSubject;
  readonly keyring: BaseKeyringInstance | undefined;

  addAccountPair: (pair: KeyringPair, password: string) => KeyringPair;
  backupAccount: (pair: KeyringPair, password: string) => KeyringPair$Json;
  createAccount: (seed: Uint8Array, password?: string, meta?: KeyringPair$Meta) => KeyringPair;
  createAccountMnemonic: (seed: string, password?: string, meta?: KeyringPair$Meta) => KeyringPair;
  encryptAccount: (pair: KeyringPair, password: string) => void;
  forgetAccount: (address: string) => void;
  forgetAddress: (address: string) => void;
  getAccount: (address: string | Uint8Array) => KeyringAddress;
  getAccounts: () => Array<KeyringAddress>;
  getAddress: (address: string | Uint8Array) => KeyringAddress;
  getAddresses: () => Array<KeyringAddress>;
  getPair: (address: string | Uint8Array) => KeyringPair;
  getPairs: () => Array<KeyringPair>;
  isAvailable: (address: string | Uint8Array) => boolean;
  isPassValid: (password: string) => boolean;
  loadAll: () => void;
  restoreAccount: (json: KeyringPair$Json, password: string) => KeyringPair;
  saveAccount: (pair: KeyringPair, password?: string) => void;
  saveAccountMeta: (pair: KeyringPair, meta: KeyringPair$Meta) => void;
  saveAddress: (address: string, meta: KeyringPair$Meta) => void;
  saveRecent: (address: string) => SingleAddress;
  setDevMode: (isDevelopment: boolean) => void;
}
