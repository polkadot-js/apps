// Copyright 2017-2018 @polkadot/ui-keyring authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { KeyringPair } from '@polkadot/util-keyring/types';
import { State } from '../types';

export default function encryptAccount (state: State, pair: KeyringPair, password: string): void {
  const { accounts, keyring } = state;
  const json = pair.toJson(password);

  json.meta.whenEdited = Date.now();

  keyring.addFromJson(json);
  accounts.add(json.address, json);
}
