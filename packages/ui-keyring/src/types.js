// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { KeyringInstance as BaseKeyringInstance, KeyringPair, KeyringPair$Meta } from '@polkadot/util-keyring/types';

export type KeyringOption$Type = 'account' | 'address' | 'all' | 'recent' | 'testing';

export type KeyringOption$Data = {
  'data-is-account'?: boolean,
  'data-is-recent'?: boolean,
  'data-is-testing'?: boolean,
  'data-when-created'?: number,
  'data-when-edited'?: number,
  'data-when-used'?: number
}

export type KeyringOption = KeyringOption$Data & {
  key: string | null,
  name: string,
  text: React$Node | string,
  value: string
};

export type KeyringOptions = Array<KeyringOption>;

export type KeyringJson = {
  address: string,
  meta: {
    isRecent?: boolean,
    isTesting?: boolean,
    name?: string,
    whenCreated?: number,
    whenEdited?: number,
    whenUsed?: number
  }
};

export type State = {
  available: {
    account: { [string]: KeyringJson },
    address: { [string]: KeyringJson }
  },
  keyring: BaseKeyringInstance,
  options: {
    [KeyringOption$Type]: KeyringOptions
  }
};

export type KeyringInstance = BaseKeyringInstance & {
  getOptions: (type: KeyringOption$Type) => KeyringOptions,
  loadAll: () => void,
  saveAccount: (pair: KeyringPair, password?: string) => void,
  saveAccountMeta: (pair: KeyringPair, meta: KeyringPair$Meta) => void,
  saveRecent: (address: string) => KeyringOption
};
