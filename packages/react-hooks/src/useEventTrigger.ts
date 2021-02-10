// Copyright 2017-2021 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AugmentedEvent } from '@polkadot/api/types';
import type { EventRecord } from '@polkadot/types/interfaces';

import { useEffect, useState } from 'react';

import { isString } from '@polkadot/util';

import { useApi } from './useApi';
import { useCall } from './useCall';
import { useIsMountedRef } from './useIsMountedRef';

type EventCheck = AugmentedEvent<'promise'> | string | false | undefined | null;

export function useEventTrigger (events: EventCheck[]): number {
  const { api } = useApi();
  const [trigger, setTrigger] = useState(() => Date.now());
  const mountedRef = useIsMountedRef();
  const eventRecords = useCall<EventRecord[]>(api.query.system.events);

  useEffect((): void => {
    const count = eventRecords && eventRecords.filter(({ event, phase }) =>
      event && phase?.isApplyExtrinsic &&
      events.some((check) => check && (
        isString(check)
          ? event.section === check
          : check.is(event)
      ))
    ).length;

    mountedRef.current && count && setTrigger(Date.now());
  }, [eventRecords, events, mountedRef]);

  return trigger;
}
