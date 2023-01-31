// Copyright 2017-2023 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { CacheValue } from './types';

import { useEffect } from 'react';

import { BN } from '@polkadot/util';

type CacheSection = `use${'ElectedValidators' | 'Points' | 'ValidatorsActive' | 'ValidatorsAll' | 'ValidatorsWaiting'}`;

const cache: Record<CacheSection, CacheValue<any>> = {
  useElectedValidators: { check: new BN(-1) },
  usePoints: { check: new BN(-1) },
  useValidatorsActive: { check: new BN(-1) },
  useValidatorsAll: { check: new BN(-1) },
  useValidatorsWaiting: { check: new BN(-1) }
};

export function getResultValue <T> (cached?: CacheValue<T>, check?: BN | null, value?: T): T | undefined {
  return value || (
    check &&
    cached &&
    cached.check.eq(check) &&
    cached.value
  ) || undefined;
}

export function useCacheValue <T> (section: CacheSection, check?: BN | null, value?: T): T | undefined {
  // ensure that the specific id has an entry
  useEffect((): void => {
    if (check && !cache[section].check.eq(check)) {
      cache[section] = { check };
    }
  }, [check, section]);

  // update the cached result on value changes
  useEffect((): void => {
    if (value && check && cache[section].check.eq(check)) {
      cache[section] = { check, value };
    }
  }, [check, section, value]);

  return getResultValue(cache[section] as CacheValue<T>, check, value);
}
