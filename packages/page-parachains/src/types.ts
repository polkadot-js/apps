// Copyright 2017-2021 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ParachainProposal, ParaId, ParaInfo, SessionIndex } from '@polkadot/types/interfaces';

export interface ProposalExt {
  id: ParaId;
  isApproved: boolean;
  isScheduled: boolean;
  proposal?: ParachainProposal;
}

export interface ScheduledProposals {
  scheduledIds: ParaId[];
  sessionIndex: SessionIndex;
}

export interface Proposals {
  approvedIds: ParaId[];
  proposalIds: ParaId[];
  scheduled: ScheduledProposals[];
}

export interface OwnedId {
  manager: string;
  paraId: ParaId;
  paraInfo: ParaInfo;
}

export interface OwnerInfo {
  accountId: string | null;
  paraId: number;
}
