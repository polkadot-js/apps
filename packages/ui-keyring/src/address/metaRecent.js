// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

// import type { KeyringPair$Meta } from '@polkadot/util-keyring/types';
import type { KeyringJson, KeyringOption, State } from '../types';

import store from 'store';

import { addressKey } from '../defaults';
import createOptions from '../options';

export default function saveRecent (state: State, address: string): KeyringOption {
  if (!state.available[address]) {
    const json = {
      address,
      meta: {
        isRecent: true,
        whenCreated: Date.now()
      }
    };

    store.set(addressKey(json.address), json);
    state.available.address[address] = (json: $Shape<KeyringJson>);
  }

  createOptions(state);

  // $FlowFixMe we will have it now
  return state.options.recent.find(({ value }) => value === address);
}
