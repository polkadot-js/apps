// Copyright 2017-2025 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Option, u32 } from '@polkadot/types';
import type { Codec } from '@polkadot/types/types';
import type { SessionInfo, Validator } from '../types.js';
import type { UseHeartbeat } from './types.js';

import { useMemo } from 'react';

import { createNamedHook, useApi, useCall } from '@polkadot/react-hooks';
import { isBoolean, isNumber } from '@polkadot/util';

import { useCacheMap } from '../useCache.js';

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

  return useCacheMap('useHeartbeat', stashId, result) || EMPTY;
}

export default createNamedHook('useHeartbeat', useHeartbeatImpl);
