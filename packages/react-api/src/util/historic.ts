// Copyright 2017-2020 @polkadot/react-api authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Hash } from '@polkadot/types/interfaces';
import { Codec } from '@polkadot/types/types';

type AtQuery <I extends any[]> = (hash: string | Uint8Array, ...params: I) => Promise<Codec>;

export default async function getHistoric <T extends Codec, I extends any[] = any[]> (atQuery: AtQuery<I>, params: I, hashes: Hash[]): Promise<[Hash, T][]> {
  return Promise
    .all(hashes.map((hash): Promise<T> => atQuery(hash, ...params) as Promise<T>))
    .then((results): [Hash, T][] =>
      results.map((value, index): [Hash, T] => [hashes[index], value])
    );
}
