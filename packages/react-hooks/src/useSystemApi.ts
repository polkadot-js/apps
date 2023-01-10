// Copyright 2017-2023 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';

import { createNamedHook } from './createNamedHook';
import { useApi } from './useApi';

function useSystemApiImpl (): ApiPromise | undefined {
  const { api, apiRelay } = useApi();

  return apiRelay || api;
}

export const useSystemApi = createNamedHook('useSystemApi', useSystemApiImpl);
