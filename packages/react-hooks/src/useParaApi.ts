// Copyright 2017-2023 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { LinkOption } from '@polkadot/apps-config/endpoints/types';
import type { BN } from '@polkadot/util';

import { useEffect, useState } from 'react';

import { ApiPromise } from '@polkadot/api';
import { arrayShuffle } from '@polkadot/util';

import { createNamedHook } from './createNamedHook';
import { useApiUrl } from './useApiUrl';
import { useIsMountedRef } from './useIsMountedRef';
import { useParaEndpoints } from './useParaEndpoints';

interface Result {
  api?: ApiPromise | null;
  endpoints: LinkOption[];
  urls: string[];
}

function useParaApiImpl (paraId: BN | number): Result {
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
      urls: arrayShuffle(
        endpoints
          .filter(({ isDisabled, isUnreachable }) => !isDisabled && !isUnreachable)
          .map(({ value }) => value))
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

export const useParaApi = createNamedHook('useParaApi', useParaApiImpl);
