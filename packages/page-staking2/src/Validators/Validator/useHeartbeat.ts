// Copyright 2017-2023 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Option, u32 } from '@polkadot/types';
import type { Codec } from '@polkadot/types/types';
import type { SessionInfo, Validator } from '../../types';
import type { UseHeartbeat } from '../types';

import { useEffect, useMemo } from 'react';

import { createNamedHook, useApi, useCall } from '@polkadot/react-hooks';

type Cache = Record<string, UseHeartbeat>;

const EMPTY: UseHeartbeat = { isOnline: false };

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
    () => currentSession && ({
      authoredBlocks: [currentSession, stashId],
      receivedHeartbeats: [currentSession, stashIndex]
    }),
    [currentSession, stashId, stashIndex]
  );

  const authoredBlocks = useCall(params && api.query.imOnline.authoredBlocks, params?.authoredBlocks, OPT_BLOCKS);
  const receivedHeartbeats = useCall(params && api.query.imOnline.receivedHeartbeats, params?.receivedHeartbeats, OPT_BEATS);

  const result = useMemo(
    () => authoredBlocks && receivedHeartbeats && ({
      authoredBlocks,
      isOnline: !!(authoredBlocks || receivedHeartbeats)
    }),
    [authoredBlocks, receivedHeartbeats]
  );

  useEffect((): void => {
    if (result) {
      cache[stashId] = result;
    }
  }, [result, stashId]);

  return result || cache[stashId] || EMPTY;
}

export default createNamedHook('useHeartbeat', useHeartbeatImpl);
