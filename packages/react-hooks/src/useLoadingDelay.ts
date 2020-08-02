// Copyright 2017-2020 @polkadot/react-hooks authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

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
