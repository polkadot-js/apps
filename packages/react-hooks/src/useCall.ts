// Copyright 2017-2021 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { RpcPromiseResult } from '@polkadot/api/types';
import type { AnyFunction, Codec } from '@polkadot/types/types';
import type { CallOptions, CallParam, CallParams } from './types';
import type { MountedRef } from './useIsMountedRef';

import { useEffect, useRef, useState } from 'react';

import { isNull, isUndefined } from '@polkadot/util';

import { useIsMountedRef } from './useIsMountedRef';

type VoidFn = () => void;

// This should be VoidFn, however the API actually does allow us to use any general single-shot queries with
// a result callback, so `api.query.system.account.at(<blokHash>, <account>, (info) => {... })` does work
// (The same applies to e.g. keys or entries). So where we actally use the unsub, we cast `unknown` to `VoidFn`
// to cater for our usecase.
type TrackFnResult = Promise<unknown>;

interface QueryTrackFn {
  (...params: CallParam[]): TrackFnResult;
  meta?: {
    type?: {
      isDoubleMap: boolean;
    };
  };
}

type TrackFn = RpcPromiseResult<AnyFunction> | QueryTrackFn;

export interface Tracker {
  isActive: boolean;
  serialized: string | null;
  subscriber: TrackFnResult | null;
}

interface TrackerRef {
  current: Tracker;
}

// the default transform, just returns what we have
export function transformIdentity <T> (value: unknown): T {
  return value as T;
}

// extract the serialized and mapped params, all ready for use in our call
function extractParams <T> (fn: unknown, params: unknown[], { paramMap = transformIdentity }: CallOptions<T> = {}): [string, CallParams | null] {
  return [
    JSON.stringify({ f: (fn as { name: string })?.name, p: params }),
    params.length === 0 || !params.some((param) => isNull(param) || isUndefined(param))
      ? paramMap(params)
      : null
  ];
}

// unsubscribe and remove from  the tracker
export function unsubscribe (tracker: TrackerRef): void {
  tracker.current.isActive = false;

  if (tracker.current.subscriber) {
    tracker.current.subscriber.then((unsubFn) => (unsubFn as VoidFn)()).catch(console.error);
    tracker.current.subscriber = null;
  }
}

// subscribe, trying to play nice with the browser threads
function subscribe <T> (mountedRef: MountedRef, tracker: TrackerRef, fn: TrackFn | undefined, params: CallParams, setValue: (value: T) => void, { transform = transformIdentity, withParams, withParamsTransform }: CallOptions<T> = {}): void {
  const validParams = params.filter((p) => !isUndefined(p));

  unsubscribe(tracker);

  setTimeout((): void => {
    if (mountedRef.current) {
      // FIXME NMap support
      if (fn && (!(fn as QueryTrackFn).meta?.type?.isDoubleMap || validParams.length === 2)) {
        // swap to active mode
        tracker.current.isActive = true;

        tracker.current.subscriber = (fn as (...params: unknown[]) => Promise<VoidFn>)(...params, (value: Codec): void => {
          // we use the isActive flag here since .subscriber may not be set on immediate callback)
          if (mountedRef.current && tracker.current.isActive) {
            mountedRef.current && tracker.current.isActive && setValue(
              withParams
                ? [params, transform(value)] as any
                : withParamsTransform
                  ? transform([params, value])
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
export function useCall <T> (fn: TrackFn | undefined | null | false, params?: CallParams | null, options?: CallOptions<T>): T | undefined {
  const mountedRef = useIsMountedRef();
  const tracker = useRef<Tracker>({ isActive: false, serialized: null, subscriber: null });
  const [value, setValue] = useState<T | undefined>((options || {}).defaultValue);

  // initial effect, we need an un-subscription
  useEffect((): () => void => {
    return () => unsubscribe(tracker);
  }, []);

  // on changes, re-subscribe
  useEffect((): void => {
    // check if we have a function & that we are mounted
    if (mountedRef.current && fn) {
      const [serialized, mappedParams] = extractParams(fn, params || [], options);

      if (mappedParams && serialized !== tracker.current.serialized) {
        tracker.current.serialized = serialized;

        subscribe(mountedRef, tracker, fn, mappedParams, setValue, options);
      }
    }
  }, [fn, options, mountedRef, params]);

  return value;
}
