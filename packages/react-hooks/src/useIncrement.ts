// Copyright 2017-2025 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useCallback, useState } from 'react';

import { createNamedHook } from './createNamedHook.js';
import { useIsMountedRef } from './useIsMountedRef.js';

function useIncrementImpl (defaultValue = 1): [number, () => void, (value: number) => void] {
  const mountedRef = useIsMountedRef();
  const [value, setValue] = useState(defaultValue);

  const increment = useCallback(
    (): void => {
      mountedRef.current && setValue((value: number) => ++value);
    },
    [mountedRef]
  );

  return [value, increment, setValue];
}

export const useIncrement = createNamedHook('useIncrement', useIncrementImpl);
