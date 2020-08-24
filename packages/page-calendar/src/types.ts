// Copyright 2017-2020 @polkadot/app-calendar authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import BN from 'bn.js';

export type EntryType = 'nextEra';

export interface EntryInfo {
  blockNumber: BN;
  date: Date;
  type: EntryType;
}
