// Copyright 2017-2019 @polkadot/react-hooks authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Arg, Options, Params } from './types';

import { useEffect, useRef, useState } from 'react';

import { extractParams, transformIdentity } from './util';

interface TrackFn <T> {
  (a: Arg, b: Arg, c: Arg): Promise<T>;
  (a: Arg, b: Arg): Promise<T>;
  (a: Arg): Promise<T>;
  (): Promise<T>;
}

// tracks a promise, typically an api.* call that
//  - returns a promise with the value
// FIXME The typings here need some serious TLC
export default function trackPromise <T> (fn: TrackFn<T> | undefined, params: any, { paramMap = transformIdentity, transform = transformIdentity }: Options<T> = {}): T | undefined {
  const [value, setValue] = useState<T | undefined>();
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

  // initial round, subscribe once
  useEffect((): void => {
    const [serialized, mappedParams] = extractParams(params, paramMap);

    tracker.current.serialized = serialized;

    if (mappedParams) {
      _subscribe(mappedParams);
    }
  }, []);

  // on changes, re-get
  useEffect((): void => {
    const [serialized, mappedParams] = extractParams(params, paramMap);

    if (mappedParams && serialized !== tracker.current.serialized) {
      tracker.current.serialized = serialized;

      _subscribe(mappedParams);
    }
  }, [params]);

  return value;
}
