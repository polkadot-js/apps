// Copyright 2017-2018 @polkadot/ui-keyring authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { KeyringPair$Meta } from '@polkadot/util-keyring/types';
import type { KeyringJson, State } from '../types';

import store from 'store';

import { addressKey } from '../defaults';
import createOptions from '../options';

export default function saveMeta (state: State, address: string, meta: KeyringPair$Meta): void {
  const json = state.available[address] || {
    address,
    meta: {
      isRecent: void 0,
      whenCreated: Date.now()
    }
  };

  Object.keys(meta).forEach((key) => {
    json.meta[key] = meta[key];
  });

  delete json.meta.isRecent;

  store.set(addressKey(address), json);
  state.available.address[address] = (json: $Shape<KeyringJson>);

  createOptions(state);
}
