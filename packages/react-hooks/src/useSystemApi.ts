// Copyright 2017-2022 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';

import { useMemo } from 'react';

import { createNamedHook } from './createNamedHook';
import { useApi } from './useApi';

function useSystemApiImpl (): ApiPromise {
  const { api, apiRelay } = useApi();

  return useMemo(() => apiRelay || api, [apiRelay, api]);
}

export const useSystemApi = createNamedHook('useSystemApi', useSystemApiImpl);
