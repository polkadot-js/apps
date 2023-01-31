// Copyright 2017-2023 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { PalletStakingExposure } from '@polkadot/types/lookup';
import type { SessionInfo, Validator } from '../types';
import type { UseExposure, UseExposureExposure } from './types';

import { useEffect, useMemo } from 'react';

import { createNamedHook, useApi, useCall } from '@polkadot/react-hooks';
import { BN, objectSpread } from '@polkadot/util';

interface CacheEntry extends UseExposure {
  activeEra: BN;
}

type Cache = Record<string, CacheEntry>;

const OPT_EXPOSURE = {
  transform: ({ others, own, total }: PalletStakingExposure): UseExposureExposure => ({
    others: others
      .map(({ value, who }) => ({
        value: value.unwrap(),
        who: who.toString()
      }))
      .sort((a, b) => b.value.cmp(a.value)),
    own: own.unwrap(),
    total: total.unwrap()
  })
};

function getResult (exposure: UseExposureExposure, clipped: UseExposureExposure): UseExposure {
  let waiting: UseExposure['waiting'];

  const others = exposure.others.filter(({ who }) =>
    !clipped.others.find((c) =>
      who === c.who
    )
  );

  if (others.length) {
    waiting = {
      others,
      total: others.reduce((total, { value }) => total.iadd(value), new BN(0))
    };
  }

  return { clipped, exposure, waiting };
}

const cache: Cache = {};

function useExposureImpl ({ stashId }: Validator, { activeEra }: SessionInfo): UseExposure | undefined {
  const { api } = useApi();

  const params = useMemo(
    () => activeEra && [activeEra, stashId],
    [activeEra, stashId]
  );

  const fullExposure = useCall(params && api.query.staking.erasStakers, params, OPT_EXPOSURE);
  const clipExposure = useCall(params && api.query.staking.erasStakersClipped, params, OPT_EXPOSURE);

  const result = useMemo(
    () => fullExposure && clipExposure && getResult(fullExposure, clipExposure),
    [clipExposure, fullExposure]
  );

  // clear the cached result on era changes
  useEffect((): void => {
    if (activeEra && (!cache[stashId] || !activeEra.eq(cache[stashId].activeEra))) {
      cache[stashId] = { activeEra };
    }
  }, [activeEra, stashId]);

  // update the cached result on exposure changes
  useEffect((): void => {
    if (result && activeEra && cache[stashId] && activeEra.eq(cache[stashId].activeEra)) {
      cache[stashId] = objectSpread<CacheEntry>({ activeEra }, result);
    }
  }, [activeEra, result, stashId]);

  return result || cache[stashId];
}

export default createNamedHook('useExposure', useExposureImpl);
