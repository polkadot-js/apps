// Copyright 2017-2025 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Call } from '@polkadot/types/interfaces';
import type { ICompact, INumber } from '@polkadot/types/types';
import type { BN } from '@polkadot/util';
import type { V2WeightConstruct, WeightResult } from './types.js';

import { useEffect, useState } from 'react';

import { BN_ZERO, isFunction, nextTick, objectSpread } from '@polkadot/util';

import { createNamedHook } from './createNamedHook.js';
import { useApi } from './useApi.js';
import { useIsMountedRef } from './useIsMountedRef.js';

type V1Weight = INumber;

export interface V2Weight {
  refTime: ICompact<INumber>;
  proofSize: ICompact<INumber>;
}

interface Result extends WeightResult {
  encodedCallLength: number;
  isWeightV2: boolean;
  weight: BN | V2WeightConstruct;
}

// this is 32 bytes in length, it allows construction for both AccountId32 & AccountId20
export const ZERO_ACCOUNT = '0x9876543210abcdef9876543210abcdef9876543210abcdef9876543210abcdef';

const EMPTY_STATE: Partial<Result> = {
  encodedCallLength: 0,
  v1Weight: BN_ZERO,
  v2Weight: { refTime: BN_ZERO },
  weight: BN_ZERO
};

// return both v1 & v2 weight structures (would depend on actual use)
export function convertWeight (weight: V1Weight | V2Weight): WeightResult {
  // We need to handle it because sometimes input parameters are passed with type casting,
  // which can result in them being undefined or null under certain conditions.
  if (!weight) {
    const refTime = BN_ZERO;

    return { v1Weight: refTime, v2Weight: { proofSize: BN_ZERO, refTime } };
  }

  if ((weight as V2Weight).proofSize) {
    // V2 weight
    const refTime = (weight as V2Weight).refTime.toBn();

    return { v1Weight: refTime, v2Weight: weight as V2Weight };
  } else if ((weight as V2Weight).refTime) {
    // V1.5 weight (when not converted)
    const refTime = (weight as V2Weight).refTime.toBn();

    return { v1Weight: refTime, v2Weight: { proofSize: BN_ZERO, refTime } };
  }

  // V1 weight
  const refTime = (weight as V1Weight).toBn();

  return { v1Weight: refTime, v2Weight: { proofSize: BN_ZERO, refTime } };
}

// for a given call, calculate the weight
function useWeightImpl (call?: Call | null): Result {
  const { api } = useApi();
  const mountedRef = useIsMountedRef();
  const [state, setState] = useState<Result>(() => objectSpread({
    // eslint-disable-next-line @typescript-eslint/unbound-method
    isWeightV2: !isFunction(api.registry.createType<V1Weight>('Weight').toBn)
  }, EMPTY_STATE));

  useEffect((): void => {
    if (call && api.call.transactionPaymentApi) {
      nextTick(async (): Promise<void> => {
        try {
          const { v1Weight, v2Weight } = convertWeight(
            (await api.tx(call).paymentInfo(ZERO_ACCOUNT)).weight
          );

          mountedRef.current && setState((prev) =>
            objectSpread({}, prev, {
              encodedCallLength: call.encodedLength,
              v1Weight,
              v2Weight,
              weight: prev.isWeightV2
                ? v2Weight
                : v1Weight
            })
          );
        } catch (error) {
          console.error(error);
        }
      });
    } else {
      setState((prev) =>
        objectSpread({}, prev, EMPTY_STATE)
      );
    }
  }, [api, call, mountedRef]);

  return state;
}

export const useWeight = createNamedHook('useWeight', useWeightImpl);
