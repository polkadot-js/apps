// Copyright 2017-2025 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { QueueProps } from '@polkadot/react-components/Status/types';

import { useContext } from 'react';

import { QueueCtx } from './ctx/Queue.js';
import { createNamedHook } from './createNamedHook.js';

function useQueueImpl (): QueueProps {
  return useContext(QueueCtx);
}

export const useQueue = createNamedHook('useQueue', useQueueImpl);
