// Copyright 2017-2025 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { EventRecord } from '@polkadot/types/interfaces';
import type { Codec } from '@polkadot/types/types';
import type { BN } from '@polkadot/util';
import type { EventCheck } from './useEventTrigger.js';

import { useEffect, useState } from 'react';

import { isFunction } from '@polkadot/util';

import { useApi } from './useApi.js';
import { useEventTrigger } from './useEventTrigger.js';
import { useMemoValue } from './useMemoValue.js';

export interface Changes<T extends Codec> {
  added?: T[];
  removed?: T[];
}

function interleave <T extends Codec> (existing: T[] = [], { added = [], removed = [] }: Changes<T>): T[] {
  if (!added.length && !removed.length) {
    return existing;
  }

  const map: Record<string, T> = {};

  [existing, added].forEach((m) =>
    m.forEach((v): void => {
      map[v.toHex()] = v;
    })
  );

  removed.forEach((v): void => {
    delete map[v.toHex()];
  });

  const adjusted = Object
    .entries(map)
    .sort((a, b) =>
      // for BN-like objects, we use the built-in compare for sorting
      isFunction((a[1] as unknown as BN).cmp)
        ? (a[1] as unknown as BN).cmp(b[1] as unknown as BN)
        : a[0].localeCompare(b[0])
    )
    .map(([, v]) => v);

  return adjusted.length !== existing.length || adjusted.find((e, i) => !e.eq(existing[i]))
    ? adjusted
    : existing;
}

export function useEventChanges <T extends Codec, A> (checks: EventCheck[], filter: (records: EventRecord[], api: ApiPromise, additional?: A) => Changes<T>, startValue?: T[], additional?: A): T[] | undefined {
  const { api } = useApi();
  const [state, setState] = useState<T[] | undefined>();
  const memoChecks = useMemoValue(checks);
  const { blockHash, events } = useEventTrigger(memoChecks);

  // when startValue changes, we do a full refresh
  useEffect((): void => {
    startValue && setState((prev) => interleave(prev, { added: startValue }));
  }, [startValue]);

  // add/remove any additional items detected (only when actual events occur)
  useEffect((): void => {
    blockHash && setState((prev) => interleave(prev, filter(events, api, additional)));
  }, [additional, api, blockHash, events, filter]);

  return state;
}
