// Copyright 2017-2018 @polkadot/ui-keyring authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { KeyringInstance as BaseKeyringInstance, KeyringPair, KeyringPair$Meta } from '@polkadot/util-keyring/types';

export type KeyringOption$Type = 'account' | 'address' | 'all' | 'recent' | 'testing';

export type KeyringOption = {
  className?: string,
  disabled?: boolean,
  content?: React$Node | string,
  key: string | null,
  name: string,
  text: React$Node | string,
  value: string | null
};

export type KeyringOptions = Array<KeyringOption>;

export type KeyringJson$Meta = {
  isRecent?: boolean,
  isTesting?: boolean,
  name?: string,
  whenCreated?: number,
  whenEdited?: number,
  whenUsed?: number
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
}

export type State = {
  isTestMode: boolean,
  available: {
    account: { [string]: KeyringJson },
    address: { [string]: KeyringJson }
  },
  keyring: BaseKeyringInstance,
  options: {
    [KeyringOption$Type]: KeyringOptions
  }
};

export type KeyringInstance = {
  createAccount: (seed: Uint8Array, password?: string, meta?: KeyringPair$Meta) => KeyringPair,
  forgetAccount: (address: string) => void,
  forgetAddress: (address: string) => void,
  getAddress: (address: string | Uint8Array) => KeyringAddress,
  getAddresses: () => Array<KeyringAddress>,
  getOptions: (type: KeyringOption$Type) => KeyringOptions,
  getPair: (address: string | Uint8Array) => KeyringPair,
  getPairs: () => Array<KeyringPair>,
  isAvailable: (address: string | Uint8Array) => boolean,
  loadAll: () => void,
  saveAccount: (pair: KeyringPair, password?: string) => void,
  saveAccountMeta: (pair: KeyringPair, meta: KeyringPair$Meta) => void,
  saveAddress: (address: string, meta: KeyringPair$Meta) => void,
  saveRecent: (address: string) => KeyringOption,
  setTestMode: (isTest: boolean) => void
};
