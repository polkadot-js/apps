// Copyright 2017-2021 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DefinitionRpcExt } from '@polkadot/types/types';

import { useMemo } from 'react';

import { useApi } from '@polkadot/react-hooks';

import { getAllRpc } from './rpcs';

export default function useRpcs (): Record<string, Record<string, DefinitionRpcExt>> {
  const { api } = useApi();

  return useMemo(
    () => getAllRpc(api.registry, api.runtimeChain, api.runtimeVersion),
    [api]
  );
}
