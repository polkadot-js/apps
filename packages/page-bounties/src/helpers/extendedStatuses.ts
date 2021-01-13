// Copyright 2017-2021 @polkadot/app-bounties authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { TFunction } from 'i18next';
import type { DeriveCollectiveProposal } from '@polkadot/api-derive/types';
import type { BountyStatus } from '@polkadot/types/interfaces';

type BountyVotingStatus = 'Active' | 'Approved' | 'CuratorProposed' | 'Funded' | 'PendingPayout' | 'Proposed';
type BountyVotingStatuses = { [status in BountyVotingStatus]: string[] };

const validProposalNames: BountyVotingStatuses = {
  Active: ['closeBounty', 'unassignCurator'],
  Approved: [],
  CuratorProposed: ['unassignCurator'],
  Funded: ['proposeCurator'],
  PendingPayout: ['closeBounty'],
  Proposed: ['approveBounty', 'closeBounty']
};

function votingDescription (proposalName: string | undefined, t: TFunction): string | null {
  switch (proposalName) {
    case ('approveBounty'):
      return t('Approval under voting');
    case ('closeBounty'):
      return t('Rejection under voting');
    case ('proposeCurator'):
      return t('Curator under voting');
    case ('unassignCurator'):
      return t('Unassign curator under voting');
    default:
      return null;
  }
}

function bestValidMethod (bountyProposals: DeriveCollectiveProposal[], status: BountyStatus) {
  const methods = bountyProposals.map(({ proposal }) => proposal.method);

  return validMethods(status).find((method) => methods.includes(method));
}

function validMethods (status: BountyStatus) {
  return validProposalNames[status.type as BountyVotingStatus];
}

function getProposalByMethod (bountyProposals: DeriveCollectiveProposal[], method: string | undefined) {
  return bountyProposals.find(({ proposal }) => proposal.method === method);
}

export function getProposalToDisplay (bountyProposals: DeriveCollectiveProposal[], status: BountyStatus): DeriveCollectiveProposal | null {
  const method = bestValidMethod(bountyProposals, status);

  return getProposalByMethod(bountyProposals, method) ?? null;
}

export function getVotingDescription (proposals: DeriveCollectiveProposal[], status: BountyStatus, t: TFunction): string | null {
  const method = bestValidMethod(proposals, status);

  return votingDescription(method, t);
}
