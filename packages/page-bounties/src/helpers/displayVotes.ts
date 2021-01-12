// Copyright 2017-2021 @polkadot/app-bounties authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { TFunction } from 'i18next';
import type { DeriveCollectiveProposal } from '@polkadot/api-derive/types';
import type { BountyStatus } from '@polkadot/types/interfaces';

type bountyVotingStatus = 'Active' | 'Approved' | 'CuratorProposed' | 'Funded' | 'PendingPayout' | 'Proposed';
type bountyVotingStatuses = { [status in bountyVotingStatus]: string[] };

const validProposalNames: bountyVotingStatuses = {
  Active: ['closeBounty', 'unassignCurator'],
  Approved: [],
  CuratorProposed: ['unassignCurator'],
  Funded: ['proposeCurator'],
  PendingPayout: ['closeBounty'],
  Proposed: ['approveBounty', 'closeBounty']
};

function votingDescription (proposalName: string, t: TFunction): string {
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
      return '';
  }
}

function getValidProposalName (bountyProposals: DeriveCollectiveProposal[], status: BountyStatus): string | undefined {
  return validProposalNames[status.type as bountyVotingStatus].find((validProposalName) => {
    return bountyProposals.find(({ proposal }) => proposal.method === validProposalName);
  });
}

export function getProposal (bountyProposals: DeriveCollectiveProposal[], status: BountyStatus): DeriveCollectiveProposal | undefined {
  const proposalName = getValidProposalName(bountyProposals, status);

  return proposalName ? bountyProposals.find(({ proposal }) => proposal.method === proposalName) : undefined;
}

export function getVotingDescription (proposals: DeriveCollectiveProposal[], status: BountyStatus, t: TFunction): string | null {
  const proposalName = getValidProposalName(proposals, status);

  return proposalName ? votingDescription(proposalName, t) : null;
}
