// Copyright 2017-2018 @polkadot/ui-keyring authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { KeyringPair, KeyringPair$Json } from '@polkadot/util-keyring/types';
import { State } from '../types';

import createOptions from '../options';

export default function accountLoad (state: State, json: KeyringPair$Json): void {
  const { available, keyring } = state;

  keyring.addFromJson(json as KeyringPair$Json);
  available.account[json.address] = json;

  createOptions(state);
}
