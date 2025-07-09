// Copyright 2017-2025 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useEffect, useState } from 'react';

import { useIsMountedRef } from './useIsMountedRef.js';

const DEFAULT_DELAY = 250;

// FIXE Due to generics, cannot use createNamedHook
export function useDebounce <T> (value: T, delay = DEFAULT_DELAY): T {
  const mountedRef = useIsMountedRef();
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect((): () => void => {
    const timeoutId = setTimeout(() => {
      mountedRef.current && setDebouncedValue(value);
    }, delay);

    // each time something changes, we clears
    return (): void => {
      clearTimeout(timeoutId);
    };
  }, [delay, value, mountedRef]);

  return debouncedValue;
}
