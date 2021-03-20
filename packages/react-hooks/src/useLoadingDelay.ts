// Copyright 2017-2021 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useEffect, useState } from 'react';

import { useIsMountedRef } from './useIsMountedRef';

export function useLoadingDelay (delay = 100): boolean {
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
