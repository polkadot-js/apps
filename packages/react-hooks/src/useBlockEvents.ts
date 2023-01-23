// Copyright 2017-2023 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BlockEvents } from './ctx/types';

import { useContext } from 'react';

import { BlockEventsCtx } from './ctx/BlockEvents';
import { createNamedHook } from './createNamedHook';

function useBlockEventsImpl (): BlockEvents {
  return useContext(BlockEventsCtx);
}

export const useBlockEvents = createNamedHook('useBlockEvents', useBlockEventsImpl);
