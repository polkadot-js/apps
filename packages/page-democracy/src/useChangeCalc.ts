// Copyright 2017-2020 @polkadot/app-democracy authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';
import { useEffect, useState } from 'react';

import type { VoteThreshold } from '@polkadot/types/interfaces';
import { useApi, useCall } from '@polkadot/react-hooks';
import { BN_ZERO } from '@polkadot/util';

import { approxChanges } from './util';

interface Result {
  changeAye: BN;
  changeNay: BN;
}

export default function useChangeCalc (threshold: VoteThreshold, votedAye: BN, votedNay: BN, votedTotal: BN): Result {
  const { api } = useApi();
  const sqrtElectorate = useCall<BN>(api.derive.democracy.sqrtElectorate);
  const [result, setResult] = useState<Result>({ changeAye: BN_ZERO, changeNay: BN_ZERO });

  useEffect((): void => {
    sqrtElectorate && setResult(
      approxChanges(threshold, sqrtElectorate, { votedAye, votedNay, votedTotal })
    );
  }, [sqrtElectorate, threshold, votedAye, votedNay, votedTotal]);

  return result;
}
