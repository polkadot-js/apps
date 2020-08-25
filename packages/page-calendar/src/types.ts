// Copyright 2017-2020 @polkadot/app-calendar authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import BN from 'bn.js';

export type EntryType = 'councilElection' | 'democracyLaunch' | 'nextEra' | 'scheduler' | 'societyChallenge' | 'societyRotate' | 'treasurySpend';

export interface EntryInfo {
  blockNumber: BN;
  date: Date;
  dateTime: number;
  id: string;
  type: EntryType;
}
