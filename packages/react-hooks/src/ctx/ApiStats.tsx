// Copyright 2017-2023 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiStats } from './types';

import React, { useCallback, useEffect, useRef, useState } from 'react';

import { useApi } from '../useApi';
import { useIsMountedRef } from '../useIsMountedRef';

interface Props {
  children?: React.ReactNode;
}

const MAX_NUM = 60; // 5 minutes
const INTERVAL = 5_000;
const EMPTY_STATE: ApiStats[] = [];

export const ApiStatsCtx = React.createContext<ApiStats[]>(EMPTY_STATE);

export function ApiStatsCtxRoot ({ children }: Props): React.ReactElement<Props> {
  const { api, getStats } = useApi();
  const [stats, setStats] = useState(EMPTY_STATE);
  const timerId = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mountedRef = useIsMountedRef();

  const fireTimer = useCallback(
    (): void => {
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

        timerId.current = setTimeout(() => fireTimer(), INTERVAL);
      }
    },
    [api, getStats, mountedRef, timerId]
  );

  useEffect((): () => void => {
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
