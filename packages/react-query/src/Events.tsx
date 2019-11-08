// Copyright 2017-2019 @polkadot/react-query authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Codec } from '@polkadot/types/types';

import React, { useContext, useEffect, useState } from 'react';
import { ApiContext } from '@polkadot/react-api';
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

const MAX_EVENTS = 20;

const EventsContext: React.Context<Events> = React.createContext<Events>([]);

function Events ({ children }: Props): React.ReactElement<Props> {
  const { api } = useContext(ApiContext);
  const [state, setState] = useState<Events>([]);

  useEffect((): void => {
    // TODO We should really unsub - but since this should just be used once,
    // atm I'm rather typing this than doing it the way it is supposed to be
    api.isReady.then((): void => {
      const prevEventHash = '';
      let events: Events = [];

      api.query.system.events((records: EventRecord[] & Codec): void => {
        const newEvents = records
          .filter(({ event }): boolean => event.section !== 'system')
          .map((record, index): KeyedEvent => ({ key: `${Date.now()}-${index}`, record }));
        const newEventHash = xxhashAsHex(stringToU8a(JSON.stringify(newEvents)));

        if (newEventHash !== prevEventHash) {
          events = [...newEvents, ...events].slice(0, MAX_EVENTS);
          setState(events);
        }
      });
    });
  }, []);

  return (
    <EventsContext.Provider value={state}>
      {children}
    </EventsContext.Provider>
  );
}

export { EventsContext, Events };
