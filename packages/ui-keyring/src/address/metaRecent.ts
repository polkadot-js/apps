// Copyright 2017-2018 @polkadot/ui-keyring authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { KeyringJson, KeyringOption, State } from '../types';

import store from 'store';

import { addressKey } from '../defaults';
import createOptions from '../options';

export default function saveRecent (state: State, address: string): KeyringOption {
  if (!state.available.address[address]) {
    const json = {
      address,
      meta: {
        isRecent: true,
        whenCreated: Date.now()
      }
    };

    store.set(addressKey(json.address), json);
    state.available.address[address] = (json as KeyringJson);
  }

  createOptions(state);

  // @ts-ignore it should be there now...
  return state.options.recent.find(({ value }) => value === address);
}
