// Copyright 2017-2025 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BlockEvents } from './ctx/types.js';

import { useContext } from 'react';

import { BlockEventsCtx } from './ctx/BlockEvents.js';
import { createNamedHook } from './createNamedHook.js';

function useBlockEventsImpl (): BlockEvents {
  return useContext(BlockEventsCtx);
}

export const useBlockEvents = createNamedHook('useBlockEvents', useBlockEventsImpl);
