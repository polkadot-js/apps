// Copyright 2017-2025 @polkadot/react-query authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { Vec } from '@polkadot/types';
import type { EventRecord } from '@polkadot/types/interfaces';
import type { BlockEvents, IndexedEvent, KeyedEvent } from './types.js';

import React, { useEffect, useRef, useState } from 'react';

import { stringify, stringToU8a } from '@polkadot/util';
import { xxhashAsHex } from '@polkadot/util-crypto';

import { useApi } from '../useApi.js';
import { useCall } from '../useCall.js';

interface Props {
  children: React.ReactNode;
}

interface PrevHashes {
  block: string | null;
  event: string | null;
}

const DEFAULT_EVENTS: BlockEvents = { eventCount: 0, events: [] };
const MAX_EVENTS = 75;

export const BlockEventsCtx = React.createContext<BlockEvents>(DEFAULT_EVENTS);

async function manageEvents (api: ApiPromise, prev: PrevHashes, records: Vec<EventRecord>, setState: React.Dispatch<React.SetStateAction<BlockEvents>>): Promise<void> {
  const newEvents: IndexedEvent[] = records
    .map((record, index) => ({ indexes: [index], record }))
    .filter(({ record: { event: { method, section } } }) =>
      section !== 'system' &&
      (
        !['balances', 'treasury'].includes(section) ||
        !['Deposit', 'UpdatedInactive', 'Withdraw'].includes(method)
      ) &&
      (
        !['transactionPayment'].includes(section) ||
        !['TransactionFeePaid'].includes(method)
      ) &&
      (
        !['paraInclusion', 'parasInclusion', 'inclusion'].includes(section) ||
        !['CandidateBacked', 'CandidateIncluded'].includes(method)
      ) &&
      (
        !['relayChainInfo'].includes(section) ||
        !['CurrentBlockNumbers'].includes(method)
      )
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

export function BlockEventsCtxRoot ({ children }: Props): React.ReactElement<Props> {
  const { api, isApiReady } = useApi();
  const [state, setState] = useState<BlockEvents>(DEFAULT_EVENTS);
  const records = useCall<Vec<EventRecord>>(isApiReady && api.query.system.events);
  const prevHashes = useRef({ block: null, event: null });

  useEffect((): void => {
    records && manageEvents(api, prevHashes.current, records, setState).catch(console.error);
  }, [api, prevHashes, records, setState]);

  return (
    <BlockEventsCtx.Provider value={state}>
      {children}
    </BlockEventsCtx.Provider>
  );
}
