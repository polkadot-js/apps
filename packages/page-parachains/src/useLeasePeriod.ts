// Copyright 2017-2022 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BlockNumber } from '@polkadot/types/interfaces';
import type { LeasePeriod } from './types';

import { useMemo } from 'react';

import { createNamedHook, useApi, useBestNumber } from '@polkadot/react-hooks';
import { BN_ZERO } from '@polkadot/util';

function useLeasePeriodImpl (): LeasePeriod | undefined {
  const { api } = useApi();
  const bestNumber = useBestNumber();

  return useMemo((): LeasePeriod | undefined => {
    if (!api.consts.slots.leasePeriod || !bestNumber) {
      return;
    }

    const length = api.consts.slots.leasePeriod as BlockNumber;
    const startNumber = bestNumber.sub((api.consts.slots.leaseOffset as BlockNumber) || BN_ZERO);
    const progress = startNumber.mod(length);

    return {
      currentPeriod: startNumber.div(length),
      length,
      progress,
      remainder: length.sub(progress)
    };
  }, [api, bestNumber]);
}

export default createNamedHook('useLeasePeriod', useLeasePeriodImpl);
