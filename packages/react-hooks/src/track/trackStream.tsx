// Copyright 2017-2019 @polkadot/react-hooks authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Codec } from '@polkadot/types/types';
import { Options, Param, Params } from './types';

import { useEffect, useRef, useState } from 'react';
import { isUndefined } from '@polkadot/util';

import { dummyPromise, extractParams, transformIdentity } from './util';

interface TrackFnCallback {
  (value: Codec): void;
}

type TrackFnResult = Promise<() => void>;

interface TrackFn {
  (a: Param, b: Param, c: Param, cb: TrackFnCallback): TrackFnResult;
  (a: Param, b: Param, cb: TrackFnCallback): TrackFnResult;
  (a: Param, cb: TrackFnCallback): TrackFnResult;
  (cb: TrackFnCallback): TrackFnResult;
  meta?: {
    type: {
      isDoubleMap: boolean;
    };
  };
}

// tracks a stream, typically an api.* call (derive, rpc, query) that
//  - returns a promise with an unsubscribe function
//  - has a callback to set the value
// FIXME The typings here need some serious TLC
export default function trackStream <T> (fn: TrackFn | undefined, params: Params, { paramMap = transformIdentity, transform = transformIdentity }: Options<T> = {}): T | undefined {
  const [value, setValue] = useState<T | undefined>();
  const tracker = useRef<{ serialized: string | null; subscriber: TrackFnResult }>({ serialized: null, subscriber: dummyPromise });

  const _unsubscribe = (): void => {
    tracker.current.subscriber.then((fn): void => fn());
    tracker.current.subscriber = dummyPromise;
  };
  const _subscribe = (params: Params): void => {
    const validParams = params.filter((p): boolean => !isUndefined(p));

    _unsubscribe();

    setImmediate((): void => {
      tracker.current.subscriber = fn && (!fn.meta || !fn.meta.type?.isDoubleMap || validParams.length === 2)
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore We tried to get the typings right, close but no cigar...
        ? fn(...params, (value: any): void => setValue(transform(value)))
        : dummyPromise;
    });
  };

  // initial round, subscribe once
  useEffect((): () => void => {
    const [serialized, mappedParams] = extractParams(fn, params, paramMap);

    tracker.current.serialized = serialized;

    if (mappedParams) {
      _subscribe(mappedParams);
    }

    return _unsubscribe;
  }, []);

  // on changes, re-subscribe
  useEffect((): void => {
    const [serialized, mappedParams] = extractParams(fn, params, paramMap);

    if (mappedParams && serialized !== tracker.current.serialized) {
      tracker.current.serialized = serialized;

      _subscribe(mappedParams);
    }
  }, [fn, params]);

  return value;
}
