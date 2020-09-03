// Copyright 2017-2020 @polkadot/app-society authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { SocietyVote } from '@polkadot/types/interfaces';

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
