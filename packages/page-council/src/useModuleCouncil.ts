// Copyright 2017-2021 @polkadot/app-council authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useMemo } from 'react';

import { useApi } from '@polkadot/react-hooks';
import { isFunction } from '@polkadot/util';

export function useModuleCouncil (): string | null {
  const { api } = useApi();

  return useMemo(
    (): string | null => {
      const [instance] = api.registry.getModuleInstances(api.runtimeVersion.specName.toString(), 'council') || ['council'];

      return isFunction(api.tx[instance as 'council']?.close)
        ? instance
        : null;
    },
    [api]
  );
}
