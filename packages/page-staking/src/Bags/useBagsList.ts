// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Option, u64 } from '@polkadot/types';
import type { PalletBagsListListBag } from '@polkadot/types/lookup';

import { useEffect, useState } from 'react';

import { createNamedHook, useApi, useCall } from '@polkadot/react-hooks';

interface Result {
  id: u64;
  info: PalletBagsListListBag;
  key: string;
}

const multiOptions = {
  transform: ([[ids], opts]: [[u64[]], Option<PalletBagsListListBag>[]]): Result[] =>
    ids
      .map((id, index): [u64, Option<PalletBagsListListBag>] => [id, opts[index]])
      .filter(([, o]) => o.isSome)
      .map(([id, o]): Result => ({ id, info: o.unwrap(), key: id.toString() })),
  withParamsTransform: true
};

function merge (prev: Result[] | undefined, curr: Result[]): Result[] {
  return !prev || curr.length !== prev.length
    ? curr
    : curr.map((q, i) =>
      JSON.stringify(q) === JSON.stringify(prev[i])
        ? prev[i]
        : q
    );
}

function useBagsListImpl (ids?: u64[]): Result[] | undefined {
  const { api } = useApi();
  const [result, setResult] = useState<Result[] | undefined>();
  const query = useCall(ids && ids.length !== 0 && api.query.bagsList.listBags.multi, [ids], multiOptions);

  useEffect((): void => {
    query && setResult((prev) => merge(prev, query));
  }, [query]);

  return result;
}

export default createNamedHook('useBagsList', useBagsListImpl);
