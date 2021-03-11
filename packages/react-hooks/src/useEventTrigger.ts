// Copyright 2017-2021 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AugmentedEvent } from '@polkadot/api/types';
import type { Vec } from '@polkadot/types';
import type { EventRecord } from '@polkadot/types/interfaces';

import { useEffect, useState } from 'react';

import { isString } from '@polkadot/util';

import { useApi } from './useApi';
import { useCall } from './useCall';
import { useIsMountedRef } from './useIsMountedRef';

type EventCheck = AugmentedEvent<'promise'> | string | false | undefined | null;

export function useEventTrigger (checks: EventCheck[]): string {
  const { api } = useApi();
  const [trigger, setTrigger] = useState('0x00');
  const mountedRef = useIsMountedRef();
  const eventRecords = useCall<Vec<EventRecord>>(api.query.system.events);

  useEffect((): void => {
    mountedRef.current && eventRecords && eventRecords.filter(({ event }) =>
      event && checks.some((check) => check && (
        isString(check)
          ? event.section === check
          : check.is(event)
      ))
    ).length && setTrigger(() => eventRecords.createdAtHash?.toHex() || '0x00');
  }, [eventRecords, checks, mountedRef]);

  return trigger;
}
