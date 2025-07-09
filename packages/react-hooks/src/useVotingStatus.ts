// Copyright 2017-2025 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { BlockNumber, Votes } from '@polkadot/types/interfaces';
import type { BN } from '@polkadot/util';
import type { CollectiveType } from './types.js';

import { useMemo } from 'react';

import { isFunction } from '@polkadot/util';

import { createNamedHook } from './createNamedHook.js';
import { useApi } from './useApi.js';
import { useBestNumber } from './useBestNumber.js';

interface State {
  hasFailed: boolean;
  hasPassed: boolean;
  isCloseable: boolean;
  isVoteable: boolean;
  remainingBlocks: BN | null;
}

const DEFAULT_STATUS = { hasFailed: false, hasPassed: false, isCloseable: false, isVoteable: false, remainingBlocks: null };

function getStatus (api: ApiPromise, bestNumber: BlockNumber, votes: Votes, numMembers: number, section: CollectiveType): State {
  const [instance] = api.registry.getModuleInstances(api.runtimeVersion.specName.toString(), section) || [section];
  const modLocation = isFunction(api.tx[instance as 'technicalCommittee']?.close)
    ? instance
    : null;

  if (!votes.end || !modLocation) {
    return {
      hasFailed: false,
      hasPassed: false,
      isCloseable: false,
      isVoteable: true,
      remainingBlocks: null
    };
  }

  const isEnd = bestNumber.gte(votes.end);
  // let approved = yes_votes >= voting.threshold;
  const hasPassed = votes.threshold.lten(votes.ayes.length);
  // let disapproved = seats.saturating_sub(no_votes) < voting.threshold;
  const hasFailed = votes.threshold.gtn(Math.abs(numMembers - votes.nays.length));

  return {
    hasFailed,
    hasPassed,
    isCloseable: api.tx[modLocation].close.meta.args.length === 4 // current-generation
      ? isEnd || hasPassed || hasFailed
      : isEnd,
    isVoteable: !isEnd,
    remainingBlocks: isEnd
      ? null
      : votes.end.sub(bestNumber)
  };
}

function useVotingStatusImpl (votes: Votes | null | undefined, numMembers: number, section: CollectiveType): State {
  const { api } = useApi();
  const bestNumber = useBestNumber();

  return useMemo(
    () => bestNumber && votes
      ? getStatus(api, bestNumber, votes, numMembers, section)
      : DEFAULT_STATUS,
    [api, bestNumber, numMembers, section, votes]
  );
}

export const useVotingStatus = createNamedHook('useVotingStatus', useVotingStatusImpl);
