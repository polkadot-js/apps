// Copyright 2017-2023 @polkadot/app-referenda authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BN } from '@polkadot/util';

export interface LockResultItem {
  classId: BN;
}

export type LockResult = Record<string, LockResultItem[]>;

export interface ReferendumVoteItem {
  refId: BN;
}

export interface VoteResultItem extends LockResultItem {
  isDelegating?: boolean;
  casting?: ReferendumVoteItem[];
}

export type VoteResult = Record<string, VoteResultItem[]>;
