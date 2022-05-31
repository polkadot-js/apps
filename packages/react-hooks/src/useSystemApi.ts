// Copyright 2017-2022 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';

import { useEffect, useMemo, useState } from 'react';

import { createNamedHook } from './createNamedHook';
import { useApi } from './useApi';

function useSystemApiImpl (): ApiPromise | undefined {
  const { apiRelay, apiSystem } = useApi();
  const [apiDefault, setApiDefault] = useState<ApiPromise | undefined>();

  // This system API does not use the global ready, so we
  // explicitly wait for it here
  useEffect((): void => {
    apiSystem && apiSystem.isReady
      .then(setApiDefault)
      .catch(console.error);
  }, [apiSystem]);

  return useMemo(() => apiRelay || apiDefault, [apiRelay, apiDefault]);
}

export const useSystemApi = createNamedHook('useSystemApi', useSystemApiImpl);
