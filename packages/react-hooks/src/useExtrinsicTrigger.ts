// Copyright 2017-2022 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { SubmittableExtrinsicFunction } from '@polkadot/api/types';
import type { SignedBlockExtended } from '@polkadot/api-derive/types';

import { useEffect, useState } from 'react';

import { createNamedHook } from './createNamedHook';
import { useApi } from './useApi';
import { useCall } from './useCall';
import { useIsMountedRef } from './useIsMountedRef';

type ExtrinsicCheck = SubmittableExtrinsicFunction<'promise'> | false | undefined | null;

function useExtrinsicTriggerImpl (checks: ExtrinsicCheck[]): string {
  const { api } = useApi();
  const [trigger, setTrigger] = useState('0');
  const mountedRef = useIsMountedRef();
  const block = useCall<SignedBlockExtended>(api.derive.chain.subscribeNewBlocks);

  useEffect((): void => {
    mountedRef.current && block && block.extrinsics && block.extrinsics.filter(({ extrinsic }) =>
      extrinsic &&
      checks.some((c) => c && c.is(extrinsic))
    ).length && setTrigger(() => block.createdAtHash?.toHex() || '');
  }, [block, checks, mountedRef]);

  return trigger;
}

export const useExtrinsicTrigger = createNamedHook('useExtrinsicTrigger', useExtrinsicTriggerImpl);
