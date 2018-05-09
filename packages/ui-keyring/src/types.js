// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { KeyringInstance as BaseKeyringInstance, KeyringPair } from '@polkadot/util-keyring/types';

export type KeyringInstance = BaseKeyringInstance & {
  loadJson: () => void,
  saveJson: (pair: KeyringPair, password?: string) => void
};

export type KeyringOption = {
  'data-manual'?: boolean,
  name: string,
  text: React$Node | string,
  value: string
};

export type KeyringOptions = Array<KeyringOption>;

export type State = {
  keyring: BaseKeyringInstance
};
