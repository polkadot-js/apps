// Copyright 2017-2021 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type BN from 'bn.js';
import type { BlockNumber, Votes } from '@polkadot/types/interfaces';

import { useMemo } from 'react';

import { ApiPromise } from '@polkadot/api';
import { isFunction } from '@polkadot/util';

import { useApi } from './useApi';
import { useBestNumber } from './useBestNumber';

interface State {
  hasFailed: boolean;
  hasPassed: boolean;
  isCloseable: boolean;
  isVoteable: boolean;
  remainingBlocks: BN | null;
}

const DEFAULT_STATUS = { hasFailed: false, hasPassed: false, isCloseable: false, isVoteable: false, remainingBlocks: null };

function getStatus (api: ApiPromise, bestNumber: BlockNumber, votes: Votes, numMembers: number, section: 'council' | 'membership' | 'technicalCommittee'): State {
  if (!votes.end) {
    return {
      hasFailed: false,
      hasPassed: false,
      isCloseable: false,
      isVoteable: true,
      remainingBlocks: null
    };
  }

  const isEnd = bestNumber.gte(votes.end);
  const hasPassed = votes.threshold.lten(votes.ayes.length);
  const hasFailed = votes.threshold.gtn(Math.abs(numMembers - votes.nays.length));

  return {
    hasFailed,
    hasPassed,
    isCloseable: isFunction(api.tx[section].close)
      ? api.tx[section].close.meta.args.length === 4 // current-generation
        ? isEnd || hasPassed || hasFailed
        : isEnd
      : false,
    isVoteable: !isEnd,
    remainingBlocks: isEnd
      ? null
      : votes.end.sub(bestNumber)
  };
}

export function useVotingStatus (votes: Votes | null | undefined, numMembers: number, section: 'council' | 'membership' | 'technicalCommittee'): State {
  const { api } = useApi();
  const bestNumber = useBestNumber();

  return useMemo(
    () => bestNumber && votes
      ? getStatus(api, bestNumber, votes, numMembers, section)
      : DEFAULT_STATUS,
    [api, bestNumber, numMembers, section, votes]
  );
}
