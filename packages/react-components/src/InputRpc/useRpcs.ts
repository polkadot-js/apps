// Copyright 2017-2025 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DefinitionRpcExt } from '@polkadot/types/types';

import { useMemo } from 'react';

import { createNamedHook, useApi } from '@polkadot/react-hooks';

import { getAllRpc } from './rpcs.js';

function useRpcsImpl (): Record<string, Record<string, DefinitionRpcExt>> {
  const { api } = useApi();

  return useMemo(
    () => getAllRpc(api.registry, api.runtimeChain, api.runtimeVersion),
    [api]
  );
}

export default createNamedHook('useRpcs', useRpcsImpl);
