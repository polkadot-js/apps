// Copyright 2017-2021 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { LinkOption } from '@polkadot/apps-config/settings/types';

import { useMemo } from 'react';

import { ApiPromise } from '@polkadot/api';
import { createWsEndpoints } from '@polkadot/apps-config';

import { useEndpointApi } from './useEndpointApi';

interface Result {
  api?: ApiPromise | null;
  endpoints: LinkOption[];
}

function useRelayEndpoints (genesisHash?: string): LinkOption[] {
  return useMemo(
    () => genesisHash
      ? createWsEndpoints((key: string, value: string | undefined) => value || key).filter((e) =>
        genesisHash === e.genesisHash
      )
      : [],
    [genesisHash]
  );
}

export function useRelayApi (isActive: boolean, genesisHash?: string): Result {
  const endpoints = useRelayEndpoints(genesisHash);

  return useEndpointApi(isActive, endpoints);
}
