// Copyright 2017-2020 @polkadot/app-calendar authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DeriveSessionProgress } from '@polkadot/api-derive/types';
import { BlockNumber } from '@polkadot/types/interfaces';
import { EntryInfo } from './types';

import { useEffect, useState } from 'react';
import { useApi, useBlockTime, useCall } from '@polkadot/react-hooks';
import { BN_ONE } from '@polkadot/util';

function createNextEra (bestNumber: BlockNumber, blockTime: number, sessionInfo: DeriveSessionProgress): EntryInfo {
  const remaining = sessionInfo.eraLength.sub(sessionInfo.eraProgress);
  const blockNumber = bestNumber.add(remaining);

  return {
    blockNumber,
    date: new Date(Date.now() + remaining.muln(blockTime).toNumber()),
    type: 'nextEra'
  };
}

export default function useScheduled (): EntryInfo[] {
  const { api } = useApi();
  const [blockTime] = useBlockTime();
  const bestNumber = useCall<BlockNumber>(api.derive.chain.bestNumber);
  const sessionInfo = useCall<DeriveSessionProgress>(api.query.staking && api.derive.session?.progress);
  const [state, setState] = useState<EntryInfo[]>([]);

  useEffect((): void => {
    bestNumber && sessionInfo?.sessionLength.gt(BN_ONE) && setState((state) =>
      state
        .filter(({ type }) => type !== 'nextEra')
        .concat(createNextEra(bestNumber, blockTime, sessionInfo))
    );
  }, [bestNumber, blockTime, sessionInfo]);

  useEffect((): void => {
    bestNumber && setState((state) =>
      state.filter(({ blockNumber }) => bestNumber.lte(blockNumber))
    );
  }, [bestNumber]);

  return state;
}
