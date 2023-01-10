// Copyright 2017-2023 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { PromiseResult, QueryableStorageEntry } from '@polkadot/api/types';
import type { StorageEntryTypeLatest } from '@polkadot/types/interfaces';
import type { AnyFunction, Codec } from '@polkadot/types/types';
import type { CallOptions, CallParam, CallParams } from './types';
import type { MountedRef } from './useIsMountedRef';

import { useEffect, useRef, useState } from 'react';

import { isFunction, isNull, isUndefined, nextTick } from '@polkadot/util';

import { useApi } from './useApi';
import { useIsMountedRef } from './useIsMountedRef';
import { useMemoValue } from './useMemoValue';

type VoidFn = () => void;

// This should be VoidFn, however the API actually does allow us to use any general single-shot queries with
// a result callback, so `api.query.system.account.at(<blockHash>, <account>, (info) => {... })` does work
// (The same applies to e.g. keys or entries). So where we actually use the unsub, we cast `unknown` to `VoidFn`
// to cater for our usecase.
type TrackFnResult = Promise<unknown>;

interface QueryTrackFn {
  (...params: CallParam[]): TrackFnResult;
  meta?: {
    type?: StorageEntryTypeLatest;
  };
}

interface QueryMapFn extends QueryTrackFn {
  meta: {
    type: StorageEntryTypeLatest;
  };
}

type QueryFn =
  QueryableStorageEntry<'promise', []> |
  QueryableStorageEntry<'promise', []>['entries'] |
  QueryableStorageEntry<'promise', []>['keys'] |
  QueryableStorageEntry<'promise', []>['multi'];

type CallFn = (...params: unknown[]) => Promise<VoidFn>;

export type TrackFn = PromiseResult<AnyFunction> | QueryFn;

export interface Tracker {
  error: Error | null;
  isActive: boolean;
  subscriber: TrackFnResult | null;
  type: 'useCall' | 'useCallMulti';
}

// the default transform, just returns what we have
export function transformIdentity <T> (value: unknown): T {
  return value as T;
}

const EMPTY_PARAMS: unknown[] = [];

function isMapFn (fn: unknown): fn is QueryMapFn {
  return !!(fn as QueryTrackFn).meta?.type?.isMap;
}

function isQuery (fn: unknown): fn is QueryableStorageEntry<'promise', []> {
  return !!fn && !isUndefined((fn as QueryableStorageEntry<'promise', []>).creator);
}

function extractParams <T> (params: unknown[], { paramMap = transformIdentity }: CallOptions<T> = {}): CallParams | null {
  return params.length === 0 || !params.some((param) => isNull(param) || isUndefined(param))
    ? paramMap(params)
    : null;
}

export function handleError (error: Error, tracker: React.MutableRefObject<Tracker>, fn?: unknown): void {
  console.error(
    tracker.current.error = new Error(`${tracker.current.type}(${
      isQuery(fn)
        ? `${fn.creator.section}.${fn.creator.method}`
        : '...'
    }):: ${error.message}:: ${error.stack || '<unknown>'}`)
  );
}

// unsubscribe and remove from  the tracker
export function unsubscribe (tracker: React.MutableRefObject<Tracker>): void {
  tracker.current.isActive = false;

  if (tracker.current.subscriber) {
    tracker.current.subscriber
      .then((u) => isFunction(u) && (u as VoidFn)())
      .catch((e) => handleError(e as Error, tracker));
    tracker.current.subscriber = null;
  }
}

// subscribe, trying to play nice with the browser threads
function subscribe <T> (api: ApiPromise, mountedRef: MountedRef, tracker: React.MutableRefObject<Tracker>, fn: TrackFn | undefined, params: CallParams, setValue: (value: any) => void, { transform = transformIdentity, withParams, withParamsTransform }: CallOptions<T> = {}): void {
  const validParams = params.filter((p) => !isUndefined(p));

  unsubscribe(tracker);

  nextTick((): void => {
    if (mountedRef.current) {
      const canQuery = !!fn && (
        isMapFn(fn)
          ? fn.meta.type.asMap.hashers.length === validParams.length
          : true
      );

      if (canQuery) {
        // swap to active mode
        tracker.current.isActive = true;
        tracker.current.subscriber = (fn as CallFn)(...params, (value: Codec): void => {
          // we use the isActive flag here since .subscriber may not be set on immediate callback)
          if (mountedRef.current && tracker.current.isActive) {
            try {
              setValue(
                withParams
                  ? [params, transform(value, api)]
                  : withParamsTransform
                    ? transform([params, value], api)
                    : transform(value, api)
              );
            } catch (error) {
              handleError(error as Error, tracker, fn);
            }
          }
        }).catch((error) => handleError(error as Error, tracker, fn));
      } else {
        tracker.current.subscriber = null;
      }
    }
  });
}

export function throwOnError (tracker: Tracker): void {
  if (tracker.error) {
    const error = tracker.error;

    tracker.error = null;

    throw error;
  }
}

// tracks a stream, typically an api.* call (derive, rpc, query) that
//  - returns a promise with an unsubscribe function
//  - has a callback to set the value
// FIXME The typings here need some serious TLC
// FIXME This is generic, we cannot really use createNamedHook
export function useCall <T> (fn: TrackFn | undefined | null | false, params?: CallParams | null, options?: CallOptions<T>): T | undefined {
  const { api } = useApi();
  const mountedRef = useIsMountedRef();
  const tracker = useRef<Tracker>({ error: null, isActive: false, subscriber: null, type: 'useCall' });
  const [value, setValue] = useState<T | undefined>((options || {}).defaultValue);
  const memoParams = useMemoValue(params);

  // initial effect, we need an un-subscription
  useEffect((): () => void => {
    return () => unsubscribe(tracker);
  }, []);

  // on changes, re-subscribe
  useEffect((): void => {
    // check if we have a function & that we are mounted
    if (mountedRef.current && fn) {
      const mappedParams = extractParams(memoParams || EMPTY_PARAMS, options);

      if (mappedParams) {
        subscribe(api, mountedRef, tracker, fn, mappedParams, setValue, options);
      }
    }
  }, [api, fn, options, mountedRef, memoParams]);

  // throwOnError(tracker.current);

  return value;
}
