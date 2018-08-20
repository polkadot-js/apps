// Copyright 2017-2018 @polkadot/ui-keyring authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { SingleAddress } from '../observable/types';
import { KeyringJson, State } from '../types';

export default function saveRecent (state: State, address: string): SingleAddress {
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

  return state.addresses.subject.getValue()[address];
}
