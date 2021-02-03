// Copyright 2017-2021 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useEffect, useState } from 'react';

import { ApiPromise } from '@polkadot/api';
import { KULUPU_GENESIS, KUSAMA_GENESIS, POLKADOT_GENESIS } from '@polkadot/apps-config';

import { useApi } from './useApi';
import { useMembers } from './useMembers';

export type ThresholdApi = {
  proposalThreshold: number;
  treasuryProposalThreshold: number;
  treasuryRejectionThreshold: number;
  slashProposalThreshold: number;
}

const PROPOSE_THRESHOLDS: Record<string, number> = {
  [KULUPU_GENESIS]: 1,
  [KUSAMA_GENESIS]: 0.5,
  [POLKADOT_GENESIS]: 0.6,
  default: 0.5
};

const REJECT_THRESHOLDS: Record<string, number> = {
  [KULUPU_GENESIS]: 0.5,
  [KUSAMA_GENESIS]: 0.5,
  [POLKADOT_GENESIS]: 0.5,
  default: 0.5
};

const SLASH_THRESHOLDS: Record<string, number> = {
  [KUSAMA_GENESIS]: 0.5,
  [POLKADOT_GENESIS]: 0.75,
  default: 0.5
};

const TREASURY_THRESHOLDS: Record<string, number> = {
  [KULUPU_GENESIS]: 0.5,
  [KUSAMA_GENESIS]: 0.6,
  [POLKADOT_GENESIS]: 0.6,
  default: 0.6
};

function getProposalThreshold (api: ApiPromise): number {
  return PROPOSE_THRESHOLDS[api.genesisHash.toHex()] || PROPOSE_THRESHOLDS.default;
}

function getSlashProposalThreshold (api: ApiPromise): number {
  return SLASH_THRESHOLDS[api.genesisHash.toHex()] || SLASH_THRESHOLDS.default;
}

function getTreasuryProposalThreshold (api: ApiPromise): number {
  return TREASURY_THRESHOLDS[api.genesisHash.toHex()] || TREASURY_THRESHOLDS.default;
}

function getTreasuryRejectionThreshold (api: ApiPromise): number {
  return REJECT_THRESHOLDS[api.genesisHash.toHex()] || REJECT_THRESHOLDS.default;
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
