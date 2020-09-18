// Copyright 2017-2020 @polkadot/react-query authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { IndexedEvent, KeyedEvent } from './types';

import React, { useEffect, useState } from 'react';
import { useApi } from '@polkadot/react-hooks';
import { stringToU8a } from '@polkadot/util';
import { xxhashAsHex } from '@polkadot/util-crypto';

type Events = KeyedEvent[];

interface Props {
  children: React.ReactNode;
}

const MAX_EVENTS = 75;

const EventsContext: React.Context<Events> = React.createContext<Events>([]);

function EventsBase ({ children }: Props): React.ReactElement<Props> {
  const { api } = useApi();
  const [state, setState] = useState<Events>([]);

  useEffect((): void => {
    // No unsub, global context - destroyed on app close
    api.isReady.then((): void => {
      let prevBlockHash: string | null = null;
      let prevEventHash: string | null = null;

      api.query.system.events((records): void => {
        const newEvents: IndexedEvent[] = records
          .map((record, index) => ({ indexes: [index], record }))
          .filter(({ record: { event: { method, section } } }) => section !== 'system' && (method !== 'Deposit' || !['balances', 'treasury'].includes(section)))
          .reduce((combined: IndexedEvent[], e): IndexedEvent[] => {
            const prev = combined.find(({ record: { event: { method, section } } }) => e.record.event.section === section && e.record.event.method === method);

            if (prev) {
              prev.indexes.push(...e.indexes);
            } else {
              combined.push(e);
            }

            return combined;
          }, [])
          .reverse();
        const newEventHash = xxhashAsHex(stringToU8a(JSON.stringify(newEvents)));

        if (newEventHash !== prevEventHash && newEvents.length) {
          prevEventHash = newEventHash;

          // retrieve the last header, this will map to the current state
          api.rpc.chain.getHeader().then((header): void => {
            const blockNumber = header.number.unwrap();
            const blockHash = header.hash.toHex();

            if (blockHash !== prevBlockHash) {
              prevBlockHash = blockHash;

              setState((events) => [
                ...newEvents.map(({ indexes, record }): KeyedEvent => ({
                  blockHash,
                  blockNumber,
                  indexes,
                  key: `${blockNumber.toNumber()}-${blockHash}-${indexes.join('.')}`,
                  record
                })),
                // remove all events for the previous same-height blockNumber
                ...events.filter((p) => !p.blockNumber?.eq(blockNumber))
              ].slice(0, MAX_EVENTS));
            }
          }).catch(console.error);
        }
      }).catch(console.error);
    }).catch(console.error);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <EventsContext.Provider value={state}>
      {children}
    </EventsContext.Provider>
  );
}

const Events = React.memo(EventsBase);

export { EventsContext, Events };
