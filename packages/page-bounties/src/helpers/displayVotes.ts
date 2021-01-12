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

function getValidProposal (bountyProposals: DeriveCollectiveProposal[], status: BountyStatus): { index: number, proposalName: string | null} {
  let proposalIndex = -1;
  const proposalName = getValidProposalNames(status).find((validProposalName) => {
    return isValidIndex(proposalIndex = getProposalIndexByName(bountyProposals, validProposalName));
  });

  return proposalName ? { index: proposalIndex, proposalName: proposalName } : { index: -1, proposalName: null };
}

function getValidProposalNames (status: BountyStatus) {
  return validProposalNames[status.type as bountyVotingStatus];
}

function getProposalIndexByName (bountyProposals: DeriveCollectiveProposal[], proposalName: string) {
  return bountyProposals.findIndex(({ proposal }) => proposal.method === proposalName);
}

function isValidIndex (index: number) {
  return index !== -1;
}

export function getProposal (bountyProposals: DeriveCollectiveProposal[], status: BountyStatus): DeriveCollectiveProposal | null {
  const { index } = getValidProposal(bountyProposals, status);

  return isValidIndex(index) ? bountyProposals[index] : null;
}

export function getVotingDescription (proposals: DeriveCollectiveProposal[], status: BountyStatus, t: TFunction): string | null {
  const { proposalName } = getValidProposal(proposals, status);

  return proposalName ? votingDescription(proposalName, t) : null;
}
