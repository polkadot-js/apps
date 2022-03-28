// Copyright 2017-2022 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { EventRecord } from '@polkadot/types/interfaces';
import type { Codec } from '@polkadot/types/types';
import type { BN } from '@polkadot/util';
import type { EventCheck } from './useEventTrigger';

import { useEffect, useState } from 'react';

import { isFunction } from '@polkadot/util';

import { useEventTrigger } from './useEventTrigger';

export interface Changes<T extends Codec> {
  added?: T[];
  removed?: T[];
}

function interleave <T extends Codec> (existing: T[], { added = [], removed = [] }: Changes<T>): T[] {
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

  return Object
    .entries(map)
    .sort((a, b) =>
      // for BN-like objects, we use the built-in compare for sorting
      isFunction((a[1] as unknown as BN).cmp)
        ? (a[1] as unknown as BN).cmp(b[1] as unknown as BN)
        : a[0].localeCompare(b[0])
    )
    .map(([, v]) => v);
}

export function useEventChanges <T extends Codec> (checks: EventCheck[], filter: (records: EventRecord[]) => Changes<T>, startValue?: T[]): T[] {
  const [state, setState] = useState<T[]>([]);
  const { blockHash, events } = useEventTrigger(checks);

  // when startValue changes, we do a full refresh
  useEffect((): void => {
    startValue && setState((prev) => interleave(prev, { added: startValue }));
  }, [startValue]);

  // add/remove any additional items detected (only when actual events occur)
  useEffect((): void => {
    blockHash && setState((prev) => interleave(prev, filter(events)));
  }, [blockHash, events, filter]);

  return state;
}
