// Copyright 2017-2023 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useMemo } from 'react';

import { createNamedHook } from './createNamedHook';
import { useWindowSize } from './useWindowSize';

function useWindowColumnsImpl (maxColumns: 0 | 1 | 2 | 3 = 3, isActive = true): number {
  const windowSize = useWindowSize(isActive);

  return useMemo(
    () => isActive
      ? windowSize.width >= 1500
        ? Math.min(3, maxColumns)
        : windowSize.width >= 1050
          ? Math.min(maxColumns, 2)
          : 1
      : 1,
    [isActive, maxColumns, windowSize]
  );
}

export const useWindowColumns = createNamedHook('useWindowColumns', useWindowColumnsImpl);
