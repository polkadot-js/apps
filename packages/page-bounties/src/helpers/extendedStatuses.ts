// Copyright 2017-2021 @polkadot/app-bounties authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveCollectiveProposal } from '@polkadot/api-derive/types';
import type { BountyStatus } from '@polkadot/types/interfaces';

import { BountyVotingStatuses, StatusName } from '../types';

const validProposalNames: BountyVotingStatuses = {
  Active: ['closeBounty', 'unassignCurator'],
  Approved: [],
  CuratorProposed: ['closeBounty', 'unassignCurator'],
  Funded: ['proposeCurator', 'closeBounty'],
  PendingPayout: ['unassignCurator'],
  Proposed: ['approveBounty', 'closeBounty']
};

function validMethods (status: BountyStatus): string[] {
  return validProposalNames[status.type as StatusName];
}

function getProposalByMethod (bountyProposals: DeriveCollectiveProposal[], method: string | undefined): DeriveCollectiveProposal | undefined {
  return bountyProposals.find(({ proposal }) => proposal.method === method);
}

function bestValidProposalName (bountyProposals: DeriveCollectiveProposal[], status: BountyStatus): string | undefined {
  const methods = bountyProposals.map(({ proposal }) => proposal.method);

  return validMethods(status).find((method) => methods.includes(method));
}

export function proposalNameToDisplay (bountyProposal: DeriveCollectiveProposal, status: BountyStatus): string | undefined {
  if (bountyProposal.proposal.method !== 'unassignCurator') { return bountyProposal.proposal.method; }

  return status.isCuratorProposed ? 'unassignCurator' : 'slashCurator';
}

export function getProposalToDisplay (bountyProposals: DeriveCollectiveProposal[], status: BountyStatus): DeriveCollectiveProposal | null {
  const method = bestValidProposalName(bountyProposals, status);

  return getProposalByMethod(bountyProposals, method) ?? null;
}
