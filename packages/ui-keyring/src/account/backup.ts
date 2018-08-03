// Copyright 2017-2018 @polkadot/ui-keyring authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { KeyringPair$Json } from '@polkadot/util-keyring/types';
import { State } from '../types';

import store from 'store';

import { accountKey } from '../defaults';

export default function accountBackup (state: State, _address: string, password?: string): KeyringPair$Json | void {

  if (!_address) {
    return;
  }

  return store.get(accountKey(_address));
}
