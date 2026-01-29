// Copyright 2017-2025 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveSessionIndexes } from '@polkadot/api-derive/types';
import type { u32 } from '@polkadot/types';
import type { SessionRewards } from '../types.js';

import { useEffect, useState } from 'react';

import { createNamedHook, useApi, useCall, useIsMountedRef } from '@polkadot/react-hooks';
import { BN_ONE, BN_ZERO, isFunction } from '@polkadot/util';

function useBlockCountsImpl (accountId: string, sessionRewards: SessionRewards[]): u32[] {
  const { api } = useApi();
  const mountedRef = useIsMountedRef();
  const indexes = useCall<DeriveSessionIndexes>(api.derive.session?.indexes);
  const current = useCall<u32>(api.query.imOnline?.authoredBlocks, [indexes?.currentIndex, accountId]);
  const [counts, setCounts] = useState<u32[]>([]);
  const [historic, setHistoric] = useState<u32[]>([]);

  useEffect((): void => {
    if (isFunction(api.query.imOnline?.authoredBlocks) && sessionRewards?.length) {
      const filtered = sessionRewards.filter(({ sessionIndex }): boolean => sessionIndex.gt(BN_ZERO));

      if (filtered.length) {
        Promise
          .all(filtered.map(({ parentHash, sessionIndex }): Promise<u32> =>
            // eslint-disable-next-line deprecation/deprecation
            api.query.imOnline.authoredBlocks.at(parentHash, sessionIndex.sub(BN_ONE), accountId)
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

export default createNamedHook('useBlockCounts', useBlockCountsImpl);
