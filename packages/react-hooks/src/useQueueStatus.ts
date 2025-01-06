// Copyright 2017-2025 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { OnDemandQueueStatus } from './types.js';

import { useEffect, useState } from 'react';

import { createNamedHook, useApi, useCall } from '@polkadot/react-hooks';

function extractInfo (value: OnDemandQueueStatus) {
  return {
    freedIndices: value.freedIndices,
    nextIndex: value.nextIndex,
    smallestIndex: value.smallestIndex,
    traffic: value.traffic
  };
}

function useQueueStatusImpl (): OnDemandQueueStatus | undefined {
  const { api } = useApi();

  const queue = useCall<OnDemandQueueStatus>(api.query.onDemandAssignmentProvider?.queueStatus);

  const [state, setState] = useState<OnDemandQueueStatus | undefined>();

  useEffect((): void => {
    queue &&
            setState(
              extractInfo(queue)
            );
  }, [queue]);

  return state;
}

export const useQueueStatus = createNamedHook('useQueueStatus', useQueueStatusImpl);
