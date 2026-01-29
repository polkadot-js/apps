// Copyright 2017-2025 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useEffect } from 'react';

export interface CacheValue<T> {
  value?: T;
}

type CacheMapKey = `use${'Exposure' | 'Heartbeat'}`;

type CacheValKey = `use${'ElectedValidators' | 'Points' | 'ValidatorsActive' | 'ValidatorsAll' | 'ValidatorsWaiting'}`;

const cacheMap: Record<CacheMapKey, Record<string, CacheValue<any>>> = {
  useExposure: {},
  useHeartbeat: {}
};

const cacheVal: Record<CacheValKey, CacheValue<any>> = {
  useElectedValidators: {},
  usePoints: {},
  useValidatorsActive: {},
  useValidatorsAll: {},
  useValidatorsWaiting: {}
};

export function clearCache (): void {
  for (const k of Object.keys(cacheMap)) {
    cacheMap[k as CacheMapKey] = {};
  }

  for (const k of Object.keys(cacheVal)) {
    cacheVal[k as CacheValKey] = {};
  }
}

export function useCacheMap <T> (section: CacheMapKey, id: string, value?: T): T | undefined {
  // update the cached result on value changes
  useEffect((): void => {
    if (value) {
      cacheMap[section][id] = { value };
    }
  }, [id, section, value]);

  return value || (cacheMap[section][id] as CacheValue<T>)?.value;
}

export function useCacheValue <T> (section: CacheValKey, value?: T): T | undefined {
  // update the cached result on value changes
  useEffect((): void => {
    if (value) {
      cacheVal[section] = { value };
    }
  }, [section, value]);

  return value || (cacheVal[section] as CacheValue<T>)?.value;
}
