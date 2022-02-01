// Copyright 2017-2022 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { ApiPromise, WsProvider } from '@polkadot/api';
import { typesBundle, typesChain } from '@polkadot/apps-config';
import { arrayShuffle, isString } from '@polkadot/util';

import { createNamedHook } from './createNamedHook';
import { useIsMountedRef } from './useIsMountedRef';

function disconnect (api: ApiPromise | null): void {
  api && api.disconnect().catch(console.error);
}

function useApiUrlImpl (url?: null | string | string[]): ApiPromise | null {
  const apiRef = useRef<ApiPromise | null>(null);
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
      disconnect(apiRef.current);
      apiRef.current = null;
    };
  }, []);

  const _setApi = useCallback(
    (api: ApiPromise | null): void => {
      disconnect(apiRef.current);

      if (mountedRef.current) {
        apiRef.current = api;
        setState(api);
      }
    },
    [mountedRef]
  );

  useEffect((): void => {
    _setApi(null);

    urls.length &&
      ApiPromise
        .create({
          provider: new WsProvider(urls),
          typesBundle,
          typesChain
        })
        .then(_setApi)
        .catch(console.error);
  }, [_setApi, urls]);

  return state;
}

export const useApiUrl = createNamedHook('useApiUrl', useApiUrlImpl);
