// Copyright 2017-2025 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Option } from '@polkadot/types';
import type { PalletBagsListListNode } from '@polkadot/types/lookup';
import type { BagMap } from './types.js';

import { useEffect, useState } from 'react';

import { createNamedHook, useCall } from '@polkadot/react-hooks';

import useQueryModule from './useQueryModule.js';

const MULTI_OPTS = {
  transform: (opts: Option<PalletBagsListListNode>[]): BagMap =>
    opts
      .filter((o) => o.isSome)
      .map((o): PalletBagsListListNode => o.unwrap())
      .reduce((all: BagMap, node): BagMap => {
        const id = node.bagUpper.toString();

        if (!all[id]) {
          all[id] = [];
        }

        all[id].push({ node, stashId: node.id.toString() });

        return all;
      }, {})
};

function merge (prev: BagMap | undefined, curr: BagMap): BagMap {
  return Object
    .entries(curr)
    .reduce((all: BagMap, [id, nodes]): BagMap => {
      all[id] = prev?.[id] && JSON.stringify(nodes) === JSON.stringify(prev[id])
        ? prev[id]
        : nodes;

      return all;
    }, {});
}

function useBagsNodesImpl (stashIds: string[]): BagMap | undefined {
  const mod = useQueryModule();
  const [result, setResult] = useState<BagMap | undefined>();
  const query = useCall(mod.listNodes.multi, [stashIds], MULTI_OPTS);

  useEffect((): void => {
    query && setResult((prev) => merge(prev, query));
  }, [query]);

  return result;
}

export default createNamedHook('useBagsNodes', useBagsNodesImpl);
