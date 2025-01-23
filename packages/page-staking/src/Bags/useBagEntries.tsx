// Copyright 2017-2025 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Option } from '@polkadot/types';
import type { AccountId32 } from '@polkadot/types/interfaces';
import type { PalletBagsListListNode } from '@polkadot/types/lookup';

import { useEffect, useState } from 'react';

import { createNamedHook, useCall } from '@polkadot/react-hooks';

import useQueryModule from './useQueryModule.js';

interface Result {
  isCompleted: boolean;
  list: AccountId32[];
}

const EMPTY: [AccountId32 | null, Result] = [null, { isCompleted: false, list: [] }];
const EMPTY_LIST: AccountId32[] = [];

function useBagEntriesImpl (headId: AccountId32 | null, trigger: number): [boolean, AccountId32[]] {
  const mod = useQueryModule();
  const [[currId, { isCompleted, list }], setCurrent] = useState<[AccountId32 | null, Result]>(EMPTY);
  const node = useCall<Option<PalletBagsListListNode>>(!!currId && mod.listNodes, [currId]);

  useEffect(
    () => setCurrent(
      headId && trigger
        ? [headId, { isCompleted: false, list: [headId] }]
        : [null, { isCompleted: true, list: [] }]
    ),
    [headId, trigger]
  );

  useEffect((): void => {
    if (node && node.isSome) {
      const { next } = node.unwrap();

      if (next.isSome) {
        const currId = next.unwrap();

        setCurrent(([, { list }]) => [currId, { isCompleted: false, list: [...list, currId] }]);
      } else {
        setCurrent(([currId, { list }]) => [currId, { isCompleted: true, list }]);
      }
    }
  }, [node]);

  return [
    isCompleted,
    isCompleted
      ? list
      : EMPTY_LIST
  ];
}

export default createNamedHook('useBagEntries', useBagEntriesImpl);
