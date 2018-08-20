// Copyright 2017-2018 @polkadot/ui-keyring authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { KeyringPair, KeyringPair$Meta } from '@polkadot/util-keyring/types';
import { State } from '../types';

import store from 'store';

import { accountKey } from '../defaults';

export default function saveAccountMeta (state: State, pair: KeyringPair, meta: KeyringPair$Meta): void {
  const address = pair.address();
  const json = store.get(accountKey(address));

  pair.setMeta(meta);
  json.meta = pair.getMeta();

  state.accounts.add(json.address, json);
}
