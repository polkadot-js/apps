// Copyright 2017-2025 @polkadot/app-calendar authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BN } from '@polkadot/util';

export type EntryType = 'councilElection' | 'councilMotion' | 'democracyDispatch' | 'democracyLaunch' | 'parachainAuction' | 'parachainLease' | 'referendumDispatch' | 'referendumVote' | 'scheduler' | 'societyChallenge' | 'societyRotate'| 'stakingEpoch' | 'stakingEra' | 'stakingSlash' | 'treasurySpend';

export interface EntryInfo {
  blockNumber: BN;
  blocks: BN;
  date: Date;
  dateTime: number;
  info: string | BN | null;
  isPending?: boolean;
}

export interface EntryInfoTyped extends EntryInfo {
  type: EntryType;
}

export interface DateState {
  dateMonth: Date;
  dateMonthNext: Date;
  dateSelected: Date;
  days: number[];
  startClass: string;
}
