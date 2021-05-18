// Copyright 2017-2021 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { LinkOption } from '@polkadot/apps-config/settings/types';

import { useCallback, useEffect, useRef, useState } from 'react';

import { ApiPromise, WsProvider } from '@polkadot/api';
import { typesBundle, typesChain } from '@polkadot/apps-config';

import { useIsMountedRef } from './useIsMountedRef';

interface Result {
  api?: ApiPromise | null;
  endpoints: LinkOption[];
}

function disconnect (api: ApiPromise | null): void {
  api && api.disconnect().catch(console.error);
}

export function useEndpointApi (isActive: boolean, endpoints: LinkOption[]): Result {
  const apiRef = useRef<ApiPromise | null>(null);
  const mountedRef = useIsMountedRef();
  const [state, setState] = useState<Result>(() => ({ api: null, endpoints }));

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
        setState(({ endpoints }) => ({ api, endpoints }));
      }
    },
    [mountedRef]
  );

  useEffect((): void => {
    if (isActive && endpoints.length) {
      ApiPromise
        .create({
          provider: new WsProvider(
            endpoints
              .map(({ value }) => value as string)
              .reverse()
          ),
          typesBundle,
          typesChain
        })
        .then(_setApi)
        .catch(console.error);
    } else {
      _setApi(null);
    }
  }, [_setApi, endpoints, isActive]);

  return state;
}
