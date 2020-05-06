// Copyright 2017-2020 @polkadot/react-hooks authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { useCallback, useState } from 'react';

export default function useIncrement (defaultValue = 1): [number, () => void, (value: number) => void] {
  const [value, setValue] = useState(defaultValue);
  const increment = useCallback(
    (): void => setValue((value: number) => ++value),
    []
  );

  return [value, increment, setValue];
}
