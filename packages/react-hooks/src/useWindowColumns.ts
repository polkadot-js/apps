// Copyright 2017-2023 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { createNamedHook } from './createNamedHook';
import { useWindowSize } from './useWindowSize';

// we don't have this anywhere
const SIZE_COL_3 = 1500;
// this aligns with Columar
const SIZE_COL_2 = 1050;

function useWindowColumnsImpl (maxColumns: 1 | 2 | 3 = 3): number {
  const windowSize = useWindowSize();

  return maxColumns >= 3 && windowSize.width >= SIZE_COL_3
    ? 3
    : maxColumns >= 2 && windowSize.width >= SIZE_COL_2
      ? 2
      : 1;
}

export const useWindowColumns = createNamedHook('useWindowColumns', useWindowColumnsImpl);
