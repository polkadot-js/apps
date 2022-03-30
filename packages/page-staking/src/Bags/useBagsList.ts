// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Option } from '@polkadot/types';
import type { PalletBagsListListBag } from '@polkadot/types/lookup';
import type { BN } from '@polkadot/util';
import type { BagInfo } from './types';

import { useEffect, useState } from 'react';

import { createNamedHook, useApi, useCall } from '@polkadot/react-hooks';
import { BN_ZERO } from '@polkadot/util';

const multiOptions = {
  transform: ([[ids], opts]: [[BN[]], Option<PalletBagsListListBag>[]]): BagInfo[] => {
    const sorted = ids
      .map((id, index): [BN, Option<PalletBagsListListBag>] => [id, opts[index]])
      .filter(([, o]) => o.isSome)
      .sort(([a], [b]) => b.cmp(a))
      .map(([upper, o], index): BagInfo => ({
        index,
        info: o.unwrap(),
        key: upper.toString(),
        lower: BN_ZERO,
        upper
      }));

    return sorted.map((entry, index) =>
      (index === (sorted.length - 1))
        ? entry
        // We could probably use a .add(BN_ONE) here
        : { ...entry, lower: sorted[index + 1].upper }
    );
  },
  withParamsTransform: true
};

function merge (prev: BagInfo[] | undefined, curr: BagInfo[]): BagInfo[] {
  return !prev || curr.length !== prev.length
    ? curr
    : curr.map((q, i) =>
      JSON.stringify(q) === JSON.stringify(prev[i])
        ? prev[i]
        : q
    );
}

function useBagsListImpl (ids?: BN[]): BagInfo[] | undefined {
  const { api } = useApi();
  const [result, setResult] = useState<BagInfo[] | undefined>();
  const query = useCall(ids && ids.length !== 0 && api.query.bagsList.listBags.multi, [ids], multiOptions);

  useEffect((): void => {
    query && setResult((prev) => merge(prev, query));
  }, [query]);

  return result;
}

export default createNamedHook('useBagsList', useBagsListImpl);
