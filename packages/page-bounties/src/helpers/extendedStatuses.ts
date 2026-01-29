// Copyright 2017-2025 @polkadot/app-bounties authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveCollectiveProposal } from '@polkadot/api-derive/types';
import type { PalletBountiesBountyStatus } from '@polkadot/types/lookup';
import type { BountyVotingStatuses, StatusName } from '../types.js';

const validProposalNames: BountyVotingStatuses = {
  Active: ['closeBounty', 'unassignCurator'],
  Approved: [],
  CuratorProposed: ['closeBounty', 'unassignCurator'],
  Funded: ['proposeCurator', 'closeBounty'],
  PendingPayout: ['unassignCurator'],
  Proposed: ['approveBounty', 'closeBounty']
};

function validMethods (status: PalletBountiesBountyStatus): string[] {
  return validProposalNames[status.type as StatusName];
}

function getProposalByMethod (bountyProposals: DeriveCollectiveProposal[], method: string | undefined): DeriveCollectiveProposal | undefined {
  return bountyProposals.find(({ proposal }) => proposal && proposal.method === method);
}

function bestValidProposalName (bountyProposals: DeriveCollectiveProposal[], status: PalletBountiesBountyStatus): string | undefined {
  const methods = bountyProposals.map(({ proposal }) => proposal?.method);

  return validMethods(status).find((method) => methods.includes(method));
}

export function proposalNameToDisplay (bountyProposal: DeriveCollectiveProposal, status: PalletBountiesBountyStatus): string | undefined {
  if (bountyProposal.proposal && bountyProposal.proposal.method !== 'unassignCurator') {
    return bountyProposal.proposal.method;
  }

  return status.isCuratorProposed ? 'unassignCurator' : 'slashCurator';
}

export function getProposalToDisplay (bountyProposals: DeriveCollectiveProposal[], status: PalletBountiesBountyStatus): DeriveCollectiveProposal | null {
  const method = bestValidProposalName(bountyProposals, status);

  return getProposalByMethod(bountyProposals, method) ?? null;
}
