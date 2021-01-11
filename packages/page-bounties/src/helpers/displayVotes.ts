// Copyright 2017-2021 @polkadot/app-bounties authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveCollectiveProposal } from '@polkadot/api-derive/types';
import type { BountyStatus } from '@polkadot/types/interfaces';

interface Props {
  status: BountyStatus;
  proposals: DeriveCollectiveProposal[];
}

interface BountyStatesToDisplayVoting {
  Funded: string;
  Proposed: string;
}

const happyPathProposalNames: BountyStatesToDisplayVoting = {
  Funded: 'proposeCurator',
  Proposed: 'approveBounty'
};

const votingDescriptions: BountyStatesToDisplayVoting = {
  Funded: 'Curator under voting',
  Proposed: 'Approval under voting'
};

function getProposal ({ proposals, status }: Props): DeriveCollectiveProposal | undefined {
  return proposals.find(({ proposal }) => proposal.method === happyPathProposalNames[status.type as keyof BountyStatesToDisplayVoting]);
}

export function getVotingDescription ({ proposals, status }: Props): string | null {
  return getProposal({ proposals, status }) ? votingDescriptions[status.type as keyof BountyStatesToDisplayVoting] : null;
}
