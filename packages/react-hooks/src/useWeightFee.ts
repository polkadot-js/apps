// Copyright 2017-2021 @polkadot/app-democracy authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { WeightToFeeCoefficient } from '@polkadot/types/interfaces';

import BN from 'bn.js';
import { useMemo } from 'react';

import { BN_BILLION, BN_ZERO, bnToBn, isUndefined } from '@polkadot/util';

import { useApi } from './useApi';

export function useWeightFee (weight: BN | number, apiOverride?: ApiPromise | null): BN {
  const { api } = useApi();

  return useMemo(
    () => isUndefined(apiOverride) || apiOverride
      ? ((apiOverride || api).consts.transactionPayment?.weightToFee || []).reduce((acc, { coeffFrac, coeffInteger, degree, negative }: WeightToFeeCoefficient): BN => {
        const w = bnToBn(weight).pow(degree);
        const frac = coeffFrac.mul(w).div(BN_BILLION);
        const integer = coeffInteger.mul(w);

        if (negative.isTrue) {
          acc.isub(frac);
          acc.isub(integer);
        } else {
          acc.iadd(frac);
          acc.iadd(integer);
        }

        return acc;
      }, new BN(0))
      : BN_ZERO,
    [api, apiOverride, weight]
  );
}
