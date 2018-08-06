// Copyright 2017-2018 @polkadot/ui-keyring authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { KeyringPair, KeyringPair$Json, KeyringPair$Meta } from '@polkadot/util-keyring/types';
import { State } from '../types';

import store from 'store';

import createOptions from '../options';

export default function accountLoad (state: State, address: string, encoded: KeyringPair$Json, meta?: KeyringPair$Meta): KeyringPair {
  const { available, keyring } = state;

  const json = encoded;
  const _address = json.address;

  if (_address) {
    const pair = keyring.addFromJson(json as KeyringPair$Json);
    available.account[json.address] = json;

    createOptions(state);
  }
}
