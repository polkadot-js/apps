// Copyright 2017-2023 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BlockEvents } from './ctx/types';

import { useContext } from 'react';

import { BlockEventsContext } from './ctx/BlockEvents';
import { createNamedHook } from './createNamedHook';

function useBlockEventsImpl (): BlockEvents {
  return useContext(BlockEventsContext);
}

export const useBlockEvents = createNamedHook('useBlockEvents', useBlockEventsImpl);
