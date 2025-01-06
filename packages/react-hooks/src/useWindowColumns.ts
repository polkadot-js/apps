// Copyright 2017-2025 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { createNamedHook } from './createNamedHook.js';
import { useDebounce } from './useDebounce.js';
import { useWindowSize } from './useWindowSize.js';

type NumColumns = 1 | 2 | 3;

// we don't have this anywhere
const SIZE_COL_3 = 1500;
// this aligns with Columar
const SIZE_COL_2 = 1050;

// TODO For 2 vs 3 column we may want different breakpoints
// (as set this basically aligns with Columar with an additional
// 3-column variant added for larger screens- as per above)
function useWindowColumnsImpl (maxColumns: NumColumns = 3): NumColumns {
  const windowSize = useWindowSize();

  return useDebounce(
    maxColumns >= 3 && windowSize.width >= SIZE_COL_3
      ? 3
      : maxColumns >= 2 && windowSize.width >= SIZE_COL_2
        ? 2
        : 1
  );
}

export const useWindowColumns = createNamedHook('useWindowColumns', useWindowColumnsImpl);
