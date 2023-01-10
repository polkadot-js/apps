// Copyright 2017-2023 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useMemo, useRef } from 'react';

import { stringify } from '@polkadot/util';

interface State<T> {
  stringified: string;
  value: T;
}

function isDifferent (a: unknown, b: unknown): boolean {
  // straight match, all ok
  if (a === b) {
    return false;
  } else if (Array.isArray(a) && Array.isArray(b) && a.length === b.length) {
    // check each individual item on matching-length arrays
    // (for each item we also do deep inspection)
    return a.some((ai, i) => isDifferent(ai, b[i]));
  }

  // not equal :(
  return true;
}

/**
 * @internal
 *
 * Checks the supplied value against the previous state, returning either the
 * previous state (if we have a match) or a new object for future compares.
 **/
function getValue <T> (ref: React.MutableRefObject<State<T> | null>, value: T): T {
  let curr = ref.current;

  // check that either we have no previous or the value changed
  if (!curr || isDifferent(curr.value, value)) {
    const stringified = stringify({ value });

    // no previous or the stringified result is different
    if (!curr || curr.stringified !== stringified) {
      curr = { stringified, value };
    }
  }

  if (ref.current !== curr) {
    ref.current = curr;
  }

  return ref.current.value;
}

// NOTE: Generic, cannot be used in named hook
export function useMemoValue <T> (value: T): T {
  const ref = useRef<State<T> | null>(null);

  return useMemo(
    () => getValue(ref, value),
    [ref, value]
  );
}
