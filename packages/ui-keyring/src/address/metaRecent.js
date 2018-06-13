// Copyright 2017-2018 @polkadot/ui-keyring authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { KeyringJson, KeyringOption, State } from '../types';

import store from 'store';

import { addressKey } from '../defaults';
import createOptions from '../options';

export default function saveRecent (state: State, address: string): KeyringOption {
  console.log('saveRecent', address);

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
