// Copyright 2017-2022 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useEffect, useState } from 'react';

import { stringify } from '@polkadot/util';

interface State<T> {
  stringified: string;
  value: T;
}

// NOTE: Generic, cannot be used in named hook
export function useValueMemo <T> (value: T): T {
  const [state, setState] = useState<State<T>>(() => ({
    stringified: stringify({ value }),
    value
  }));

  useEffect(() => {
    setState((prev) => {
      if (prev.value !== value) {
        const stringified = stringify({ value });

        if (prev.stringified !== stringified) {
          return { stringified, value };
        }
      }

      return prev;
    });
  }, [value]);

  return state.value;
}
