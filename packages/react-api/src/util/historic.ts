// Copyright 2017-2019 @polkadot/react-api authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Hash } from '@polkadot/types/interfaces';
import { Codec } from '@polkadot/types/types';

import ApiPromise from '@polkadot/api/promise';

export default async function getHistory <T extends Codec> (api: ApiPromise, endpoint: string, params: any[], hashes: Hash[]): Promise<[Hash, T][]> {
  const [mod, fn] = endpoint.split('.');
  const results = await Promise.all(hashes.map((hash): Promise<T> =>
    api.query[mod][fn].at(hash, ...params) as Promise<T>
  ));

  return results.map((value, index): [Hash, T] => [
    hashes[index],
    value
  ]);
}
