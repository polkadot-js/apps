// Copyright 2017-2018 @polkadot/ui-keyring authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { KeyringPair$Meta } from '@polkadot/util-keyring/types';
import { State } from '../types';

export default function saveMeta (state: State, address: string, meta: KeyringPair$Meta): void {
  const available = state.addresses.subject.getValue();

  const json = (available[address] && available[address].json) || {
    address,
    meta: {
      isRecent: void 0,
      whenCreated: Date.now()
    }
  };

  Object.keys(meta).forEach((key) => {
    json.meta[key] = meta[key];
  });

  delete json.meta.isRecent;

  state.addresses.add(address, json);
}
