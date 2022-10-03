// Copyright 2017-2022 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Call } from '@polkadot/types/interfaces';
import type { ICompact, INumber } from '@polkadot/types/types';
import type { BN } from '@polkadot/util';

import { useEffect, useState } from 'react';

import { BN_ZERO, nextTick } from '@polkadot/util';

import { createNamedHook } from './createNamedHook';
import { useApi } from './useApi';
import { useIsMountedRef } from './useIsMountedRef';

type V1Weight = INumber;

interface V2Weight {
  refTime: ICompact<INumber>;
  proofSize: ICompact<INumber>;
}

interface V2WeightConstruct {
  refTime: BN | ICompact<INumber>;
}

interface Result {
  encodedCallLength: number;
  v1Weight: BN;
  v2Weight: V2WeightConstruct;
}

// a random address that we are using for our queries
const ZERO_ACCOUNT = '5CAUdnwecHGxxyr5vABevAfZ34Fi4AaraDRMwfDQXQ52PXqg';
const EMPTY_STATE: Result = {
  encodedCallLength: 0,
  v1Weight: BN_ZERO,
  v2Weight: { refTime: BN_ZERO }
};

// return both v1 & v2 weight structures (would depend on actual use)
export function convertWeight (weight: V1Weight | V2Weight): { v1Weight: BN, v2Weight: V2WeightConstruct } {
  if ((weight as V2Weight).proofSize) {
    const refTime = (weight as V2Weight).refTime.toBn();

    return { v1Weight: refTime, v2Weight: weight as V2Weight };
  }

  const refTime = (weight as V1Weight).toBn();

  return { v1Weight: refTime, v2Weight: { refTime } };
}

// for a given call, calculate the weight
function useWeightImpl (call?: Call | null): Result {
  const { api } = useApi();
  const mountedRef = useIsMountedRef();
  const [state, setState] = useState(EMPTY_STATE);

  useEffect((): void => {
    if (call && api.call.transactionPaymentApi) {
      nextTick(async (): Promise<void> => {
        try {
          const { v1Weight, v2Weight } = convertWeight(
            (await api.tx(call).paymentInfo(ZERO_ACCOUNT)).weight
          );

          mountedRef.current && setState({ encodedCallLength: call.encodedLength, v1Weight, v2Weight });
        } catch (error) {
          console.error(error);
        }
      });
    } else {
      setState(EMPTY_STATE);
    }
  }, [api, call, mountedRef]);

  return state;
}

export const useWeight = createNamedHook('useWeight', useWeightImpl);
