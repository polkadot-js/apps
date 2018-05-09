// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { State } from './types';

import store from 'store';

import createOptions from './options';
import { accountRegex, addressRegex } from './defaults';

export default function loadAll (state: State): void {
  const { available, keyring } = state;

  store.each((json: AccountJson, key: string) => {
    if (accountRegex.test(key)) {
      keyring.addFromJson(json);
      available.account[json.address] = json;
    } else if (addressRegex.test(key)) {
      available.address[json.address] = json;
    }
  });

  createOptions(state);
}
