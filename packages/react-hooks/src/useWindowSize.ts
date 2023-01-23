// Copyright 2017-2023 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { WindowSize } from './ctx/types';

import { useContext } from 'react';

import { WindowSizeCtx } from './ctx/WindowSize';
import { createNamedHook } from './createNamedHook';

function useWindowSizeImpl (): WindowSize {
  return useContext(WindowSizeCtx);
}

export const useWindowSize = createNamedHook('useWindowSize', useWindowSizeImpl);
