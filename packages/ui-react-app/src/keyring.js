// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { KeyringPair } from '@polkadot/util-keyring/types';
import type { KeyringInstance } from './types';

import store from 'store';
import testKeyring from '@polkadot/util-keyring/testing';

const keyring = testKeyring();

const keyringExt: KeyringInstance = {
  ...keyring,
  loadJson: (): void => {
    store.each((value, key: string) => {
      if (!/account:/.test(key)) {
        return;
      }

      keyring.addFromJson(value);
    });
  },
  saveJson: (pair: KeyringPair, password?: string): void => {
    const json = pair.toJson(password);

    store.set(`account:${json.address}`, json);
  }
};

keyringExt.loadJson();

export default keyringExt;
