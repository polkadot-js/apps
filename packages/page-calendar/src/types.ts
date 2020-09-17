// Copyright 2017-2020 @polkadot/app-calendar authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';

export type EntryType = 'councilElection' | 'councilMotion' | 'democracyDispatch' | 'democracyLaunch' | 'referendumDispatch' | 'referendumVote' | 'scheduler' | 'societyChallenge' | 'societyRotate'| 'stakingEpoch' | 'stakingEra' | 'stakingSlash' | 'treasurySpend';

export interface EntryInfo {
  blockNumber: BN;
  blocks: BN;
  date: Date;
  dateTime: number;
  info: string | BN | null;
  isPending?: boolean;
  type: EntryType;
}

export interface DateState {
  dateMonth: Date;
  dateMonthNext: Date;
  dateSelected: Date;
  days: number[];
  startClass: string;
}
