// Copyright 2017-2020 @polkadot/react-hooks authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { useCallback, useState } from 'react';
import useIsMountedRef from './useIsMountedRef';

export default function useIncrement (defaultValue = 1): [number, () => void, (value: number) => void] {
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
