// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DeriveSessionIndexes } from '@polkadot/api-derive/types';
import { SessionRewards } from '../types';

import { useEffect, useState } from 'react';
import { useApi, useCall, useIsMountedRef } from '@polkadot/react-hooks';
import { u32 } from '@polkadot/types';
import { isFunction } from '@polkadot/util';

export default function useBlockCounts (accountId: string, sessionRewards: SessionRewards[]): u32[] {
  const { api } = useApi();
  const mountedRef = useIsMountedRef();
  const indexes = useCall<DeriveSessionIndexes>(api.derive.session?.indexes, []);
  const current = useCall<u32>(api.query.imOnline?.authoredBlocks, [indexes?.currentIndex, accountId]);
  const [counts, setCounts] = useState<u32[]>([]);
  const [historic, setHistoric] = useState<u32[]>([]);

  useEffect((): void => {
    if (isFunction(api.query.imOnline?.authoredBlocks) && sessionRewards && sessionRewards.length) {
      const filtered = sessionRewards.filter(({ sessionIndex }): boolean => sessionIndex.gtn(0));

      if (filtered.length) {
        Promise
          .all(filtered.map(({ parentHash, sessionIndex }): Promise<u32> =>
            api.query.imOnline.authoredBlocks.at(parentHash, sessionIndex.subn(1), accountId)
          ))
          .then((historic): void => {
            mountedRef.current && setHistoric(historic);
          }).catch(console.error);
      }
    }
  }, [accountId, api, mountedRef, sessionRewards]);

  useEffect((): void => {
    setCounts([...historic, current || api.createType('u32')].slice(1));
  }, [api, current, historic]);

  return counts;
}
