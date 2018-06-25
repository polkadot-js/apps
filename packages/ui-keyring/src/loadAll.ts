// Copyright 2017-2018 @polkadot/ui-keyring authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { KeyringPair$Json } from '@polkadot/util-keyring/types';
import { State, KeyringJson } from './types';

import store from 'store';

import createOptions from './options';
import { accountRegex, addressRegex } from './defaults';

export default function loadAll (state: State): void {
  const { available, keyring } = state;

  store.each((json: KeyringJson, key: string) => {
    if (accountRegex.test(key)) {
      keyring.addFromJson(json as KeyringPair$Json);
      available.account[json.address] = json;
    } else if (addressRegex.test(key)) {
      available.address[json.address] = json;
    }
  });

  createOptions(state);
}
