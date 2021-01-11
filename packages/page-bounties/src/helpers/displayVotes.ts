// Copyright 2017-2021 @polkadot/app-bounties authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { TFunction } from 'i18next';
import type { DeriveCollectiveProposal } from '@polkadot/api-derive/types';
import type { BountyStatus } from '@polkadot/types/interfaces';

function votingDescriptions (bountyStatus: BountyStatus, t: TFunction): string[] {
  switch (bountyStatus.type) {
    case ('Proposed'): {
      return [t('Approval under voting'), t('Rejection under voting')];
    }

    case ('Funded'): {
      return [t('Curator under voting')];
    }

    case ('CuratorProposed'): {
      return [t('Unassign curator under voting')];
    }

    case ('Active'): {
      return [t('Unassign curator under voting'), t('Cancel bounty under voting')];
    }

    case ('PendingPayout'): {
      return [t('Cancel bounty under voting')];
    }

    default: {
      return [];
    }
  }
}

export function getProposal (proposals: DeriveCollectiveProposal[], status: BountyStatus): DeriveCollectiveProposal | null {
  return proposals.length === 1 ? proposals[0] : null;
}

export function getVotingDescription (proposals: DeriveCollectiveProposal[], status: BountyStatus, t: TFunction): string | null {
  return getProposal(proposals, status) ? votingDescriptions(status, t)[0] : null;
}
