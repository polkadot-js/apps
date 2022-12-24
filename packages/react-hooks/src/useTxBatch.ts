// Copyright 2017-2022 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { SubmittableExtrinsic } from '@polkadot/api/types';
import type { Weight } from '@polkadot/types/interfaces';
import type { ICompact, INumber } from '@polkadot/types/types';
import type { BN } from '@polkadot/util';
import type { BatchOptions, BatchType } from './types';
import type { V2WeightConstruct } from './useWeight';

import { useEffect, useMemo, useState } from 'react';

import { BN_ZERO, bnMax, bnToBn, isFunction, nextTick } from '@polkadot/util';

import { createNamedHook } from './createNamedHook';
import { useAccounts } from './useAccounts';
import { useApi } from './useApi';
import { convertWeight } from './useWeight';

function safeSub (a: BN | ICompact<INumber> = BN_ZERO, b: BN | ICompact<INumber> = BN_ZERO): BN {
  return bnToBn(a).sub(bnToBn(b));
}

function subtractWeight (a: V2WeightConstruct, b: V2WeightConstruct): { proofSize: BN, refTime: BN } {
  return {
    proofSize: bnMax(BN_ZERO, safeSub(a.proofSize, b.proofSize)),
    refTime: bnMax(BN_ZERO, safeSub(a.refTime, b.refTime))
  };
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

function useTxBatchImpl (txs?: SubmittableExtrinsic<'promise'>[] | null | false, { max = 64, type }: BatchOptions = {}): SubmittableExtrinsic<'promise'>[] | null {
  const { api } = useApi();
  const { allAccounts } = useAccounts();
  const [batchSize, setBatchSize] = useState(() => Math.floor(max));

  const [firstTx, firstAccount] = useMemo(
    () => [txs && txs[0], allAccounts[0]],
    [allAccounts, txs]
  );

  useEffect((): void => {
    firstTx && firstAccount && firstTx.hasPaymentInfo &&
      nextTick(async (): Promise<void> => {
        try {
          const paymentInfo = await firstTx.paymentInfo(firstAccount);
          const weight = convertWeight(paymentInfo.weight);

          if (weight.v1Weight.isZero()) {
            return;
          }

          if (api.consts.system.blockWeights && api.consts.system.blockWeights.perClass.normal.maxExtrinsic.isSome) {
            const maxExtrinsic = convertWeight(api.consts.system.blockWeights.perClass.normal.maxExtrinsic.unwrap());
            const baseExtrinsic = convertWeight(api.consts.system.blockWeights.perClass.normal.baseExtrinsic);
            let available = subtractWeight(maxExtrinsic.v2Weight, baseExtrinsic.v2Weight);
            let batchSize = 0;

            while (!bnToBn(available.refTime).isZero() && (!maxExtrinsic.v2Weight.proofSize || !bnToBn(available.proofSize).isZero())) {
              batchSize++;
              available = subtractWeight(available, weight.v2Weight);
            }

            setBatchSize(batchSize);
          } else {
            const maxBlock = convertWeight(
              api.consts.system.blockWeights
                ? api.consts.system.blockWeights.maxBlock
                : api.consts.system.maximumBlockWeight as Weight
            );

            setBatchSize(
              // 65% of the block weight on a single extrinsic (64 for safety)
              Math.floor(
                maxBlock
                  .v1Weight
                  .muln(64)
                  .div(weight.v1Weight)
                  .toNumber() / 100
              )
            );
          }
        } catch (error) {
          console.error(error);
        }
      });
  }, [api, firstTx, firstAccount]);

  return useMemo(
    () => txs && txs.length
      ? createBatches(api, txs, batchSize, type)
      : null,
    [api, batchSize, type, txs]
  );
}

export const useTxBatch = createNamedHook('useTxBatch', useTxBatchImpl);
