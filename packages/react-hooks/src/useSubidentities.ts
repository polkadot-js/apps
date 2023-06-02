// Copyright 2017-2023 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { createNamedHook } from './createNamedHook.js';
import { useApi } from './useApi.js';
import { useCall } from './useCall.js';

function useSubidentitiesImpl (address: string) {
  const { api } = useApi();

  return useCall(api.query.identity?.subsOf, [address])?.[1];
}

export const useSubidentities = createNamedHook('useSubidentities', useSubidentitiesImpl);
