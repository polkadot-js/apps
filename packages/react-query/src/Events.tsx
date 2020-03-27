// Copyright 2017-2020 @polkadot/react-query authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, { useEffect, useState } from 'react';
import { useApi } from '@polkadot/react-hooks';
import { EventRecord } from '@polkadot/types/interfaces';
import { stringToU8a } from '@polkadot/util';
import { xxhashAsHex } from '@polkadot/util-crypto';

interface KeyedEvent {
  key: string;
  record: EventRecord;
}

type Events = KeyedEvent[];

interface Props {
  children: React.ReactNode;
}

const MAX_EVENTS = 25;

const EventsContext: React.Context<Events> = React.createContext<Events>([]);

function EventsBase ({ children }: Props): React.ReactElement<Props> {
  const { api } = useApi();
  const [state, setState] = useState<Events>([]);

  useEffect((): void => {
    // TODO We should really unsub - but since this should just be used once,
    // atm I'm rather typing this than doing it the way it is supposed to be
    api.isReady.then((): void => {
      let prevEventHash = '';

      api.query.system.events((records): void => {
        const newEvents = records
          .filter(({ event }): boolean => event.section !== 'system')
          .map((record, index): KeyedEvent => ({ key: `${Date.now()}-${index}`, record }));
        const newEventHash = xxhashAsHex(stringToU8a(JSON.stringify(newEvents)));

        if (newEventHash !== prevEventHash) {
          prevEventHash = newEventHash;

          setState((events) => [...newEvents, ...events].slice(0, MAX_EVENTS));
        }
      });
    });
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
