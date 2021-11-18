// Copyright 2017-2021 @polkadot/react-query authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { Vec } from '@polkadot/types';
import type { EventRecord } from '@polkadot/types/interfaces';
import type { IndexedEvent, KeyedEvent } from './types';

import React, { useEffect, useRef, useState } from 'react';

import { useApi, useCall } from '@polkadot/react-hooks';
import { stringify, stringToU8a } from '@polkadot/util';
import { xxhashAsHex } from '@polkadot/util-crypto';

interface Events {
  eventCount: number;
  events: KeyedEvent[];
}

interface Props {
  children: React.ReactNode;
}

interface PrevHashes {
  block: string | null;
  event: string | null;
}

const DEFAULT_EVENTS: Events = { eventCount: 0, events: [] };
const MAX_EVENTS = 75;

const EventsContext: React.Context<Events> = React.createContext<Events>(DEFAULT_EVENTS);

async function manageEvents (api: ApiPromise, prev: PrevHashes, records: Vec<EventRecord>, setState: React.Dispatch<React.SetStateAction<Events>>): Promise<void> {
  const newEvents: IndexedEvent[] = records
    .map((record, index) => ({ indexes: [index], record }))
    .filter(({ record: { event: { method, section } } }) =>
      section !== 'system' &&
      (!['balances', 'treasury'].includes(section) || !['Deposit'].includes(method)) &&
      (!['parasInclusion', 'inclusion'].includes(section) || !['CandidateBacked', 'CandidateIncluded'].includes(method))
    )
    .reduce((combined: IndexedEvent[], e): IndexedEvent[] => {
      const prev = combined.find(({ record: { event: { method, section } } }) =>
        e.record.event.section === section &&
        e.record.event.method === method
      );

      if (prev) {
        prev.indexes.push(...e.indexes);
      } else {
        combined.push(e);
      }

      return combined;
    }, [])
    .reverse();
  const newEventHash = xxhashAsHex(stringToU8a(stringify(newEvents)));

  if (newEventHash !== prev.event && newEvents.length) {
    prev.event = newEventHash;

    // retrieve the last header, this will map to the current state
    const header = await api.rpc.chain.getHeader(records.createdAtHash);
    const blockNumber = header.number.unwrap();
    const blockHash = header.hash.toHex();

    if (blockHash !== prev.block) {
      prev.block = blockHash;

      setState(({ events }) => ({
        eventCount: records.length,
        events: [
          ...newEvents.map(({ indexes, record }): KeyedEvent => ({
            blockHash,
            blockNumber,
            indexes,
            key: `${blockNumber.toNumber()}-${blockHash}-${indexes.join('.')}`,
            record
          })),
          // remove all events for the previous same-height blockNumber
          ...events.filter((p) => !p.blockNumber?.eq(blockNumber))
        ].slice(0, MAX_EVENTS)
      }));
    }
  } else {
    setState(({ events }) => ({
      eventCount: records.length,
      events
    }));
  }
}

function EventsBase ({ children }: Props): React.ReactElement<Props> {
  const { api, isApiReady } = useApi();
  const [state, setState] = useState<Events>(DEFAULT_EVENTS);
  const records = useCall<Vec<EventRecord>>(isApiReady && api.query.system.events);
  const prevHashes = useRef({ block: null, event: null });

  useEffect((): void => {
    records && manageEvents(api, prevHashes.current, records, setState).catch(console.error);
  }, [api, prevHashes, records, setState]);

  return (
    <EventsContext.Provider value={state}>
      {children}
    </EventsContext.Provider>
  );
}

const Events = React.memo(EventsBase);

export { EventsContext, Events };
