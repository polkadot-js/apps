// Copyright 2017-2021 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AugmentedEvent } from '@polkadot/api/types';
import type { Vec } from '@polkadot/types';
import type { EventRecord } from '@polkadot/types/interfaces';

import { useEffect, useState } from 'react';

import { useApi } from './useApi';
import { useCall } from './useCall';
import { useIsMountedRef } from './useIsMountedRef';

type EventCheck = AugmentedEvent<'promise'> | false | undefined | null;

const IDENTITY_FILTER = () => true;

export function useEventTrigger (checks: EventCheck[], filter: (record: EventRecord) => boolean = IDENTITY_FILTER): string {
  const { api } = useApi();
  const [trigger, setTrigger] = useState('0');
  const mountedRef = useIsMountedRef();
  const eventRecords = useCall<Vec<EventRecord>>(api.query.system.events);

  useEffect((): void => {
    mountedRef.current && eventRecords && eventRecords.filter((r) =>
      r.event &&
      checks.some((c) => c && c.is(r.event)) &&
      filter(r)
    ).length && setTrigger(eventRecords.createdAtHash?.toHex() || '');
  }, [eventRecords, checks, filter, mountedRef]);

  return trigger;
}
