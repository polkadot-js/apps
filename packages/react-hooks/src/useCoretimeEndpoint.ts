// Copyright 2017-2025 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { LinkOption } from '@polkadot/apps-config/endpoints/types';

import { useMemo } from 'react';

import { createWsEndpoints } from '@polkadot/apps-config';
import { isString } from '@polkadot/util';

import { createNamedHook } from './createNamedHook.js';

const endpoints = createWsEndpoints((k, v) => v?.toString() || k);

export function getCoretimeEndpoint (curApiInfo?: string): LinkOption | null {
  return endpoints.find(({ info }) => isString(info) && isString(curApiInfo) && info.toLowerCase().includes('coretime') && info.toLowerCase().includes(curApiInfo.toLowerCase())) || null;
}

function useCoretimeEndpointImpl (relayInfo?: string): LinkOption | null {
  return useMemo(() => getCoretimeEndpoint(relayInfo), [relayInfo]);
}

export const useCoretimeEndpoint = createNamedHook('useCoretimeEndpoint', useCoretimeEndpointImpl);
