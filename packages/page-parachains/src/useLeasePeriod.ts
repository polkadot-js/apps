// Copyright 2017-2021 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BlockNumber } from '@polkadot/types/interfaces';

import BN from 'bn.js';
import { useMemo } from 'react';

import { useApi, useCall } from '@polkadot/react-hooks';

interface Result {
  currentPeriod: BN;
  length: BN;
  remainder: BN;
}

export default function useLeasePeriod (): Result | null {
  const { api } = useApi();
  const bestNumber = useCall<BlockNumber>(api.derive.chain.bestNumber);

  return useMemo((): Result | null => {
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
