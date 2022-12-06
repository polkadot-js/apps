// Copyright 2017-2022 @polkadot/app-tech-comm authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { CollectiveType } from './types';

import { useMemo } from 'react';

import { useApi } from '@polkadot/react-hooks';
import { isFunction } from '@polkadot/util';

import { createNamedHook } from './createNamedHook';
import { useValueMemo } from './useValueMemo';

function useCollectiveInstanceImpl (instanceType: CollectiveType, instanceIndex?: number): CollectiveType | null {
  const { api } = useApi();
  const type = useMemo(
    (): CollectiveType | null => {
      const index = instanceIndex || 0;
      const instances = api.registry.getModuleInstances(api.runtimeVersion.specName.toString(), instanceType);
      const instance = instances && (index < instances.length)
        ? instances[index] as 'council'
        : instanceType;

      return api.tx[instance] && isFunction(api.tx[instance].close)
        ? instance
        : null;
    },
    [api, instanceIndex, instanceType]
  );

  return useValueMemo(type);
}

export const useCollectiveInstance = createNamedHook('useCollectiveInstance', useCollectiveInstanceImpl);
