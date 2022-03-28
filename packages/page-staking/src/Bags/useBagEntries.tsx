// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Option } from '@polkadot/types';
import type { AccountId32 } from '@polkadot/types/interfaces';
import type { PalletBagsListListNode } from '@polkadot/types/lookup';

import { useEffect, useState } from 'react';

import { createNamedHook, useApi, useCall } from '@polkadot/react-hooks';

function useBagEntriesImpl (headId: AccountId32 | null): AccountId32[] {
  const { api } = useApi();
  const [[currId, entries], setCurrent] = useState<[AccountId32 | null, AccountId32[]]>([null, []]);
  const node = useCall<Option<PalletBagsListListNode>>(!!currId && api.query.bagsList.listNodes, [currId]);

  useEffect(
    (): void => {
      setCurrent(
        headId
          ? [headId, [headId]]
          : [null, []]
      );
    },
    [headId]
  );

  useEffect((): void => {
    if (node && node.isSome) {
      const { next } = node.unwrap();

      if (next.isSome) {
        const currId = next.unwrap();

        setCurrent(([, entries]) => [currId, [...entries, currId]]);
      }
    }
  }, [node]);

  return entries;
}

export default createNamedHook('useBagEntries', useBagEntriesImpl);
