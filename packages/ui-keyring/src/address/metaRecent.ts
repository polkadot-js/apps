// Copyright 2017-2018 @polkadot/ui-keyring authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { KeyringJson, KeyringOption, State } from '../types';

import createOptions from '../options';

export default function saveRecent (state: State, address: string): KeyringOption {
  const available = state.addresses.subject.getValue();

  if (!available[address]) {
    const json = {
      address,
      meta: {
        isRecent: true,
        whenCreated: Date.now()
      }
    };

    state.addresses.add(address, (json as KeyringJson));
  }

  createOptions(state);

  console.log('saveRecent', state.options);

  // @ts-ignore it should be there now...
  return state.options.recent.find(({ value }) =>
    value === address
  );
}
