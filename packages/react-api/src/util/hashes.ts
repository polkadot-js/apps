// Copyright 2017-2019 @polkadot/react-api authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Hash } from '@polkadot/types/interfaces';

import BN from 'bn.js';
import ApiPromise from '@polkadot/api/promise';
import { bnToBn } from '@polkadot/util';

export interface HashesOptions {
  interval: BN | number;
  max: number;
  startNumber: BN;
}

export default async function getHashes (api: ApiPromise, { interval, max, startNumber }: HashesOptions): Promise<[BN, Hash][]> {
  const numbers: BN[] = [];
  const _interval = bnToBn(interval);
  let currentNumber: BN = startNumber;

  while (numbers.length < max && currentNumber.gtn(0)) {
    numbers.unshift(currentNumber);

    currentNumber = currentNumber.sub(_interval);
  }

  const hashes = await Promise.all(
    numbers.map((at): Promise<Hash> => api.rpc.chain.getBlockHash(at as any))
  );

  return numbers.map((bn, index): [BN, Hash] => [bn, hashes[index]]);
}
