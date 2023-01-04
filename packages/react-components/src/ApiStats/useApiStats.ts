// Copyright 2017-2023 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Stats } from './types';

import { useCallback, useEffect, useRef, useState } from 'react';

import { createNamedHook, useApi } from '@polkadot/react-hooks';

const MAX_NUM = 60; // 5 minutes
const INTERVAL = 5_000;

function useApiStatsImpl (): Stats[] {
  const { api, getStats } = useApi();
  const [stats, setStats] = useState<Stats[]>([]);
  const timerId = useRef<NodeJS.Timeout | null>(null);

  const fireTimer = useCallback(
    (): void => {
      timerId.current = null;

      const [stats, when] = getStats(api);

      setStats((prev): Stats[] => {
        const curr = {
          stats,
          when
        };

        if (prev.length === 0) {
          return [curr];
        }

        return prev.length === MAX_NUM
          ? prev.concat(curr).slice(-MAX_NUM)
          : prev.concat(curr);
      });

      timerId.current = setTimeout(() => fireTimer(), INTERVAL);
    },
    [api, getStats, timerId]
  );

  useEffect((): () => void => {
    fireTimer();

    return (): void => {
      timerId.current && clearTimeout(timerId.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return stats;
}

export default createNamedHook('useApiStats', useApiStatsImpl);
