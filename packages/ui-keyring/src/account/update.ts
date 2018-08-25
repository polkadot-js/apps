// Copyright 2017-2018 @polkadot/ui-keyring authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { KeyringPair } from '@polkadot/util-keyring/types';
import { State } from '../types';

import get from '../address/get';

export default function updateAccount (state: State, pair: KeyringPair, password?: string, newPassword?: string): void {
  const json = pair.toJson(newPassword);

  if (!json.meta.whenCreated) {
    json.meta.whenCreated = Date.now();
  }

  if (!json.meta.whenEdited) {
    json.meta.whenEdited = Date.now();
  }

  // state.keyring.removePair(pair.address());
  state.keyring.addFromJson(json);

  state.accounts.add(json.address, json);

  const available = state.accounts.subject.getValue();

  console.log('available: ', available);

  const accounts = Object
    .keys(available)
    .map((address) =>
      get(state, address, 'account')
    );
  console.log('accounts: ', accounts);
}
