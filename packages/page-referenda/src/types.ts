// Copyright 2017-2022 @polkadot/app-referenda authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { PalletReferendaReferendumInfoConvictionVotingTally, PalletReferendaReferendumInfoRankedCollectiveTally, PalletReferendaTrackInfo } from '@polkadot/types/lookup';
import type { BN } from '@polkadot/util';

export type PalletReferenda = 'referenda' | 'rankedPolls' | 'fellowshipReferenda';

export type PalletVote = 'convictionVoting' | 'rankedCollective' | 'fellowshipCollective';

export interface ReferendaGroup {
  key: string;
  track?: PalletReferendaTrackInfo;
  trackId?: BN;
  trackName?: string;
  referenda?: Referendum[];
}

export interface ReferendaGroupKnown extends ReferendaGroup {
  referenda: Referendum[];
}

export interface Referendum {
  id: BN;
  info: PalletReferendaReferendumInfoConvictionVotingTally | PalletReferendaReferendumInfoRankedCollectiveTally;
  isConvictionVote: boolean;
  key: string;
  track?: PalletReferendaTrackInfo;
  trackId?: BN;
}

export interface ReferendumProps {
  className?: string;
  isMember: boolean;
  members?: string[];
  palletReferenda: PalletReferenda;
  palletVote: PalletVote;
  ranks?: BN[];
  trackInfo?: TrackInfo;
  value: Referendum;
}

export interface Summary {
  deciding?: BN;
  refActive?: number;
  refCount?: BN;
}

export interface TrackInfo {
  compare?: (input: BN) => boolean;
  origin: Record<string, string> | Record<string, string>[];
  text?: string;
}
