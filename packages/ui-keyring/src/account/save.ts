// Copyright 2017-2018 @polkadot/ui-keyring authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { KeyringPair } from '@polkadot/util-keyring/types';
import { State } from '../types';

export default function saveAccount (state: State, pair: KeyringPair, password?: string): void {
  const json = pair.toJson(password);

  if (!json.meta.whenCreated) {
    json.meta.whenCreated = Date.now();
  }

  state.accounts.add(json.address, json);
}
