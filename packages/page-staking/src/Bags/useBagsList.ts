// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Option } from '@polkadot/types';
import type { PalletBagsListListBag } from '@polkadot/types/lookup';
import type { BN } from '@polkadot/util';

import { useEffect, useState } from 'react';

import { createNamedHook, useApi, useCall } from '@polkadot/react-hooks';

interface Result {
  id: BN;
  info: PalletBagsListListBag;
  key: string;
}

const multiOptions = {
  transform: ([[ids], opts]: [[BN[]], Option<PalletBagsListListBag>[]]): Result[] =>
    ids
      .map((id, index): [BN, Option<PalletBagsListListBag>] => [id, opts[index]])
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

function useBagsListImpl (ids?: BN[]): Result[] | undefined {
  const { api } = useApi();
  const [result, setResult] = useState<Result[] | undefined>();
  const query = useCall(ids && ids.length !== 0 && api.query.bagsList.listBags.multi, [ids], multiOptions);

  useEffect((): void => {
    query && setResult((prev) => merge(prev, query));
  }, [query]);

  return result;
}

export default createNamedHook('useBagsList', useBagsListImpl);
