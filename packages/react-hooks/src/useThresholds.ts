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
    const pThreshold = getProposalThreshold(api);
    const slashThreshold = getSlashProposalThreshold(api);
    const tRejectionThreshold = getTreasuryRejectionThreshold(api);
    const tProposalThreshold = getTreasuryProposalThreshold(api);

    members && setProposalThreshold(new BN(Math.ceil(members.length * pThreshold)));
    members && setSlashProposalThreshold(new BN(Math.ceil(members.length * slashThreshold)));
    members && setTreasuryRejectionThreshold(
      Math.ceil(members.length * tRejectionThreshold) === members.length * tRejectionThreshold
        ? new BN((members.length * tRejectionThreshold) + 1)
        : new BN(Math.ceil((members.length * tRejectionThreshold)))
    );
    members && setTreasuryProposalThreshold(new BN(Math.ceil((members.length * tProposalThreshold))));
  }, [api, members]);

  return { proposalThreshold, slashProposalThreshold, treasuryProposalThreshold, treasuryRejectionThreshold };
}
