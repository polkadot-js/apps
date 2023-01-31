// Copyright 2017-2023 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BN } from '@polkadot/util';
import type { CacheValue } from './types';

import { useEffect } from 'react';

import { getResultValue } from './useCacheValue';

type CacheSection = `use${'Exposure' | 'Heartbeat'}`;

const cache: Record<CacheSection, Record<string, CacheValue<any>>> = {
  useExposure: {},
  useHeartbeat: {}
};

export function useCacheMap <T> (section: CacheSection, id: string, check?: BN | null, value?: T): T | undefined {
  // ensure that the specific id has an entry
  useEffect((): void => {
    if (check && (!cache[section][id] || !cache[section][id].check.eq(check))) {
      cache[section][id] = { check };
    }
  }, [check, id, section]);

  // update the cached result on value changes
  useEffect((): void => {
    if (value && check && cache[section][id] && cache[section][id].check.eq(check)) {
      cache[section][id] = { check, value };
    }
  }, [check, id, section, value]);

  return getResultValue(cache[section][id] as CacheValue<T>, check, value);
}
