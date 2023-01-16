// Copyright 2017-2023 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { PalletStakingExposure } from '@polkadot/types/lookup';

import { useMemo } from 'react';

import { createNamedHook, useApi, useCall } from '@polkadot/react-hooks';
import { BN } from '@polkadot/util';

interface ExposureEntry {
  who: string,
  value: BN
}

interface Exposure {
  others: ExposureEntry[];
  own: BN;
  total: BN;
}

interface Result {
  clipped?: Exposure;
  exposure?: Exposure;
  waiting?: {
    others: ExposureEntry[],
    total: BN
  };
}

const OPT_EXPOSURE = {
  transform: ({ others, own, total }: PalletStakingExposure): Exposure => ({
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

function getResult (exposure?: Exposure, clipped?: Exposure): Result {
  let waiting: Result['waiting'];

  if (exposure && clipped) {
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
  }

  return { clipped, exposure, waiting };
}

function useExposureImpl (stashId: string, activeEra: BN | null): Result | undefined {
  const { api } = useApi();

  const params = useMemo(
    () => activeEra && [activeEra, stashId],
    [activeEra, stashId]
  );

  const fullExposure = useCall(params && api.query.staking.erasStakers, params, OPT_EXPOSURE);
  const clipExposure = useCall(params && api.query.staking.erasStakersClipped, params, OPT_EXPOSURE);

  return useMemo(
    () => getResult(fullExposure, clipExposure),
    [clipExposure, fullExposure]
  );
}

export default createNamedHook('useExposure', useExposureImpl);
