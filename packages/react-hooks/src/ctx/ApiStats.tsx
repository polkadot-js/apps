// Copyright 2017-2025 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { ProviderStats } from '@polkadot/rpc-provider/types';
import type { ApiStats } from './types.js';

import React, { useCallback } from 'react';

import { useApi } from '../useApi.js';
import { useTimer } from '../useTimer.js';

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

  for (let i = 0, count = apis.length; i < count; i++) {
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

  return {
    stats,
    when: Date.now()
  };
}

function mergeStats (curr: ApiStats, prev: ApiStats[]): ApiStats[] {
  return prev.length === 0
    ? [curr]
    : prev.length === MAX_NUM
      ? prev.concat(curr).slice(-MAX_NUM)
      : prev.concat(curr);
}

export const ApiStatsCtx = React.createContext<ApiStats[]>(EMPTY_STATE);

export function ApiStatsCtxRoot ({ children }: Props): React.ReactElement<Props> {
  const { api } = useApi();

  const stateFn = useCallback(
    (prev: ApiStats[]): ApiStats[] =>
      mergeStats(getStats(api), prev),
    [api]
  );

  const stats = useTimer(stateFn, EMPTY_STATE, INTERVAL);

  return (
    <ApiStatsCtx.Provider value={stats}>
      {children}
    </ApiStatsCtx.Provider>
  );
}
