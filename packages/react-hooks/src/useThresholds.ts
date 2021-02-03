// Copyright 2017-2021 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useEffect, useState } from 'react';

import { getProposalThreshold,
  getSlashProposalThreshold,
  getTreasuryProposalThreshold,
  getTreasuryRejectionThreshold } from '@polkadot/apps-config';

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
    const proposalThreshold = getProposalThreshold(api);
    const slashProposalThreshold = getSlashProposalThreshold(api);
    const treasuryRejectionThreshold = getTreasuryRejectionThreshold(api);
    const treasuryProposalThreshold = getTreasuryProposalThreshold(api);

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
