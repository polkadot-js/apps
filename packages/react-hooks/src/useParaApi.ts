// Copyright 2017-2021 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type BN from 'bn.js';
import type { LinkOption } from '@polkadot/apps-config/endpoints/types';

import { useCallback, useEffect, useRef, useState } from 'react';

import { ApiPromise, WsProvider } from '@polkadot/api';
import { typesBundle, typesChain } from '@polkadot/apps-config';

import { useIsMountedRef } from './useIsMountedRef';
import { useParaEndpoints } from './useParaEndpoints';

interface Result {
  api?: ApiPromise | null;
  endpoints: LinkOption[];
}

function disconnect (api: ApiPromise | null): void {
  api && api.disconnect().catch(console.error);
}

export function useParaApi (paraId: BN | number): Result {
  const apiRef = useRef<ApiPromise | null>(null);
  const mountedRef = useIsMountedRef();
  const endpoints = useParaEndpoints(paraId);
  const [state, setState] = useState<Result>({ api: null, endpoints });

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
    if (endpoints.length) {
      ApiPromise
        .create({
          provider: new WsProvider(endpoints[endpoints.length - 1].value as string),
          typesBundle,
          typesChain
        })
        .then(_setApi)
        .catch(console.error);
    } else {
      _setApi(null);
    }
  }, [_setApi, endpoints]);

  return state;
}
