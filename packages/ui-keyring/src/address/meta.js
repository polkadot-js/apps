// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

// import type { KeyringPair$Meta } from '@polkadot/util-keyring/types';
import type { KeyringJson, KeyringOption, State } from '../types';

import store from 'store';

import { addressKey } from '../defaults';
import createOptions from '../options';

export default function saveMeta (state: State, address: string, meta: KeyringPair$Meta): KeyringOption {
  const json = state.available[address] || {
    address,
    meta: {
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

  // $FlowFixMe we will have it now
  return state.options.address.find(({ value }) => value === address);
}
