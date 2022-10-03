// Copyright 2017-2022 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Weight } from '@polkadot/types/interfaces';
import type { BN } from '@polkadot/util';
import type { UseWeight } from './types';

import { useCallback, useMemo, useState } from 'react';

import { createNamedHook, useApi, useBlockInterval } from '@polkadot/react-hooks';
import { convertWeight } from '@polkadot/react-hooks/useWeight';
import { BN_MILLION, BN_TEN, BN_ZERO } from '@polkadot/util';

function useWeightImpl (): UseWeight {
  const { api } = useApi();
  const blockTime = useBlockInterval();
  const [megaGas, _setMegaGas] = useState<BN>(
    convertWeight(
      api.consts.system.blockWeights
        ? api.consts.system.blockWeights.maxBlock
        : api.consts.system.maximumBlockWeight as Weight
    ).v1Weight.div(BN_MILLION).div(BN_TEN)
  );
  const [isEmpty, setIsEmpty] = useState(false);

  const setMegaGas = useCallback(
    (value?: BN | undefined) =>
      _setMegaGas(value || convertWeight(
        api.consts.system.blockWeights
          ? api.consts.system.blockWeights.maxBlock
          : api.consts.system.maximumBlockWeight as Weight
      ).v1Weight.div(BN_MILLION).div(BN_TEN)),
    [api]
  );

  return useMemo((): UseWeight => {
    let executionTime = 0;
    let percentage = 0;
    let weight = BN_ZERO;
    let isValid = false;

    if (megaGas) {
      weight = megaGas.mul(BN_MILLION);
      executionTime = weight.mul(blockTime).div(convertWeight(
        api.consts.system.blockWeights
          ? api.consts.system.blockWeights.maxBlock
          : api.consts.system.maximumBlockWeight as Weight
      ).v1Weight).toNumber();
      percentage = (executionTime / blockTime.toNumber()) * 100;

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

export default createNamedHook('useWeight', useWeightImpl);
