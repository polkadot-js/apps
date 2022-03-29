// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Option } from '@polkadot/types';
import type { AccountId32 } from '@polkadot/types/interfaces';
import type { PalletBagsListListNode } from '@polkadot/types/lookup';

import { useEffect, useState } from 'react';

import { createNamedHook, useApi, useCall } from '@polkadot/react-hooks';

interface Result {
  isCompleted: boolean;
  list: AccountId32[];
}

const EMPTY: [AccountId32 | null, Result] = [null, { isCompleted: false, list: [] }];

function useBagEntriesImpl (headId: AccountId32 | null, trigger: number): Result {
  const { api } = useApi();
  const [[currId, result], setCurrent] = useState<[AccountId32 | null, Result]>(EMPTY);
  const node = useCall<Option<PalletBagsListListNode>>(!!currId && api.query.bagsList.listNodes, [currId]);

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

  return result;
}

export default createNamedHook('useBagEntries', useBagEntriesImpl);
