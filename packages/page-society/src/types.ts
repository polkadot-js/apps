// Copyright 2017-2021 @polkadot/app-society authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveSocietyCandidate, DeriveSocietyMember } from '@polkadot/api-derive/types';
import type { SocietyVote } from '@polkadot/types/interfaces';

export interface MapMember {
  isFounder?: boolean;
  isHead?: boolean;
  isSkeptic?: boolean;
  isVoter?: boolean;
  key: string;
  member: DeriveSocietyMember;
}

export interface OwnMembers {
  allMembers: string[];
  isMember: boolean;
  ownMembers: string[];
}

export type VoteType = [string, SocietyVote];

export interface VoteSplit {
  allAye: VoteType[];
  allNay: VoteType[];
  allSkeptic: VoteType[];
}

export interface Voters {
  candidates: DeriveSocietyCandidate[];
  skeptics: string[];
  voters: string[];
}
