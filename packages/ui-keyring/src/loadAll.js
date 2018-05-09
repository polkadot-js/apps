// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { State } from './types';

import store from 'store';

import { accountRegex } from './defaults';

export default function loadAll ({ keyring }: State): void {
  store.each((json, key: string) => {
    if (accountRegex.test(key)) {
      keyring.addFromJson(json);
    }
  });
}
