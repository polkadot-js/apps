// Copyright 2017-2022 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { LinkOption } from '@polkadot/apps-config/endpoints/types';

import { useMemo } from 'react';

import { createWsEndpoints } from '@polkadot/apps-config';

import { createNamedHook } from './createNamedHook';

const endpoints = createWsEndpoints((k: string, v?: string) => v || k);

export function getEndpoint (apiUrl?: string): LinkOption | null {
  return endpoints.find(({ value }) => value === apiUrl) || null;
}

function useEndpointImpl (apiUrl?: string): LinkOption | null {
  return useMemo(() => getEndpoint(apiUrl), [apiUrl]);
}

export const useEndpoint = createNamedHook('useEndpoint', useEndpointImpl);
