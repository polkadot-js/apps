// Copyright 2017-2020 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { UseWeight } from './types';

import BN from 'bn.js';
import { useCallback, useMemo, useState } from 'react';
import { useApi, useBlockTime } from '@polkadot/react-hooks';
import { BN_TEN, BN_ZERO } from '@polkadot/util';

const BN_MILLION = new BN(1_000_000);

export default function useWeight (): UseWeight {
  const { api } = useApi();
  const [blockTime] = useBlockTime();
  const [megaGas, _setMegaGas] = useState<BN>(api.consts.system.maximumBlockWeight.div(BN_MILLION).div(BN_TEN));
  const [isEmpty, setIsEmpty] = useState(false);

  const setMegaGas = useCallback(
    (value?: BN | undefined) => _setMegaGas(value || api.consts.system.maximumBlockWeight.div(BN_MILLION).div(BN_TEN)),
    [api]
  );

  return useMemo((): UseWeight => {
    let executionTime = 0;
    let percentage = 0;
    let weight = BN_ZERO;
    let isValid = false;

    if (megaGas) {
      weight = megaGas.mul(BN_MILLION);
      executionTime = weight.muln(blockTime).div(api.consts.system.maximumBlockWeight).toNumber();
      percentage = (executionTime / blockTime) * 100;

      // execution is 2s of 6s blocks, i.e. 1/3
      executionTime = executionTime / 3000;
      isValid = !megaGas.isZero() && percentage < 65;
    }

    return {
      executionTime,
      isEmpty,
      isValid: isEmpty || isValid,
      megaGas: megaGas || BN_ZERO,
      percentage,
      setIsEmpty,
      setMegaGas,
      weight
    };
  }, [api, blockTime, isEmpty, megaGas, setIsEmpty, setMegaGas]);
}
