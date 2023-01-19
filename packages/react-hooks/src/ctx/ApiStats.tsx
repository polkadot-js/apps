// Copyright 2017-2023 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { ProviderStats } from '@polkadot/rpc-provider/types';
import type { ApiStats } from './types';

import React, { useEffect, useRef, useState } from 'react';

import { useApi } from '../useApi';
import { useIsMountedRef } from '../useIsMountedRef';

interface Props {
  children?: React.ReactNode;
}

const MAX_NUM = 60; // 5 minutes
const INTERVAL = 5_000;
const EMPTY_STATE: ApiStats[] = [];

function getStats (...apis: ApiPromise[]): { stats: ProviderStats, when: number } {
  const stats: ProviderStats = {
    active: {
      requests: 0,
      subscriptions: 0
    },
    total: {
      bytesRecv: 0,
      bytesSent: 0,
      cached: 0,
      errors: 0,
      requests: 0,
      subscriptions: 0,
      timeout: 0
    }
  };

  if (apis.length === 0) {
    return { stats, when: Date.now() };
  } else if (apis.length === 1) {
    return { stats: apis[0].stats || stats, when: Date.now() };
  }

  for (let i = 0; i < apis.length; i++) {
    if (apis[i]) {
      const s = apis[i].stats;

      if (s) {
        stats.active.requests += s.active.requests;
        stats.active.subscriptions += s.active.subscriptions;
        stats.total.bytesRecv += s.total.bytesRecv;
        stats.total.bytesSent += s.total.bytesSent;
        stats.total.cached += s.total.cached;
        stats.total.errors += s.total.errors;
        stats.total.requests += s.total.requests;
        stats.total.subscriptions += s.total.subscriptions;
        stats.total.timeout += s.total.timeout;
      }
    }
  }

  return {
    stats,
    when: Date.now()
  };
}

export const ApiStatsCtx = React.createContext<ApiStats[]>(EMPTY_STATE);

export function ApiStatsCtxRoot ({ children }: Props): React.ReactElement<Props> {
  const { api } = useApi();
  const [stats, setStats] = useState(EMPTY_STATE);
  const timerId = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mountedRef = useIsMountedRef();

  useEffect((): () => void => {
    function fireTimer (): void {
      timerId.current = null;

      if (mountedRef.current) {
        const curr = getStats(api);

        setStats((prev): ApiStats[] => {
          if (prev.length === 0) {
            return [curr];
          }

          return prev.length === MAX_NUM
            ? prev.concat(curr).slice(-MAX_NUM)
            : prev.concat(curr);
        });

        timerId.current = setTimeout(fireTimer, INTERVAL);
      }
    }

    fireTimer();

    return (): void => {
      timerId.current && clearTimeout(timerId.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ApiStatsCtx.Provider value={stats}>
      {children}
    </ApiStatsCtx.Provider>
  );
}
