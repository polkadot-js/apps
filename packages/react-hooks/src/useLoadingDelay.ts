// Copyright 2017-2022 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useEffect, useState } from 'react';

import { createNamedHook } from './createNamedHook';
import { useIsMountedRef } from './useIsMountedRef';

function useLoadingDelayImpl (delay = 100): boolean {
  const mountedRef = useIsMountedRef();
  const [isLoading, setIsLoading] = useState(true);

  useEffect((): void => {
    setTimeout((): void => {
      mountedRef.current && setIsLoading(false);
    }, delay);
  // Ignore, this is for the initial setup
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return isLoading;
}

export const useLoadingDelay = createNamedHook('useLoadingDelay', useLoadingDelayImpl);
