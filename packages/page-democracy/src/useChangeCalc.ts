// Copyright 2017-2020 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { VoteThreshold } from '@polkadot/types/interfaces';

import BN from 'bn.js';
import { useEffect, useState } from 'react';
import { useApi, useCall } from '@polkadot/react-hooks';

import { approxChanges } from './util';

interface Result {
  changeAye: BN;
  changeNay: BN;
}

const ZERO = new BN(0);

export default function useChangeCalc (threshold: VoteThreshold, votedAye: BN, votedNay: BN, votedTotal: BN): Result {
  const { api } = useApi();
  const sqrtElectorate = useCall<BN>(api.derive.democracy.sqrtElectorate, []);
  const [result, setResult] = useState<Result>({ changeAye: ZERO, changeNay: ZERO });

  useEffect((): void => {
    sqrtElectorate && setResult(
      approxChanges(threshold, sqrtElectorate, { votedAye, votedNay, votedTotal })
    );
  }, [sqrtElectorate, threshold, votedAye, votedNay, votedTotal]);

  return result;
}
