// Copyright 2017-2023 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { SubmittableExtrinsic } from '@polkadot/api/types';
import type { Weight } from '@polkadot/types/interfaces';
import type { BN } from '@polkadot/util';
import type { BatchOptions, BatchType, WeightResult } from './types';

import { useEffect, useMemo, useState } from 'react';

import { BN_ZERO, bnMax, bnMin, bnToBn, isCompact, isFunction, nextTick } from '@polkadot/util';

import { createNamedHook } from './createNamedHook';
import { useAccounts } from './useAccounts';
import { useApi } from './useApi';
import { convertWeight } from './useWeight';

type WeightSimple = Omit<WeightResult, 'v1Weight'>;

// converts a weight construct to only contain BN values
function bnWeight (a: WeightSimple): { v2Weight: { proofSize: BN, refTime: BN } } {
  return {
    v2Weight: {
      proofSize: a.v2Weight.proofSize
        ? bnToBn(
          isCompact(a.v2Weight.proofSize)
            ? a.v2Weight.proofSize.unwrap()
            : a.v2Weight.proofSize
        )
        : BN_ZERO,
      refTime: bnToBn(
        isCompact(a.v2Weight.refTime)
          ? a.v2Weight.refTime.unwrap()
          : a.v2Weight.refTime
      )
    }
  };
}

// subtract 2 BN-only weight values
function weightSub (_a: WeightSimple, _b: WeightSimple): WeightSimple {
  const a = bnWeight(_a);
  const b = bnWeight(_b);

  return {
    v2Weight: {
      proofSize: bnMax(BN_ZERO, a.v2Weight.proofSize.sub(b.v2Weight.proofSize)),
      refTime: bnMax(BN_ZERO, a.v2Weight.refTime.sub(b.v2Weight.refTime))
    }
  };
}

// divide 2 BN-only weight values
function weightDiv (_a: WeightSimple, _b: WeightSimple): number {
  const a = bnWeight(_a);
  const b = bnWeight(_b);
  const r = {
    v2Weight: {
      proofSize: b.v2Weight.proofSize.isZero()
        ? BN_ZERO
        : bnMax(BN_ZERO, a.v2Weight.proofSize.div(b.v2Weight.proofSize)),
      refTime: b.v2Weight.refTime.isZero()
        ? BN_ZERO
        : bnMax(BN_ZERO, a.v2Weight.refTime.div(b.v2Weight.refTime))
    }
  };

  return r.v2Weight.proofSize.isZero()
    ? r.v2Weight.refTime.toNumber()
    : bnMin(r.v2Weight.proofSize, r.v2Weight.refTime).toNumber();
}

function createBatches (api: ApiPromise, txs: SubmittableExtrinsic<'promise'>[], batchSize: number, type: BatchType = 'default'): SubmittableExtrinsic<'promise'>[] {
  if (batchSize === 1 || !isFunction(api.tx.utility?.batch)) {
    return txs;
  }

  return txs
    .reduce((batches: SubmittableExtrinsic<'promise'>[][], tx): SubmittableExtrinsic<'promise'>[][] => {
      const batch = batches[batches.length - 1];

      if (batch.length >= batchSize) {
        batches.push([tx]);
      } else {
        batch.push(tx);
      }

      return batches;
    }, [[]])
    .map((batch): SubmittableExtrinsic<'promise'> =>
      batch.length === 1
        ? batch[0]
        : type === 'all' && isFunction(api.tx.utility.batchAll)
          ? api.tx.utility.batchAll(batch)
          : api.tx.utility.batch(batch)
    );
}

function useTxBatchImpl (txs?: SubmittableExtrinsic<'promise'>[] | null | false, options?: BatchOptions): SubmittableExtrinsic<'promise'>[] | null {
  const { api } = useApi();
  const { allAccounts } = useAccounts();
  const [batchSize, setBatchSize] = useState(() => Math.floor(options?.max || 4));

  useEffect((): void => {
    txs && txs.length && allAccounts[0] && txs[0].hasPaymentInfo &&
      nextTick(async (): Promise<void> => {
        try {
          const paymentInfo = await txs[0].paymentInfo(allAccounts[0]);
          const weight = convertWeight(paymentInfo.weight);
          const maxBlock = convertWeight(
            api.consts.system.blockWeights
              ? api.consts.system.blockWeights.maxBlock
              : api.consts.system.maximumBlockWeight as Weight
          );
          const baseExtrinsic = bnWeight(convertWeight(
            api.consts.system.blockWeights
              ? api.consts.system.blockWeights.perClass.normal.baseExtrinsic
              : BN_ZERO as unknown as Weight
          ));
          const maxExtrinsic = bnWeight(convertWeight(
            api.consts.system.blockWeights && api.consts.system.blockWeights.perClass.normal.maxExtrinsic.isSome
              ? api.consts.system.blockWeights.perClass.normal.maxExtrinsic.unwrap()
              : BN_ZERO as unknown as Weight
          ));

          setBatchSize((prev) =>
            weight.v1Weight.isZero()
              ? prev
              : (
                maxExtrinsic.v2Weight.proofSize.gt(BN_ZERO) &&
                maxExtrinsic.v2Weight.refTime.gt(BN_ZERO) &&
                weightDiv(
                  weightSub(maxExtrinsic, baseExtrinsic),
                  weightSub(weight, baseExtrinsic)
                )
              ) || Math.floor(
                maxBlock.v1Weight
                  .muln(64) // 65% of the block weight on a single extrinsic (64 for safety)
                  .div(weight.v1Weight)
                  .toNumber() / 100
              )
          );
        } catch (error) {
          console.error(error);
        }
      });
  }, [allAccounts, api, options, txs]);

  return useMemo(
    () => txs && txs.length
      ? createBatches(api, txs, batchSize, options?.type)
      : null,
    [api, batchSize, options, txs]
  );
}

export const useTxBatch = createNamedHook('useTxBatch', useTxBatchImpl);
