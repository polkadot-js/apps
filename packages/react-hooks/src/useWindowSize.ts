// Copyright 2017-2025 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { WindowSize } from './ctx/types.js';

import { useContext } from 'react';

import { WindowSizeCtx } from './ctx/WindowSize.js';
import { createNamedHook } from './createNamedHook.js';

function useWindowSizeImpl (): WindowSize {
  return useContext(WindowSizeCtx);
}

export const useWindowSize = createNamedHook('useWindowSize', useWindowSizeImpl);
