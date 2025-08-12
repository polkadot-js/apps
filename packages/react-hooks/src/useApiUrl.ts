// Copyright 2017-2025 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ProviderInterface } from '@polkadot/rpc-provider/types';

import { useEffect, useMemo, useRef, useState } from 'react';

import { ApiPromise, WsProvider } from '@polkadot/api';
import { createWsEndpoints, typesBundle } from '@polkadot/apps-config';
import { settings } from '@polkadot/ui-settings';
import { arrayShuffle, isString } from '@polkadot/util';

import { createNamedHook } from './createNamedHook.js';
import { useIsMountedRef } from './useIsMountedRef.js';

const endpoints = createWsEndpoints();

function disconnect (provider: ProviderInterface | null): null {
  provider?.disconnect().catch(console.error);

  return null;
}

function useApiUrlImpl (url?: null | string | string[]): ApiPromise | null {
  const providerRef = useRef<ProviderInterface | null>(null);
  const mountedRef = useIsMountedRef();
  const [state, setState] = useState<ApiPromise | null>(null);

  const groupedEndpoints = useMemo(() => {
    const map = new Map<string, string>();

    for (const endpoint of endpoints) {
      const rpcProvider = endpoint.textBy;

      if (typeof rpcProvider === 'string' && rpcProvider.length > 0 && rpcProvider !== 'Placeholder') {
        map.set(endpoint.value, rpcProvider);
      }
    }

    return map;
  }, []);

  const urls = useMemo(
    () => {
      let validUrls = url
        ? isString(url)
          ? [url]
          : arrayShuffle(url.filter((u) => !u.startsWith('light://')))
        : [];

      const apiUrl = settings.apiUrl; // Selected chain URL
      const apiUrlProvider = groupedEndpoints.get(apiUrl);

      if (groupedEndpoints.has(apiUrl)) {
        const matchIndex = validUrls.findIndex(
          (u) => groupedEndpoints.get(u) === apiUrlProvider
        );

        // Move the RPC URL to the first position if it's provider matches the selected chain's provider
        if (matchIndex > -1) {
          const [match] = validUrls.splice(matchIndex, 1);

          validUrls = [match, ...validUrls];
        }
      }

      return validUrls;
    },
    [groupedEndpoints, url]
  );

  useEffect((): () => void => {
    return (): void => {
      providerRef.current = disconnect(providerRef.current);
    };
  }, []);

  useEffect((): void => {
    setState(null);
    providerRef.current = disconnect(providerRef.current);

    urls.length &&
      ApiPromise
        .create({
          provider: (providerRef.current = new WsProvider(urls)),
          typesBundle
        })
        .then((api) => mountedRef.current && setState(api))
        .catch(console.error);
  }, [mountedRef, providerRef, urls]);

  return state;
}

export const useApiUrl = createNamedHook('useApiUrl', useApiUrlImpl);
