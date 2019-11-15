// Copyright 2017-2019 @polkadot/react-hooks authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { useEffect, useRef, useState } from 'react';
import { isNull, isUndefined } from '@polkadot/util';

type Params = [] | [any] | [any, any] | [any, any, any];

interface Options <T> {
  transform?: (value: any) => T;
}

interface TrackFnCallback <T> {
  (value: T): void;
}

type Unsub = () => void;

interface TrackFn <T> {
  (cb: TrackFnCallback<T>): Promise<Unsub>;
  (a: any, cb: TrackFnCallback<T>): Promise<Unsub>;
  (a: any, b: any, cb: TrackFnCallback<T>): Promise<Unsub>;
  (a: any, b: any, c: any, cb: TrackFnCallback<T>): Promise<Unsub>;
}

const NOOP_SUBSCRIBE = Promise.resolve((): void => {});
const IDENTITY_TRANSFORM = (value: any): any => value;

function checkParams (params: Params): [boolean, string] {
  return [
    params.length === 0 || !params.some((param): boolean => isNull(param) || isUndefined(null)),
    JSON.stringify({ a: params })
  ];
}

// tracks a stream, typically an api.* call that
//  - returns a promise with an unsubscription
//  - has a callback to set the value
export default function trackStream <T> (fn: TrackFn<T> | undefined, params: Params, { transform = IDENTITY_TRANSFORM }: Options<T> = {}): T | undefined {
  const [value, setValue] = useState<T | undefined>();
  const tracker = useRef<{ serialized: string | null; subscriber: Promise<Unsub> }>({ serialized: null, subscriber: NOOP_SUBSCRIBE });

  const _subscribe = (params: Params): void => {
    tracker.current.subscriber = fn
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore We tried to get the typings right, close but no cigar...
      ? fn(...params, (value: any): T => setValue(transform(value)))
      : NOOP_SUBSCRIBE;
  };
  const _unsubscribe = (): void => {
    tracker.current.subscriber.then((fn): void => fn());
  };

  // initial round, subscribe once
  useEffect((): () => void => {
    const [hasValues, serialized] = checkParams(params);

    tracker.current.serialized = serialized;

    if (hasValues) {
      _subscribe(params);
    }

    return _unsubscribe;
  }, []);

  // on changes, re-subscribe
  useEffect((): void => {
    const [hasValues, serialized] = checkParams(params);

    if (hasValues && serialized !== tracker.current.serialized) {
      tracker.current.serialized = serialized;
      _unsubscribe();
      _subscribe(params);
    }
  }, [params]);

  return value;
}
