// Copyright 2017-2025 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { SpStakingExposure } from '@polkadot/types/lookup';
import type { SessionInfo, Validator } from '../types.js';
import type { UseExposure, UseExposureExposure } from './types.js';

import { useMemo } from 'react';

import { createNamedHook, useApi, useCall } from '@polkadot/react-hooks';
import { BN } from '@polkadot/util';

import { useCacheMap } from '../useCache.js';

const OPT_EXPOSURE = {
  transform: ({ others, own, total }: SpStakingExposure): UseExposureExposure => ({
    others: others
      .map(({ value, who }) => ({
        value: value.unwrap(),
        who: who.toString()
      }))
      .sort((a, b) => (b.value as BN).cmp(a.value)),
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

  return useCacheMap('useExposure', stashId, result);
}

export default createNamedHook('useExposure', useExposureImpl);
