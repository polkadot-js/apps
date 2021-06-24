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

// use from @polkadot/util
function arrayShuffle (result: string[]): string[] {
  let currentIndex = result.length;

  while (currentIndex !== 0) {
    const randomIndex = Math.floor(Math.random() * currentIndex);

    currentIndex--;

    [result[currentIndex], result[randomIndex]] = [
      result[randomIndex], result[currentIndex]
    ];
  }

  return result;
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
      urls: arrayShuffle(endpoints.map(({ value }) => value))
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
