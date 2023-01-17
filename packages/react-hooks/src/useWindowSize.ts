// Copyright 2017-2023 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { WindowSize } from './ctx/types';

import { useContext, useRef } from 'react';

import { WindowSizeCtx } from './ctx/WindowSize';
import { createNamedHook } from './createNamedHook';

function useWindowSizeImpl (isActive = true): WindowSize {
  const windowSize = useContext(WindowSizeCtx);
  const staticRef = useRef(windowSize);

  return isActive
    ? windowSize
    : staticRef.current;
}

export const useWindowSize = createNamedHook('useWindowSize', useWindowSizeImpl);
