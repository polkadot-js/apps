// Copyright 2017-2023 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { CacheValue } from './types';

import { useEffect } from 'react';

type CacheSection = `use${'ElectedValidators' | 'Points' | 'ValidatorsActive' | 'ValidatorsAll' | 'ValidatorsWaiting'}`;

const cache: Record<CacheSection, CacheValue<any>> = {
  useElectedValidators: {},
  usePoints: {},
  useValidatorsActive: {},
  useValidatorsAll: {},
  useValidatorsWaiting: {}
};

export function getResultValue <T> (cached?: CacheValue<T>, value?: T): T | undefined {
  return value || cached?.value;
}

export function useCacheValue <T> (section: CacheSection, value?: T): T | undefined {
  // update the cached result on value changes
  useEffect((): void => {
    if (value) {
      cache[section] = { value };
    }
  }, [section, value]);

  return getResultValue(cache[section] as CacheValue<T>, value);
}
