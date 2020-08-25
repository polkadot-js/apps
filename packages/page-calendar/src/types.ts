// Copyright 2017-2020 @polkadot/app-calendar authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import BN from 'bn.js';

export type EntryType = 'councilElection' | 'councilMotion' | 'democracyDispatch' | 'democracyLaunch' | 'referendumDispatch' | 'referendumVote' | 'scheduler' | 'societyChallenge' | 'societyRotate'| 'stakingEra' | 'stakingSession' | 'stakingSlash' | 'treasurySpend';

export interface EntryInfo {
  blockNumber: BN;
  blocks: BN;
  date: Date;
  dateTime: number;
  info: string | BN | null;
  isPending?: boolean;
  type: EntryType;
}
