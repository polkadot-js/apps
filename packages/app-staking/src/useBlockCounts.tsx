// Copyright 2017-2019 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { SessionIndex } from '@polkadot/types/interfaces';
import { SessionRewards } from './types';

import { useEffect, useState } from 'react';
import { useApi, useCall, useIsMountedRef } from '@polkadot/react-hooks';
import { u32 } from '@polkadot/types';

export default function useBlockCounts (accountId: string, sessionRewards: SessionRewards[]): u32[] {
  const { api } = useApi();
  const mounted = useIsMountedRef();
  const [counts, setCounts] = useState<u32[]>([]);
  const [historic, setHistoric] = useState<u32[]>([]);
  const sessionIndex = useCall<SessionIndex>(api.query.session.currentIndex, []);
  const current = useCall<u32>(api.query.imOnline?.authoredBlocks, [sessionIndex, accountId]);

  useEffect((): void => {
    if (api.query.imOnline?.authoredBlocks && sessionRewards?.length) {
      const filtered = sessionRewards.filter(({ sessionIndex }): boolean => sessionIndex.gtn(0));

      if (filtered.length) {
        Promise
          .all(filtered.map(({ parentHash, sessionIndex }): Promise<u32> =>
            api.query.imOnline.authoredBlocks.at(parentHash, sessionIndex.subn(1), accountId) as Promise<u32>
          ))
          .then((historic): void => {
            mounted.current && setHistoric(historic);
          });
      }
    }
  }, [accountId, sessionRewards]);

  useEffect((): void => {
    setCounts([...historic, current || api.createType('u32')].slice(1));
  }, [current, historic]);

  return counts;
}
