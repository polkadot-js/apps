// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Option } from '@polkadot/types';
import type { PalletBagsListListNode } from '@polkadot/types/lookup';
import type { StashNode } from './types';

import { createNamedHook, useApi, useCall } from '@polkadot/react-hooks';

type Result = Record<string, StashNode[]>;

const multiOptions = {
  defaultValue: {} as Result,
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

function useBagsNodesImpl (stashIds: string[]): Result {
  const { api } = useApi();

  return useCall(stashIds && stashIds.length !== 0 && api.query.bagsList.listNodes.multi, [stashIds], multiOptions) as Result;
}

export default createNamedHook('useBagsNodes', useBagsNodesImpl);
