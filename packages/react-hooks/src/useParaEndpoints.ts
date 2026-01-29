// Copyright 2017-2025 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { LinkOption } from '@polkadot/apps-config/endpoints/types';
import type { BN } from '@polkadot/util';

import { useMemo } from 'react';

import { createWsEndpoints } from '@polkadot/apps-config';
import { bnToBn } from '@polkadot/util';

import { createNamedHook } from './createNamedHook.js';
import { useApi } from './useApi.js';

const endpoints = createWsEndpoints((k, v) => v?.toString() || k);

function extractRelayEndpoints (genesisHash: string): LinkOption[] {
  return endpoints.filter(({ genesisHashRelay }) =>
    genesisHash === genesisHashRelay
  );
}

function extractParaEndpoints (allEndpoints: LinkOption[], paraId: BN | number): LinkOption[] {
  const numId = bnToBn(paraId).toNumber();

  return allEndpoints.filter(({ paraId }) =>
    paraId === numId
  );
}

function useRelayEndpointsImpl (): LinkOption[] {
  const { api } = useApi();

  return useMemo(
    () => extractRelayEndpoints(api.genesisHash.toHex()),
    [api]
  );
}

export const useRelayEndpoints = createNamedHook('useRelayEndpoints', useRelayEndpointsImpl);

function useParaEndpointsImpl (paraId: BN | number): LinkOption[] {
  const endpoints = useRelayEndpoints();

  return useMemo(
    () => extractParaEndpoints(endpoints, paraId),
    [endpoints, paraId]
  );
}

export const useParaEndpoints = createNamedHook('useParaEndpoints', useParaEndpointsImpl);

function useIsParasLinkedImpl (ids?: (BN | number)[] | null): Record<string, boolean> {
  const endpoints = useRelayEndpoints();

  return useMemo(
    () => ids
      ? ids.reduce((all: Record<string, boolean>, id) => ({
        ...all,
        [id.toString()]: extractParaEndpoints(endpoints, id).length !== 0
      }), {})
      : {},
    [endpoints, ids]
  );
}

export const useIsParasLinked = createNamedHook('useIsParasLinked', useIsParasLinkedImpl);
