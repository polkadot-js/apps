// Copyright 2017-2018 @polkadot/ui-keyring authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { KeyringAddress, State } from '../types';

import get from '../address/get';

export default function all (state: State): Array<KeyringAddress> {
  return Object
    .keys(state.available.account)
    .map((address) =>
      get(state, address, 'account')
    )
    .filter((account) => !account.getMeta().isTesting);
}
