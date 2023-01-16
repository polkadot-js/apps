// Copyright 2017-2023 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Option, u32 } from '@polkadot/types';
import type { Codec } from '@polkadot/types/types';
import type { BN } from '@polkadot/util';

import { useMemo } from 'react';

import { createNamedHook, useApi, useCall } from '@polkadot/react-hooks';

interface Result {
  authoredBlocks?: number;
  isOnline: boolean;
}

const OPT_BLOCKS = {
  transform: (authoredBlocks: u32): number =>
    authoredBlocks.toNumber()
};

const OPT_BEATS = {
  // Option<WrapperOpaque<PalletImOnlineBoundedOpaqueNetworkState>>
  transform: (receivedHeartbeats: Option<Codec>): boolean =>
    receivedHeartbeats.isSome
};

function useHeartbeatImpl (stashId: string, stashIndex: number, activeSession: BN | null): Result {
  const { api } = useApi();

  const params = useMemo(
    () => activeSession && ({
      authoredBlocks: [activeSession, stashId],
      receivedHeartbeats: [activeSession, stashIndex]
    }),
    [activeSession, stashId, stashIndex]
  );

  const authoredBlocks = useCall(params && api.query.imOnline.authoredBlocks, params?.authoredBlocks, OPT_BLOCKS);
  const receivedHeartbeats = useCall(params && api.query.imOnline.receivedHeartbeats, params?.receivedHeartbeats, OPT_BEATS);

  return useMemo(
    () => ({
      authoredBlocks,
      isOnline: !!(authoredBlocks || receivedHeartbeats)
    }),
    [authoredBlocks, receivedHeartbeats]
  );
}

export default createNamedHook('useHeartbeat', useHeartbeatImpl);
