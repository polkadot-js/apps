// Copyright 2017-2019 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { useState, useEffect } from 'react';

// Debounces inputs
export default function useDebounce <T> (value: T, delay = 250): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect((): () => void => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // each time it renders, it clears
    return (): void => {
      clearTimeout(handler);
    };
  }, [value]);

  return debouncedValue;
}
