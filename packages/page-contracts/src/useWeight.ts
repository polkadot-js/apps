// Copyright 2017-2025 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Weight, WeightV2 } from '@polkadot/types/interfaces';
import type { BN } from '@polkadot/util';
import type { UseWeight } from './types.js';

import { useCallback, useMemo, useState } from 'react';

import { createNamedHook, useApi, useBlockInterval } from '@polkadot/react-hooks';
import { convertWeight } from '@polkadot/react-hooks/useWeight';
import { BN_MILLION, BN_ONE, BN_TEN, BN_ZERO } from '@polkadot/util';

function useWeightImpl (): UseWeight {
  const { api } = useApi();
  const blockTime = useBlockInterval();
  const isWeightV2 = !!api.registry.createType<WeightV2>('Weight').proofSize;
  const [megaGas, _setMegaGas] = useState<BN>(
    convertWeight(
      api.consts.system.blockWeights
        ? api.consts.system.blockWeights.maxBlock
        : api.consts.system.maximumBlockWeight as Weight
    ).v1Weight.div(BN_MILLION).div(BN_TEN)
  );
  const [megaRefTime, _setMegaRefTime] = useState<BN>(
    api.consts.system.blockWeights
      ? api.consts.system.blockWeights.perClass.normal.maxExtrinsic.unwrapOrDefault().refTime.toBn().div(BN_MILLION).div(BN_TEN)
      : BN_ZERO
  );
  const [proofSize, _setProofSize] = useState<BN>(
    api.consts.system.blockWeights
      ? api.consts.system.blockWeights.perClass.normal.maxExtrinsic.unwrapOrDefault().proofSize.toBn()
      : BN_ZERO
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
  const setMegaRefTime = useCallback(
    (value?: BN | undefined) =>
      _setMegaRefTime(
        value || api.consts.system.blockWeights
          ? api.consts.system.blockWeights.perClass.normal.maxExtrinsic.unwrapOrDefault().refTime.toBn().div(BN_MILLION).div(BN_TEN)
          : BN_ZERO
      ),
    [api]
  );
  const setProofSize = useCallback(
    (value?: BN | undefined) =>
      _setProofSize(
        value || api.consts.system.blockWeights
          ? api.consts.system.blockWeights.perClass.normal.maxExtrinsic.unwrapOrDefault().proofSize.toBn()
          : BN_ZERO
      ),
    [api]
  );

  return useMemo((): UseWeight => {
    let executionTime = 0;
    let percentage = 0;
    let weight = BN_ZERO;
    let weightV2 = api.registry.createType('WeightV2', {
      proofSize: BN_ZERO,
      refTime: BN_ZERO
    });
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

    if (isWeightV2 && megaRefTime && proofSize) {
      weightV2 = api.registry.createType('WeightV2', {
        proofSize,
        refTime: megaRefTime.mul(BN_MILLION)
      });
      executionTime = megaRefTime.mul(BN_MILLION).mul(blockTime).div(
        api.consts.system.blockWeights
          ? api.consts.system.blockWeights.perClass.normal.maxExtrinsic.unwrapOrDefault().refTime.toBn()
          : BN_ONE
      ).toNumber();
      percentage = (executionTime / blockTime.toNumber()) * 100;

      // execution is 2s of 6s blocks, i.e. 1/3
      executionTime = executionTime / 3000;
      isValid = !megaRefTime.isZero(); // && percentage < 65;
    }

    return {
      executionTime,
      isEmpty,
      isValid: isEmpty || isValid,
      isWeightV2,
      megaGas: megaGas || BN_ZERO,
      megaRefTime: megaRefTime || BN_ZERO,
      percentage,
      proofSize: proofSize || BN_ZERO,
      setIsEmpty,
      setMegaGas,
      setMegaRefTime,
      setProofSize,
      weight,
      weightV2
    };
  }, [api, blockTime, isEmpty, isWeightV2, megaGas, megaRefTime, proofSize, setIsEmpty, setMegaGas, setMegaRefTime, setProofSize]);
}

export default createNamedHook('useWeight', useWeightImpl);
