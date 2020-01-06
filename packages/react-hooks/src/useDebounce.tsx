// Copyright 2017-2020 @polkadot/react-hooks authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { useState, useEffect } from 'react';

import useIsMountedRef from './useIsMountedRef';

// Debounces inputs
export default function useDebounce <T> (value: T, delay = 250): T {
  const mounted = useIsMountedRef();
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect((): () => void => {
    const handler = setTimeout(() => {
      mounted.current && setDebouncedValue(value);
    }, delay);

    // each time it renders, it clears
    return (): void => {
      clearTimeout(handler);
    };
  }, [value]);

  return debouncedValue;
}
