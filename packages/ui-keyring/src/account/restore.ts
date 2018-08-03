// Copyright 2017-2018 @polkadot/ui-keyring authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { KeyringPair$Json } from '@polkadot/util-keyring/types';
import { State } from '../types';

import store from 'store';

import { accountKey } from '../defaults';
import createOptions from '../options';

export default function accountRestore (state: State, json: KeyringPair$Json): void {

  if (!json.meta.whenCreated) {
    json.meta.whenCreated = Date.now();
  }

  store.set(accountKey(json.address), json);

  createOptions(state);
}
