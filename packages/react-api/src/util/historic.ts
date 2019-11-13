// Copyright 2017-2019 @polkadot/react-api authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Hash } from '@polkadot/types/interfaces';
import { Codec } from '@polkadot/types/types';

import BN from 'bn.js';
import ApiPromise from '@polkadot/api/promise';

import getHashes, { HashesOptions } from './hashes';

export default async function getHistory <T extends Codec> (api: ApiPromise, endpoint: string, params: any[], options: HashesOptions): Promise<[BN, Hash, T][]> {
  const [mod, fn] = endpoint.split('.');
  const numbers = await getHashes(api, options);
  const results = await Promise.all(numbers.map(([, hash]): Promise<T> =>
    api.query[mod][fn].at(hash, ...params) as Promise<T>
  ));

  return results.map((value, index): [BN, Hash, T] => [
    numbers[index][0],
    numbers[index][1],
    value
  ]);
}
