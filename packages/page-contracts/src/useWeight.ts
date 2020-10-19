// Copyright 2017-2020 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { UseWeight } from './types';

import BN from 'bn.js';
import { useMemo, useState } from 'react';
import { useApi, useBlockTime } from '@polkadot/react-hooks';
import { BN_TEN, BN_ZERO } from '@polkadot/util';

const BN_MILLION = new BN(1e6);

export default function useWeight (initialValue?: BN): UseWeight {
  const { api } = useApi();
  const [blockTime] = useBlockTime();
  const [megaGas, setMegaGas] = useState<BN | undefined>(
    initialValue || api.consts.system.maximumBlockWeight.div(BN_MILLION).div(BN_TEN)
  );
  const [executionTime, percentage, weight, isValid] = useMemo(
    (): [number, number, BN, boolean] => {
      if (!megaGas) {
        return [0, 0, BN_ZERO, false];
      }

      const weight = megaGas.mul(BN_MILLION);
      const executionTime = weight.muln(blockTime).div(api.consts.system.maximumBlockWeight).toNumber();
      const percentage = Math.round((executionTime / blockTime) * 100);

      // execution is 2s of 6s blocks, i.e. 1/3
      return [executionTime / 3000, percentage, weight, !megaGas.isZero() && percentage < 100];
    },
    [api, blockTime, megaGas]
  );

  return useMemo(
    () => ({
      executionTime,
      isValid,
      megaGas: megaGas || BN_ZERO,
      percentage,
      setMegaGas,
      weight
    }),
    [executionTime, isValid, megaGas, percentage, setMegaGas, weight]
  );
}
