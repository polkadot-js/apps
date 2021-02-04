// Copyright 2017-2021 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useMemo } from 'react';

import { PROPOSE_THRESHOLDS, REJECT_THRESHOLDS, SLASH_THRESHOLDS, TREASURY_THRESHOLDS } from '@polkadot/apps-config';

import { useApi } from './useApi';
import { useMembers } from './useMembers';

export interface Thresholds {
  proposalThreshold: number;
  treasuryProposalThreshold: number;
  treasuryRejectionThreshold: number;
  slashProposalThreshold: number;
}

export function getMoreThanThresholdMembersCount (membersCount: number, thresholdRatio: number): number {
  if (membersCount === 0) { return 0; }

  return Math.floor(membersCount * thresholdRatio) + 1;
}

export function getAtLeastThresholdMembersCount (membersCount: number, thresholdRatio: number): number {
  return Math.ceil(membersCount * thresholdRatio);
}

export function useThresholds () : Thresholds {
  const { api } = useApi();
  const { members } = useMembers();

  return useMemo((): Thresholds => {
    const membersCount = members?.length;

    if (!membersCount) {
      return { proposalThreshold: 0, slashProposalThreshold: 0, treasuryProposalThreshold: 0, treasuryRejectionThreshold: 0 };
    }

    const genesisHash = api.genesisHash.toHex();

    return {
      proposalThreshold: getAtLeastThresholdMembersCount(
        membersCount,
        PROPOSE_THRESHOLDS[genesisHash] || PROPOSE_THRESHOLDS.default
      ),
      slashProposalThreshold: getAtLeastThresholdMembersCount(
        membersCount,
        SLASH_THRESHOLDS[genesisHash] || SLASH_THRESHOLDS.default
      ),
      treasuryProposalThreshold: getAtLeastThresholdMembersCount(
        membersCount,
        TREASURY_THRESHOLDS[genesisHash] || TREASURY_THRESHOLDS.default
      ),
      treasuryRejectionThreshold: getMoreThanThresholdMembersCount(
        membersCount,
        REJECT_THRESHOLDS[genesisHash] || REJECT_THRESHOLDS.default
      )
    };
  }, [api, members]);
}
