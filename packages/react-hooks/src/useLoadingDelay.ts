// Copyright 2017-2020 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useEffect, useState } from 'react';
import useIsMountedRef from './useIsMountedRef';

export default function useLoadingDelay (delay = 100): boolean {
  const mountedRef = useIsMountedRef();
  const [isLoading, setIsLoading] = useState(true);

  useEffect((): void => {
    setTimeout((): void => {
      mountedRef.current && setIsLoading(false);
    }, delay);
  });

  return isLoading;
}
