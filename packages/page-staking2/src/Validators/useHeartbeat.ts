// Copyright 2017-2023 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Option, u32 } from '@polkadot/types';
import type { Codec } from '@polkadot/types/types';
import type { BN } from '@polkadot/util';
import type { SessionInfo, Validator } from '../types';
import type { UseHeartbeat } from './types';

import { useEffect, useMemo } from 'react';

import { createNamedHook, useApi, useCall } from '@polkadot/react-hooks';
import { isBoolean, isNumber, objectSpread } from '@polkadot/util';

interface CacheEntry extends UseHeartbeat {
  currentSession: BN;
}

type Cache = Record<string, CacheEntry>;

const EMPTY: UseHeartbeat = {};

const OPT_BLOCKS = {
  transform: (authoredBlocks: u32): number =>
    authoredBlocks.toNumber()
};

const OPT_BEATS = {
  // Option<WrapperOpaque<PalletImOnlineBoundedOpaqueNetworkState>>
  transform: (receivedHeartbeats: Option<Codec>): boolean =>
    receivedHeartbeats.isSome
};

const cache: Cache = {};

function useHeartbeatImpl ({ stashId, stashIndex }: Validator, { currentSession }: SessionInfo): UseHeartbeat {
  const { api } = useApi();

  const params = useMemo(
    () => stashIndex === -1
      ? undefined
      : currentSession && ({
        authoredBlocks: [currentSession, stashId],
        receivedHeartbeats: [currentSession, stashIndex]
      }),
    [currentSession, stashId, stashIndex]
  );

  const authoredBlocks = useCall(params && api.query.imOnline.authoredBlocks, params?.authoredBlocks, OPT_BLOCKS);
  const receivedHeartbeats = useCall(params && api.query.imOnline.receivedHeartbeats, params?.receivedHeartbeats, OPT_BEATS);

  const result = useMemo(
    () => isNumber(authoredBlocks) && isBoolean(receivedHeartbeats) && ({
      authoredBlocks,
      isOnline: !!(authoredBlocks || receivedHeartbeats)
    }),
    [authoredBlocks, receivedHeartbeats]
  );

  // when the session changes, empty the cache
  useEffect((): void => {
    if (currentSession && (!cache[stashId] || !currentSession.eq(cache[stashId].currentSession))) {
      cache[stashId] = { currentSession };
    }
  }, [currentSession, stashId]);

  // set the new heartbeat info based on retrieved
  useEffect((): void => {
    if (result && currentSession && currentSession.eq(cache[stashId].currentSession)) {
      cache[stashId] = objectSpread<CacheEntry>({ currentSession }, result);
    }
  }, [currentSession, result, stashId]);

  return result || cache[stashId] || EMPTY;
}

export default createNamedHook('useHeartbeat', useHeartbeatImpl);
