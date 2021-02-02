// Copyright 2017-2021 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';
import { useEffect, useState } from 'react';

import { getProposalThreshold,
  getSlashProposalThreshold,
  getTreasuryProposalThreshold,
  getTreasuryRejectionThreshold } from '@polkadot/apps-config';
import { useApi } from '@polkadot/react-hooks/useApi';
import { useMembers } from '@polkadot/react-hooks/useMembers';
import { BN_ZERO } from '@polkadot/util';

import { getAtLeastThresholdMembersCount,
  getMoreThanThresholdMembersCount } from '../helpers/requiredMembersThresholds';

export type ThresholdApi = {
  proposalThreshold: BN;
  treasuryProposalThreshold: BN;
  treasuryRejectionThreshold: BN;
  slashProposalThreshold: BN;
}

export function useThresholds () : ThresholdApi {
  const { api } = useApi();
  const { members } = useMembers();

  const [proposalThreshold, setProposalThreshold] = useState<BN>(BN_ZERO);
  const [slashProposalThreshold, setSlashProposalThreshold] = useState<BN>(BN_ZERO);
  const [treasuryRejectionThreshold, setTreasuryRejectionThreshold] = useState<BN>(BN_ZERO);
  const [treasuryProposalThreshold, setTreasuryProposalThreshold] = useState<BN>(BN_ZERO);

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
