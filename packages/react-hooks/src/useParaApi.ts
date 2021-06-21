// Copyright 2017-2021 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type BN from 'bn.js';
import type { LinkOption } from '@polkadot/apps-config/endpoints/types';

import { useEffect, useState } from 'react';

import { ApiPromise } from '@polkadot/api';

import { useApiUrl } from './useApiUrl';
import { useIsMountedRef } from './useIsMountedRef';
import { useParaEndpoints } from './useParaEndpoints';

interface Result {
  api?: ApiPromise | null;
  endpoints: LinkOption[];
  urls: string[];
}

export function useParaApi (paraId: BN | number): Result {
  const mountedRef = useIsMountedRef();
  const endpoints = useParaEndpoints(paraId);
  const [state, setState] = useState<Result>(() => ({
    api: null,
    endpoints,
    urls: []
  }));
  const api = useApiUrl(state.urls);

  useEffect((): void => {
    mountedRef.current && setState({
      api: null,
      endpoints,
      urls: endpoints.map(({ value }) => value).reverse()
    });
  }, [endpoints, mountedRef]);

  useEffect((): void => {
    mountedRef.current && setState(({ endpoints, urls }) => ({
      api,
      endpoints,
      urls
    }));
  }, [api, mountedRef]);

  return state;
}
