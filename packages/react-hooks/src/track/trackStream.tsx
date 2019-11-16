// Copyright 2017-2019 @polkadot/react-hooks authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Options, Params } from './types';

import { useEffect, useRef, useState } from 'react';

import { dummyPromise, extractParams, transformIdentity } from './util';

interface TrackFnCallback <T> {
  (value: T): void;
}

type Unsub = () => void;

interface TrackFn <T> {
  (a: any, b: any, c: any, cb: TrackFnCallback<T>): Promise<Unsub>;
  (a: any, b: any, cb: TrackFnCallback<T>): Promise<Unsub>;
  (a: any, cb: TrackFnCallback<T>): Promise<Unsub>;
  (cb: TrackFnCallback<T>): Promise<Unsub>;
}

// tracks a stream, typically an api.* call that
//  - returns a promise with an unsubscription
//  - has a callback to set the value
// FIXME The typings here need some serious TLC
export default function trackStream <T> (fn: TrackFn<any> | undefined, params: any, { paramMap = transformIdentity, transform = transformIdentity }: Options<T> = {}): T | undefined {
  const [value, setValue] = useState<T | undefined>();
  const tracker = useRef<{ serialized: string | null; subscriber: Promise<Unsub> }>({ serialized: null, subscriber: dummyPromise });

  const _unsubscribe = (): void => {
    tracker.current.subscriber.then((fn): void => fn());
    tracker.current.subscriber = dummyPromise;
  };
  const _subscribe = (params: Params): void => {
    _unsubscribe();

    setImmediate((): void => {
      tracker.current.subscriber = fn
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore We tried to get the typings right, close but no cigar...
        ? fn(...params, (value: any): void => setValue(transform(value)))
        : dummyPromise;
    });
  };

  // initial round, subscribe once
  useEffect((): () => void => {
    const [serialized, mappedParams] = extractParams(params, paramMap);

    tracker.current.serialized = serialized;

    if (mappedParams) {
      _subscribe(mappedParams);
    }

    return _unsubscribe;
  }, []);

  // on changes, re-subscribe
  useEffect((): void => {
    const [serialized, mappedParams] = extractParams(params, paramMap);

    if (mappedParams && serialized !== tracker.current.serialized) {
      tracker.current.serialized = serialized;

      _subscribe(mappedParams);
    }
  }, [params]);

  return value;
}
