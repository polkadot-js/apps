// Copyright 2017-2018 @polkadot/ui-keyring authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { KeyringPair$Json } from '@polkadot/keyring/types';
import { State, KeyringJson } from './types';

import store from 'store';
import testKeyring from '@polkadot/keyring/testing';
import { decodeAddress, encodeAddress } from '@polkadot/keyring';
import { hexToU8a, isHex } from '@polkadot/util';

import initOptions from './options';
import { accountRegex, addressRegex } from './defaults';

function addPairs ({ accounts, keyring }: State): void {
  keyring
    .getPairs()
    .forEach((pair) => {
      const address = pair.address();

      accounts.add(address, {
        address,
        meta: pair.getMeta()
      });
    });
}

export default function loadAll (state: State): void {
  const { accounts, addresses } = state;
  const keyring = testKeyring();

  state.keyring = keyring;

  addPairs(state);

  store.each((json: KeyringJson, key: string) => {
    if (accountRegex.test(key)) {
      if (!json.meta || !json.meta.isTesting) {
        const pair = keyring.addFromJson(json as KeyringPair$Json);

        accounts.add(pair.address(), json);
      }
    } else if (addressRegex.test(key)) {
      const address = encodeAddress(
        isHex(json.address)
          ? hexToU8a(json.address)
          : decodeAddress(json.address)
      );

      addresses.add(address, json);
    }
  });

  initOptions(state);
}
