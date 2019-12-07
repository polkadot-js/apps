// Copyright 2017-2019 @polkadot/react-hooks authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Options, Param, Params } from './types';

import { useEffect, useRef, useState } from 'react';

import { extractParams, transformIdentity } from './util';

interface TrackFn <T> {
  (a: Param, b: Param, c: Param): Promise<T>;
  (a: Param, b: Param): Promise<T>;
  (a: Param): Promise<T>;
  (): Promise<T>;
}

// tracks a promise, typically an api.* call (query, query.at, rpc) that
//  - returns a promise with the value
// FIXME The typings here need some serious TLC
export default function usePromise <T> (fn: TrackFn<T> | undefined, params: Params, { defaultValue, paramMap = transformIdentity, transform = transformIdentity }: Options<T> = {}): T | undefined {
  const [value, setValue] = useState<T | undefined>(defaultValue);
  const tracker = useRef<{ serialized: string | null }>({ serialized: null });

  const _subscribe = (params: Params): void => {
    setImmediate((): void => {
      if (fn) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore We tried to get the typings right, close but no cigar...
        fn(...params).then((value: any): void => setValue(transform(value)));
      }
    });
  };

  // on changes, re-get
  useEffect((): void => {
    if (fn) {
      const [serialized, mappedParams] = extractParams(fn, params, paramMap);

      if (mappedParams && serialized !== tracker.current.serialized) {
        tracker.current.serialized = serialized;

        _subscribe(mappedParams);
      }
    }
  }, [fn, params]);

  return value;
}
