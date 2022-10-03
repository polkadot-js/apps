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

// a random address that we are using for our queries
const ZERO_ACCOUNT = '5CAUdnwecHGxxyr5vABevAfZ34Fi4AaraDRMwfDQXQ52PXqg';
const EMPTY_STATE: [BN, number] = [BN_ZERO, 0];

// is this a new V2 weight
export function convertWeight (weight: V1Weight | V2Weight): BN {
  return (weight as V2Weight).proofSize
    ? (weight as V2Weight).refTime.toBn()
    : (weight as V1Weight).toBn();
}

// for a given call, calculate the weight
function useWeightImpl (call?: Call | null): [BN, number] {
  const { api } = useApi();
  const mountedRef = useIsMountedRef();
  const [state, setState] = useState(EMPTY_STATE);

  useEffect((): void => {
    if (call && api.call.transactionPaymentApi) {
      nextTick(async (): Promise<void> => {
        try {
          const extrinsic = api.tx(call);
          const { weight } = await extrinsic.paymentInfo(ZERO_ACCOUNT);

          mountedRef.current && setState([
            convertWeight(weight),
            call.encodedLength
          ]);
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
