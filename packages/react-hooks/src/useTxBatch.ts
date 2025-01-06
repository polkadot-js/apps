// Copyright 2017-2025 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { SubmittableExtrinsic } from '@polkadot/api/types';
import type { Weight } from '@polkadot/types/interfaces';
import type { BN } from '@polkadot/util';
import type { BatchOptions, BatchType, WeightResult } from './types.js';

import { useEffect, useMemo, useState } from 'react';

import { BN_HUNDRED, BN_ZERO, bnMax, bnMin, bnToBn, isCompact, isFunction, nextTick } from '@polkadot/util';

import { createNamedHook } from './createNamedHook.js';
import { useAccounts } from './useAccounts.js';
import { useApi } from './useApi.js';
import { convertWeight } from './useWeight.js';

interface BNWeight {
  proofSize: BN;
  refTime: BN;
}

type WeightSimple = WeightResult['v2Weight'] | BNWeight;

interface Known {
  baseExtrinsic: BNWeight | null;
  maxBlock: BNWeight;
  maxExtrinsic: BNWeight | null;
}

// converts a weight construct to only contain BN values
function bnWeight (a: WeightSimple): BNWeight {
  return {
    proofSize: a.proofSize
      ? bnToBn(
        isCompact(a.proofSize)
          ? a.proofSize.unwrap()
          : a.proofSize
      )
      : BN_ZERO,
    refTime: bnToBn(
      isCompact(a.refTime)
        ? a.refTime.unwrap()
        : a.refTime
    )
  };
}

// subtract 2 BN-only weight values
function weightSub (_a: WeightSimple, _b: WeightSimple): BNWeight {
  const a = bnWeight(_a);
  const b = bnWeight(_b);

  return {
    proofSize: bnMax(BN_ZERO, a.proofSize.sub(b.proofSize)),
    refTime: bnMax(BN_ZERO, a.refTime.sub(b.refTime))
  };
}

// divide 2 BN-only weight values
function weightDiv (_a: WeightSimple, _b: WeightSimple): number {
  const a = bnWeight(_a);
  const b = bnWeight(_b);
  const r = {
    proofSize: b.proofSize.isZero()
      ? BN_ZERO
      : bnMax(BN_ZERO, a.proofSize.mul(BN_HUNDRED).div(b.proofSize)),
    refTime: b.refTime.isZero()
      ? BN_ZERO
      : bnMax(BN_ZERO, a.refTime.mul(BN_HUNDRED).div(b.refTime))
  };

  return (
    r.proofSize.isZero()
      ? r.refTime.toNumber()
      : bnMin(r.proofSize, r.refTime).toNumber()
  ) / 100;
}

function getKnown (api: ApiPromise): Known {
  return {
    baseExtrinsic: api.consts.system.blockWeights
      ? bnWeight(
        convertWeight(
          api.consts.system.blockWeights.perClass.normal.baseExtrinsic
        ).v2Weight
      )
      : null,
    maxBlock: bnWeight(
      convertWeight(
        api.consts.system.blockWeights
          ? api.consts.system.blockWeights.maxBlock
          : api.consts.system.maximumBlockWeight as Weight
      ).v2Weight
    ),
    maxExtrinsic: api.consts.system.blockWeights && api.consts.system.blockWeights.perClass.normal.maxExtrinsic.isSome
      ? bnWeight(
        convertWeight(
          api.consts.system.blockWeights.perClass.normal.maxExtrinsic.unwrap()
        ).v2Weight
      )
      : null
  };
}

function getBatchSize ({ v1Weight, v2Weight }: WeightResult, { baseExtrinsic, maxBlock, maxExtrinsic }: Known): number {
  let div = 0;

  // for newer chains we will try and calculate the size based on the supplied constants
  // (At least maxExtrinsic is Option<...>, hence also having the fallback ratio)
  if (baseExtrinsic && maxExtrinsic) {
    // 65 div 75 below is around 86% of space, use same safety ratio here
    // (Since we also have a max total limit for normal, this ensure faster
    // throughput when the chain is busy at the expense of having less txs
    // per batch - it does _eventually_ go through without the ratio)
    div = Math.floor(
      0.85 * weightDiv(
        weightSub(maxExtrinsic, baseExtrinsic),
        weightSub(v2Weight, baseExtrinsic)
      )
    );
  }

  // If we don't have a size calculation above, we create the extrinsic with a fallback
  // of up to 65% of the block weight (applied here as 64 for a safety margin)
  // (This is based on the Kusama/Polkadot 75% allowance for all extrinsics)
  return div || Math.floor(
    maxBlock.refTime
      .muln(64)
      .div(v1Weight)
      .toNumber() / 100
  );
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
          : type === 'force' && isFunction(api.tx.utility.forceBatch)
            ? api.tx.utility.forceBatch(batch)
            : api.tx.utility.batch(batch)
    );
}

function useTxBatchImpl (txs?: SubmittableExtrinsic<'promise'>[] | null | false, options?: BatchOptions): SubmittableExtrinsic<'promise'>[] | null {
  const { api } = useApi();
  const { allAccounts } = useAccounts();
  const [batchSize, setBatchSize] = useState(() => Math.floor(options?.max || 4));

  const known = useMemo(
    () => getKnown(api),
    [api]
  );

  useEffect((): void => {
    txs && txs.length && allAccounts[0] && txs[0].hasPaymentInfo &&
      nextTick(async (): Promise<void> => {
        try {
          const paymentInfo = await txs[0].paymentInfo(allAccounts[0]);
          const weight = convertWeight(paymentInfo.weight);

          setBatchSize((prev) =>
            weight.v1Weight.isZero()
              ? prev
              : getBatchSize(weight, known)
          );
        } catch (error) {
          console.error(error);
        }
      });
  }, [allAccounts, api, known, options, txs]);

  return useMemo(
    () => txs && txs.length
      ? createBatches(api, txs, batchSize, options?.type)
      : null,
    [api, batchSize, options, txs]
  );
}

export const useTxBatch = createNamedHook('useTxBatch', useTxBatchImpl);
