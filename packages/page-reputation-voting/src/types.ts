// Copyright 2017-2025 @polkadot/app-reputation-voting authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BN } from '@polkadot/util';

export type PalletReferenda = 'referenda';

export type PalletVote = 'reputationVoting';

export interface VoteDirection {
  isAye: boolean;
  isNay: boolean;
}

export interface ReputationTally {
  ayes: BN;
  nays: BN;
  turnout: number;
}

export interface VoteRecord {
  direction: VoteDirection;
  reputation: number;
  votedAt: BN;
}

export interface ReferendaGroup {
  key: string;
  trackId?: BN;
  trackName?: string;
  referenda?: Referendum[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface Referendum {
  decidingEnd?: BN;
  id: BN;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  info: any;
  key: string;
  trackId?: BN;
}

export interface ReferendumProps {
  className?: string;
  isMember: boolean;
  value: Referendum;
}

export interface Summary {
  refActive?: number;
  refCount?: BN;
}
