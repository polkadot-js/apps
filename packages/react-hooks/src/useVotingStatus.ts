// Copyright 2017-2020 @polkadot/react-hooks authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BlockNumber, Votes } from '@polkadot/types/interfaces';

import BN from 'bn.js';
import { useEffect, useState } from 'react';
import { ApiPromise } from '@polkadot/api';

import useApi from './useApi';
import useCall from './useCall';

interface State {
  hasFailed: boolean;
  hasPassed: boolean;
  isCloseable: boolean;
  isVoteable: boolean;
  remainingBlocks: BN | null;
}

function getStatus (api: ApiPromise, bestNumber: BlockNumber, votes: Votes, numMembers: number, section: 'council' | 'technicalCommittee'): State {
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
    isCloseable: api.tx[section].close?.meta.args.length === 4 // current-generation
      ? isEnd || hasPassed || hasFailed
      : isEnd,
    isVoteable: !isEnd,
    remainingBlocks: isEnd
      ? null
      : votes.end.sub(bestNumber)
  };
}

export default function useVotingStatus (votes: Votes | null | undefined, numMembers: number, section: 'council' | 'technicalCommittee'): State {
  const { api } = useApi();
  const bestNumber = useCall<BlockNumber>(api.derive.chain.bestNumber, []);
  const [state, setState] = useState<State>({ hasFailed: false, hasPassed: false, isCloseable: false, isVoteable: false, remainingBlocks: null });

  useEffect((): void => {
    bestNumber && votes && setState(
      getStatus(api, bestNumber, votes, numMembers, section)
    );
  }, [api, bestNumber, numMembers, section, votes]);

  return state;
}
