// Copyright 2017-2025 @polkadot/app-reputation-voting authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { PalletReferendaReferendumInfoConvictionVotingTally, PalletReferendaReferendumInfoRankedCollectiveTally } from '@polkadot/types/lookup';
import type { Codec } from '@polkadot/types/types';
import type { BN } from '@polkadot/util';

export type PalletReferenda = 'referenda';

export type PalletVote = 'reputationVoting';

export interface VoteDirection extends Codec {
  readonly isAye: boolean;
  readonly isNay: boolean;
}

export interface ReputationTally {
  ayes: BN;
  nays: BN;
  turnout: BN;
}

export interface VoteRecord extends Codec {
  readonly direction: VoteDirection;
  readonly reputation: BN;
  readonly votedAt: BN;
}

export interface ReferendaGroup {
  key: string;
  trackId?: BN;
  trackName?: string;
  referenda?: Referendum[];
}

export interface Referendum {
  decidingEnd?: BN;
  id: BN;
  info: PalletReferendaReferendumInfoConvictionVotingTally | PalletReferendaReferendumInfoRankedCollectiveTally;
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
