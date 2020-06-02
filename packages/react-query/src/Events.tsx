// Copyright 2017-2020 @polkadot/react-query authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BlockNumber, EventRecord } from '@polkadot/types/interfaces';

import React, { useEffect, useState } from 'react';
import { useApi } from '@polkadot/react-hooks';
import { stringToU8a } from '@polkadot/util';
import { xxhashAsHex } from '@polkadot/util-crypto';

interface IndexedEvent {
  index: number;
  record: EventRecord;
}

interface KeyedEvent extends IndexedEvent {
  blockHash: string;
  blockNumber: BlockNumber;
  key: string;
}

type Events = KeyedEvent[];

interface Props {
  children: React.ReactNode;
}

const MAX_EVENTS = 50;

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
          .map((record, index) => ({ index, record }))
          .filter(({ record: { event: { section } } }) => section !== 'system');
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
                ...newEvents.map(({ index, record }): KeyedEvent => ({
                  blockHash,
                  blockNumber,
                  index,
                  key: `${blockNumber.toNumber()}-${blockHash}-${index}`,
                  record
                })),
                ...events
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
