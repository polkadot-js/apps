// Copyright 2017-2021 @polkadot/app-tech-comm authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useMemo } from 'react';

import { useApi } from '@polkadot/react-hooks';
import { isFunction } from '@polkadot/util';

export function useCollectiveModule (instanceType: 'council' | 'membership' | 'technicalCommittee', instanceIndex?: number): 'council' | 'membership' | 'technicalCommittee' | null {
  const { api } = useApi();

  return useMemo(
    (): 'council' | 'membership' | 'technicalCommittee' | null => {
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
}
