// Copyright 2017-2021 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useEffect, useState } from 'react';

import { PROPOSE_THRESHOLDS, REJECT_THRESHOLDS, SLASH_THRESHOLDS, TREASURY_THRESHOLDS } from '@polkadot/apps-config';

import { useApi } from './useApi';
import { useMembers } from './useMembers';

export type ThresholdApi = {
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

export function useThresholds () : ThresholdApi {
  const { api } = useApi();
  const { members } = useMembers();

  const [proposalThreshold, setProposalThreshold] = useState<number>(0);
  const [slashProposalThreshold, setSlashProposalThreshold] = useState<number>(0);
  const [treasuryRejectionThreshold, setTreasuryRejectionThreshold] = useState<number>(0);
  const [treasuryProposalThreshold, setTreasuryProposalThreshold] = useState<number>(0);

  useEffect((): void => {
    const proposalThreshold = PROPOSE_THRESHOLDS[api.genesisHash.toHex()] || PROPOSE_THRESHOLDS.default;
    const slashProposalThreshold = SLASH_THRESHOLDS[api.genesisHash.toHex()] || SLASH_THRESHOLDS.default;
    const treasuryRejectionThreshold = REJECT_THRESHOLDS[api.genesisHash.toHex()] || REJECT_THRESHOLDS.default;
    const treasuryProposalThreshold = TREASURY_THRESHOLDS[api.genesisHash.toHex()] || TREASURY_THRESHOLDS.default;

    const membersCount = members?.length;

    if (membersCount && membersCount !== 0) {
      setProposalThreshold(getAtLeastThresholdMembersCount(membersCount, proposalThreshold));
      setSlashProposalThreshold(getAtLeastThresholdMembersCount(membersCount, slashProposalThreshold));
      setTreasuryRejectionThreshold(getMoreThanThresholdMembersCount(membersCount, treasuryRejectionThreshold));
      setTreasuryProposalThreshold(getAtLeastThresholdMembersCount(membersCount, treasuryProposalThreshold));
    }
  }, [api, members]);

  return { proposalThreshold, slashProposalThreshold, treasuryProposalThreshold, treasuryRejectionThreshold };
}
