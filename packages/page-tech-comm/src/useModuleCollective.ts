// Copyright 2017-2021 @polkadot/app-tech-comm authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useMemo } from 'react';

import { useApi } from '@polkadot/react-hooks';
import { isFunction } from '@polkadot/util';

export function useModuleCollective (type: 'membership' | 'technicalCommittee'): string | null {
  const { api } = useApi();

  return useMemo(
    (): string | null => {
      const [instance] = api.registry.getModuleInstances(api.runtimeVersion.specName.toString(), type) || [type];

      return isFunction(api.tx[instance as 'technicalCommittee']?.close)
        ? instance
        : null;
    },
    [api, type]
  );
}
