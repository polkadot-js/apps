// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Option } from '@polkadot/types';
import type { PalletBagsListListNode } from '@polkadot/types/lookup';
import type { StashNode } from './types';

import { useEffect, useState } from 'react';

import { createNamedHook, useApi, useCall } from '@polkadot/react-hooks';

type Result = Record<string, StashNode[]>;

const multiOptions = {
  transform: (opts: Option<PalletBagsListListNode>[]): Result =>
    opts
      .filter((o) => o.isSome)
      .map((o): PalletBagsListListNode => o.unwrap())
      .reduce((all: Result, node): Result => {
        const id = node.bagUpper.toString();

        if (!all[id]) {
          all[id] = [];
        }

        all[id].push({ node, stashId: node.id.toString() });

        return all;
      }, {})
};

function merge (prev: Result, curr: Result): Result {
  return Object
    .entries(curr)
    .reduce((all: Result, [id, nodes]): Result => {
      all[id] = prev[id] && JSON.stringify(nodes) === JSON.stringify(prev[id])
        ? prev[id]
        : nodes;

      return all;
    }, {});
}

function useBagsNodesImpl (stashIds: string[]): Result {
  const { api } = useApi();
  const [result, setResult] = useState<Result>({});
  const query = useCall(stashIds && stashIds.length !== 0 && api.query.bagsList.listNodes.multi, [stashIds], multiOptions);

  useEffect((): void => {
    query && setResult((prev) => merge(prev, query));
  }, [query]);

  return result;
}

export default createNamedHook('useBagsNodes', useBagsNodesImpl);
