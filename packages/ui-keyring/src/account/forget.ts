// Copyright 2017-2018 @polkadot/ui-keyring authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { State } from '../types';

export default function forgetAccount (state: State, address: string): void {
  state.keyring.removePair(address);
  state.accounts.remove(address);
}
