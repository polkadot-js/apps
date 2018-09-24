// Copyright 2017-2018 @polkadot/ui-keyring authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { KeyringPair, KeyringPair$Json } from '@polkadot/util-keyring/types';
import { State } from '../types';

export default function accountBackup (state: State, pair: KeyringPair, password: string): KeyringPair$Json {
  if (pair.isLocked()) {
    pair.lock();
  }

  pair.decodePkcs8(password);

  return pair.toJson(password);
}
