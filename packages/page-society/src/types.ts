// Copyright 2017-2020 @polkadot/app-society authors & contributors
// SPDX-License-Identifier: Apache-2.0

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
