// Copyright 2017-2025 @polkadot/app-referenda authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { PalletConvictionVotingVoteVoting } from '@polkadot/types/lookup';
import type { BN } from '@polkadot/util';

export interface LockResultItem {
  classId: BN;
}

export type LockResult = Record<string, LockResultItem[]>;

export interface VoteResultCasting {
  refId: BN;
}

export interface VoteResultDelegating {
  conviction: PalletConvictionVotingVoteVoting['asDelegating']['conviction']['type'];
  targetId: string;
}

export interface VoteResultItem extends LockResultItem {
  casting?: VoteResultCasting[];
  delegating?: VoteResultDelegating;
}

export type VoteResult = Record<string, VoteResultItem[]>;
