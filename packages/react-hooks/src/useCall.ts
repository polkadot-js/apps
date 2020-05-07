// Copyright 2017-2020 @polkadot/react-hooks authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { CallOptions, CallParam, CallParams } from './types';

import { useEffect, useRef, useState } from 'react';
import { isNull, isUndefined } from '@polkadot/util';

import useIsMountedRef, { MountedRef } from './useIsMountedRef';

type TrackFnResult = Promise<() => void>;

interface TrackFn {
  (...params: CallParam[]): TrackFnResult;
  meta?: {
    type: {
      isDoubleMap: boolean;
    };
  };
}

interface Tracker {
  isActive: boolean;
  count: number;
  serialized: string | null;
  subscriber: TrackFnResult | null;
}

interface TrackerRef {
  current: Tracker;
}

// the default transform, just returns what we have
function transformIdentity (value: any): any {
  return value;
}

// extract the serialized and mapped params, all ready for use in our call
function extractParams (fn: any, params: any[], paramMap: (params: any[]) => any): [string, CallParams | null] {
  return [
    JSON.stringify({ f: fn?.name, p: params }),
    params.length === 0 || !params.some((param): boolean => isNull(param) || isUndefined(null))
      ? paramMap(params)
      : null
  ];
}

// unsubscribe and remove from  the tracker
function unsubscribe (tracker: TrackerRef): void {
  tracker.current.isActive = false;

  if (tracker.current.subscriber) {
    tracker.current.subscriber.then((unsubFn): void => unsubFn());
    tracker.current.subscriber = null;
  }
}

// subscribe, trying to play nice with the browser threads
function subscribe <T> (mountedRef: MountedRef, tracker: TrackerRef, fn: TrackFn | undefined, params: CallParams, setValue: (value: T) => void, { isSingle, transform = transformIdentity, withParams }: CallOptions<T>): void {
  const validParams = params.filter((p): boolean => !isUndefined(p));

  unsubscribe(tracker);

  setTimeout((): void => {
    if (mountedRef.current) {
      if (fn && (!fn.meta || !fn.meta.type?.isDoubleMap || validParams.length === 2)) {
        // swap to acive mode and reset our count
        tracker.current.isActive = true;
        tracker.current.count = 0;

        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore We tried to get the typings right, close but no cigar...
        tracker.current.subscriber = fn(...params, (value: any): void => {
          // when we don't have an active sub, or single-shot, ignore (we use the isActive flag here
          // since .subscriber may not be set on immeditae callback)
          if (mountedRef.current && tracker.current.isActive && (!isSingle || !tracker.current.count)) {
            tracker.current.count++;

            mountedRef.current && tracker.current.isActive && setValue(
              withParams
                ? [params, transform(value)] as any
                : transform(value)
            );
          }
        });
      } else {
        tracker.current.subscriber = null;
      }
    }
  }, 0);
}

// tracks a stream, typically an api.* call (derive, rpc, query) that
//  - returns a promise with an unsubscribe function
//  - has a callback to set the value
// FIXME The typings here need some serious TLC
export default function useCall <T> (fn: TrackFn | undefined | null | false, params: CallParams = [], options: CallOptions<T> = {}): T | undefined {
  const mountedRef = useIsMountedRef();
  const tracker = useRef<Tracker>({ count: 0, isActive: false, serialized: null, subscriber: null });
  const [value, setValue] = useState<T | undefined>(options.defaultValue);

  // initial effect, we need an un-subscription
  useEffect((): () => void => {
    return (): void => unsubscribe(tracker);
  }, []);

  // on changes, re-subscribe
  useEffect((): void => {
    // check if we have a function & that we are mounted
    if (mountedRef.current && fn) {
      const [serialized, mappedParams] = extractParams(fn, params, options.paramMap || transformIdentity);

      if (mappedParams && serialized !== tracker.current.serialized) {
        tracker.current.serialized = serialized;

        subscribe(mountedRef, tracker, fn, mappedParams, setValue, options);
      }
    }
  }, [fn, options, mountedRef, params]);

  return value;
}
