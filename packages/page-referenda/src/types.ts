// Copyright 2017-2023 @polkadot/app-referenda authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { PalletReferendaReferendumInfoConvictionVotingTally, PalletReferendaReferendumInfoRankedCollectiveTally, PalletReferendaTrackInfo } from '@polkadot/types/lookup';
import type { BN } from '@polkadot/util';

export type PalletReferenda = 'referenda' | 'rankedPolls' | 'fellowshipReferenda';

export type PalletVote = 'convictionVoting' | 'rankedCollective' | 'fellowshipCollective';

export interface ReferendaGroup {
  key: string;
  track?: PalletReferendaTrackInfo;
  trackGraph?: CurveGraph;
  trackId?: BN;
  trackName?: string;
  referenda?: Referendum[];
}

export interface ReferendaGroupKnown extends ReferendaGroup {
  referenda: Referendum[];
}

export interface Referendum {
  decidingEnd?: BN;
  id: BN;
  info: PalletReferendaReferendumInfoConvictionVotingTally | PalletReferendaReferendumInfoRankedCollectiveTally;
  isConvictionVote: boolean;
  key: string;
  track?: PalletReferendaTrackInfo;
  trackId?: BN;
  trackGraph?: CurveGraph;
}

export interface ReferendumProps {
  className?: string;
  activeIssuance?: BN;
  isMember: boolean;
  members?: string[];
  onExpand?: () => void;
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

export interface CurveGraph {
  approval: BN[];
  support: BN[];
  x: BN[];
}

export interface TrackDescription {
  graph: CurveGraph;
  id: BN;
  info: PalletReferendaTrackInfo;
}

export interface TrackInfo {
  compare?: (input: BN) => boolean;
  origin: Record<string, string> | Record<string, string>[];
  text?: string;
}

export interface TrackInfoExt extends TrackInfo {
  track: TrackDescription;
}

export interface Lock {
  classId: BN;
  endBlock: BN;
  locked: string;
  refId: BN;
  total: BN;
}
