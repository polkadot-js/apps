// Copyright 2017-2021 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { QueryableStorageMultiArg } from '@polkadot/api/types';
import type { Tracker } from './useCall';
import type { MountedRef } from './useIsMountedRef';

import { useEffect, useRef, useState } from 'react';

import { useApi } from './useApi';
import { transformIdentity, unsubscribe } from './useCall';
import { useIsMountedRef } from './useIsMountedRef';

interface TrackerRef {
  current: Tracker;
}

interface CallOptions <T> {
  defaultValue?: T;
  transform?: (value: any) => T;
}

// subscribe, trying to play nice with the browser threads
function subscribe <T> (api: ApiPromise, mountedRef: MountedRef, tracker: TrackerRef, calls: QueryableStorageMultiArg<'promise'>[], setValue: (value: T) => void, { transform = transformIdentity }: CallOptions<T> = {}): void {
  unsubscribe(tracker);

  setTimeout((): void => {
    if (mountedRef.current) {
      const included = calls.map((c) => !!c);
      const filtered = calls.filter((_, index) => included[index]);

      if (filtered.length) {
        // swap to active mode
        tracker.current.isActive = true;

        tracker.current.subscriber = api.queryMulti(filtered, (value): void => {
          // we use the isActive flag here since .subscriber may not be set on immediate callback)
          if (mountedRef.current && tracker.current.isActive) {
            let valueIndex = -1;

            mountedRef.current && tracker.current.isActive && setValue(
              transform(
                calls.map((_, index) => included[index] ? value[++valueIndex] : undefined)
              )
            );
          }
        });
      } else {
        tracker.current.subscriber = null;
      }
    }
  }, 0);
}

// very much copied from useCall
export function useCallMulti <T> (calls?: QueryableStorageMultiArg<'promise'>[] | null | false, options?: CallOptions<T>): T {
  const { api } = useApi();
  const mountedRef = useIsMountedRef();
  const tracker = useRef<Tracker>({ isActive: false, serialized: null, subscriber: null });
  const [value, setValue] = useState<T>((options || {}).defaultValue || [] as unknown as T);

  // initial effect, we need an un-subscription
  useEffect((): () => void => {
    return () => unsubscribe(tracker);
  }, []);

  // on changes, re-subscribe
  useEffect((): void => {
    // check if we have a function & that we are mounted
    if (mountedRef.current && calls) {
      const serialized = JSON.stringify(calls);

      if (serialized !== tracker.current.serialized) {
        tracker.current.serialized = serialized;

        subscribe(api, mountedRef, tracker, calls, setValue, options);
      }
    }
  }, [api, calls, options, mountedRef]);

  return value;
}
