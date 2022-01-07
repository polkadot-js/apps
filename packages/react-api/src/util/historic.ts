// Copyright 2017-2022 @polkadot/react-api authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Hash } from '@polkadot/types/interfaces';
import type { Codec } from '@polkadot/types/types';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type AtQuery <I extends unknown[]> = (hash: string | Uint8Array, ...params: I) => Promise<Codec>;

export default async function getHistoric <T extends Codec, I extends unknown[] = unknown[]> (atQuery: AtQuery<I>, params: I, hashes: Hash[]): Promise<[Hash, T][]> {
  return Promise
    .all(hashes.map((hash): Promise<T> => atQuery(hash, ...params) as Promise<T>))
    .then((results): [Hash, T][] =>
      results.map((value, index): [Hash, T] => [hashes[index], value])
    );
}
