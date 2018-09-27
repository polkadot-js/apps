// Copyright 2017-2018 @polkadot/ui-keyring authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { State } from './types';

import { MAX_PASS_LEN } from './defaults';

export default function isPassValid (state: State, password: string): boolean {
  return password.length > 0 && password.length <= MAX_PASS_LEN;
}
