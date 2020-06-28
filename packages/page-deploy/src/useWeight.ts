// Copyright 2017-2020 @polkadot/react-hooks authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { UseWeight } from './types';

import BN from 'bn.js';
import { useMemo, useState } from 'react';
import { useBlockTime } from '@polkadot/react-hooks';
import { BN_ZERO } from '@polkadot/util';

const BN_MILLION = new BN(1e6);

export default function useWeight (initialValue: BN = BN_MILLION): UseWeight {
  const [blockTime] = useBlockTime();
  const [megaGas, setMegaGas] = useState<BN | undefined>(initialValue);
  const [executionTime, isValid, percentage, weight] = useMemo(
    (): [number, boolean, number, BN] => {
      if (!megaGas) {
        return [0, false, 0, BN_ZERO];
      }

      const weight = megaGas.mul(BN_MILLION);
      const executionTime = megaGas.toNumber() / 1e6;
      const percentage = Math.round((executionTime / (blockTime / 1000)) * 100);
      const isValid = !megaGas.isZero() && percentage < 100;

      return [executionTime, isValid, percentage, weight];
    },
    [blockTime, megaGas]
  );

  return {
    executionTime, isValid, megaGas: megaGas || BN_ZERO, percentage, setMegaGas, weight
  };
}
