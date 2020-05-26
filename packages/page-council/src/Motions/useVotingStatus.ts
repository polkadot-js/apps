// Copyright 2017-2020 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BlockNumber, Votes } from '@polkadot/types/interfaces';

import BN from 'bn.js';
import { useEffect, useState } from 'react';
import { ApiPromise } from '@polkadot/api';
import { useApi, useCall } from '@polkadot/react-hooks';

interface State {
  isCloseable: boolean;
  isVoteable: boolean;
  remainingBlocks: BN | null;
}

function getStatus (api: ApiPromise, bestNumber: BlockNumber, votes: Votes, numMembers: number): State {
  if (!votes.end) {
    return {
      isCloseable: false,
      isVoteable: true,
      remainingBlocks: null
    };
  }

  const isEnd = bestNumber.gte(votes.end);
  const isPassing = votes.threshold.lten(votes.ayes.length);
  const isFailing = votes.threshold.gtn(Math.abs(numMembers - votes.nays.length));

  return {
    isCloseable: api.tx.council.close.meta.args.length === 2
      ? isEnd
      : isEnd || isPassing || isFailing,
    isVoteable: !isEnd,
    remainingBlocks: isEnd
      ? null
      : votes.end.sub(bestNumber)
  };
}

export default function useVotingStatus (votes: Votes | null, numMembers: number): State {
  const { api } = useApi();
  const bestNumber = useCall<BlockNumber>(api.derive.chain.bestNumber, []);
  const [state, setState] = useState<State>({ isCloseable: false, isVoteable: false, remainingBlocks: null });

  useEffect((): void => {
    bestNumber && votes && setState(
      getStatus(api, bestNumber, votes, numMembers)
    );
  }, [api, bestNumber, numMembers, votes]);

  return state;
}
