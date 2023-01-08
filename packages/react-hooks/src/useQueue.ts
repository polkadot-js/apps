// Copyright 2017-2023 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { QueueProps } from '@polkadot/react-components/Status/types';

import { useContext } from 'react';

import { QueueContext } from './ctx/Queue';
import { createNamedHook } from './createNamedHook';

function useQueueImpl (): QueueProps {
  return useContext(QueueContext);
}

export const useQueue = createNamedHook('useQueue', useQueueImpl);
