// Copyright 2017-2020 @polkadot/react-hooks authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Call } from '@polkadot/types/interfaces';

import BN from 'bn.js';
import { useEffect, useState } from 'react';
import { BN_ZERO } from '@polkadot/util';

import useApi from './useApi';
import useIsMountedRef from './useIsMountedRef';

// a random address that we are using for our queries
const ZERO_ACCOUNT = '5CAUdnwecHGxxyr5vABevAfZ34Fi4AaraDRMwfDQXQ52PXqg';

// for a given call, calculate the weight
export default function useWeight (call: Call): BN {
  const { api } = useApi();
  const mountedRef = useIsMountedRef();
  const [weight, setWeight] = useState<BN>(BN_ZERO);

  useEffect((): void => {
    api.tx(call)
      .paymentInfo(ZERO_ACCOUNT)
      .then(({ weight }) => mountedRef.current && setWeight(weight))
      .catch(console.error);
  }, [api, call, mountedRef]);

  return weight;
}
