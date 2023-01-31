// Copyright 2017-2023 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { CacheValue } from './types';

import { useEffect } from 'react';

import { getResultValue } from './useCacheValue';

type CacheSection = `use${'Exposure' | 'Heartbeat'}`;

const cache: Record<CacheSection, Record<string, CacheValue<any>>> = {
  useExposure: {},
  useHeartbeat: {}
};

export function useCacheMap <T> (section: CacheSection, id: string, value?: T): T | undefined {
  // update the cached result on value changes
  useEffect((): void => {
    if (value) {
      cache[section][id] = { value };
    }
  }, [id, section, value]);

  return getResultValue(cache[section][id] as CacheValue<T>, value);
}
