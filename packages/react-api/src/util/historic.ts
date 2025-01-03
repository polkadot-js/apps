// Copyright 2017-2025 @polkadot/react-api authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Hash } from '@polkadot/types/interfaces';
import type { Codec } from '@polkadot/types/types';

type AtQuery <I extends unknown[]> = (hash: string | Uint8Array, ...params: I) => Promise<Codec>;

export async function getHistoric <T extends Codec, I extends unknown[] = unknown[]> (atQuery: AtQuery<I>, params: I, hashes: Hash[]): Promise<[Hash, T][]> {
  return Promise
    .all(hashes.map((hash): Promise<T> => atQuery(hash, ...params) as Promise<T>))
    .then((results): [Hash, T][] =>
      results.map((value, index): [Hash, T] => [hashes[index], value])
    );
}
