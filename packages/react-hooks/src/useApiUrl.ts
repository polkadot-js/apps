// Copyright 2017-2022 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ProviderInterface } from '@polkadot/rpc-provider/types';

import { useEffect, useMemo, useRef, useState } from 'react';

import { ApiPromise, WsProvider } from '@polkadot/api';
import { typesBundle } from '@polkadot/apps-config';
import { arrayShuffle, isString } from '@polkadot/util';

import { createNamedHook } from './createNamedHook';
import { useIsMountedRef } from './useIsMountedRef';

function disconnect (provider: ProviderInterface | null): null {
  provider && provider.disconnect().catch(console.error);

  return null;
}

function useApiUrlImpl (url?: null | string | string[]): ApiPromise | null {
  const providerRef = useRef<ProviderInterface | null>(null);
  const mountedRef = useIsMountedRef();
  const [state, setState] = useState<ApiPromise | null>(null);
  const urls = useMemo(
    () => url
      ? isString(url)
        ? [url]
        : arrayShuffle(url.filter((u) => !u.startsWith('light://')))
      : [],
    [url]
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
