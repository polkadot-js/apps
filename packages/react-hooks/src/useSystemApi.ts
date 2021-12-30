// Copyright 2017-2021 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';

import { createNamedHook } from './createNamedHook';
import { useApi } from './useApi';

function useSystemApiImpl (): ApiPromise {
  return useApi().api;
}

export const useSystemApi = createNamedHook('useSystemApi', useSystemApiImpl);
