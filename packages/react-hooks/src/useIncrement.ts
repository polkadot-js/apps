// Copyright 2017-2022 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useCallback, useState } from 'react';

import { createNamedHook } from './createNamedHook';
import { useIsMountedRef } from './useIsMountedRef';

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
