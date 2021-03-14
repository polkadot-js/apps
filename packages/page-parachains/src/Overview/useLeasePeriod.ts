// Copyright 2017-2021 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BlockNumber } from '@polkadot/types/interfaces';
import type { LeasePeriod } from './types';

import { useMemo } from 'react';

import { useApi, useBestNumber } from '@polkadot/react-hooks';

export default function useLeasePeriod (): LeasePeriod | null {
  const { api } = useApi();
  const bestNumber = useBestNumber();

  return useMemo((): LeasePeriod | null => {
    if (api.consts.slots?.leasePeriod && bestNumber) {
      const length = api.consts.slots.leasePeriod as BlockNumber;

      return {
        currentPeriod: bestNumber.div(length),
        length,
        remainder: bestNumber.mod(length)
      };
    }

    return null;
  }, [api, bestNumber]);
}
