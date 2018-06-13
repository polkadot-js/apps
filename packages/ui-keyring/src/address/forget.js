// Copyright 2017-2018 @polkadot/ui-keyring authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { State } from '../types';

import store from 'store';

import { addressKey } from '../defaults';
import createOptions from '../options';

export default function forgetAddress (state: State, address: string): void {
  store.remove(addressKey(address));

  delete state.available.address[address];

  createOptions(state);
}
