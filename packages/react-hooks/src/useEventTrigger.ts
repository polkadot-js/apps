// Copyright 2017-2022 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AugmentedEvent } from '@polkadot/api/types';
import type { Vec } from '@polkadot/types';
import type { EventRecord } from '@polkadot/types/interfaces';

import { useEffect, useState } from 'react';

import { createNamedHook } from './createNamedHook';
import { useApi } from './useApi';
import { useCall } from './useCall';
import { useIsMountedRef } from './useIsMountedRef';

type EventCheck = AugmentedEvent<'promise'> | false | undefined | null;

interface Result {
  blockHash: string;
  events: EventRecord[];
}

const EMPTY_RESULT: Result = {
  blockHash: '',
  events: []
};

const IDENTITY_FILTER = () => true;

function useEventTriggerImpl (_checks: EventCheck[], filter: (record: EventRecord) => boolean = IDENTITY_FILTER): Result {
  const { api } = useApi();
  const [state, setState] = useState(() => EMPTY_RESULT);
  const [checks] = useState(() => _checks);
  const mountedRef = useIsMountedRef();
  const eventRecords = useCall<Vec<EventRecord>>(api.query.system.events);

  useEffect((): void => {
    if (mountedRef.current && eventRecords) {
      const events = eventRecords.filter((r) =>
        r.event &&
        checks.some((c) => c && c.is(r.event)) &&
        filter(r)
      );

      if (events.length) {
        setState({
          blockHash: eventRecords.createdAtHash?.toHex() || '',
          events
        });
      }
    }
  }, [eventRecords, checks, filter, mountedRef]);

  return state;
}

export const useEventTrigger = createNamedHook('useEventTrigger', useEventTriggerImpl);
