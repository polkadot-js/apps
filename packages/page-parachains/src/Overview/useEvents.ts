// Copyright 2017-2025 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { SignedBlockExtended } from '@polkadot/api-derive/types';
import type { Event } from '@polkadot/types/interfaces';
import type { PolkadotPrimitivesVstagingCandidateReceiptV2 } from '@polkadot/types/lookup';
import type { IEvent } from '@polkadot/types/types';
import type { BN } from '@polkadot/util';
import type { EventMapInfo } from './types.js';

import { useEffect, useState } from 'react';

import { createNamedHook, useApi, useCall } from '@polkadot/react-hooks';
import { stringify } from '@polkadot/util';

type EventMap = Record<string, EventMapInfo>;

interface Result {
  lastBacked: EventMap;
  lastIncluded: EventMap;
  lastTimeout: EventMap;
}

const EMPTY_EVENTS: Result = { lastBacked: {}, lastIncluded: {}, lastTimeout: {} };

function includeEntry (map: EventMap, event: Event, blockHash: string, blockNumber: BN): void {
  try {
    const { descriptor } = (event as unknown as IEvent<[PolkadotPrimitivesVstagingCandidateReceiptV2]>).data[0];

    if (descriptor?.paraId) {
      map[descriptor.paraId.toString()] = {
        blockHash,
        blockNumber,
        relayParent: descriptor.relayParent.toHex()
      };
    }
  } catch (error) {
    throw new Error(`${event.section}.${event.method}(${stringify(event.data)}):: ${(error as Error).message}`);
  }
}

function extractEvents (api: ApiPromise, lastBlock: SignedBlockExtended, prev: Result): Result {
  const backed: EventMap = {};
  const included: EventMap = {};
  const timeout: EventMap = {};
  const blockNumber = lastBlock.block.header.number.unwrap();
  const blockHash = lastBlock.block.header.hash.toHex();
  const paraEvents = (api.events.paraInclusion || api.events.parasInclusion || api.events.inclusion);
  let wasBacked = false;
  let wasIncluded = false;
  let wasTimeout = false;

  paraEvents && lastBlock.events.forEach(({ event, phase }) => {
    if (phase.isApplyExtrinsic) {
      if (paraEvents.CandidateBacked.is(event)) {
        includeEntry(backed, event, blockHash, blockNumber);
        wasBacked = true;
      } else if (paraEvents.CandidateIncluded.is(event)) {
        includeEntry(included, event, blockHash, blockNumber);
        wasIncluded = true;
      } else if (paraEvents.CandidateTimedOut.is(event)) {
        includeEntry(timeout, event, blockHash, blockNumber);
        wasTimeout = true;
      }
    }
  });

  return wasBacked || wasIncluded || wasTimeout
    ? {
      lastBacked: wasBacked
        ? { ...prev.lastBacked, ...backed }
        : prev.lastBacked,
      lastIncluded: wasIncluded
        ? { ...prev.lastIncluded, ...included }
        : prev.lastIncluded,
      lastTimeout: wasTimeout
        ? { ...prev.lastTimeout, ...timeout }
        : prev.lastTimeout
    }
    : prev;
}

function useEventsImpl (): Result {
  const { api } = useApi();
  const lastBlock = useCall<SignedBlockExtended>(api.derive.chain.subscribeNewBlocks);
  const [state, setState] = useState<Result>(EMPTY_EVENTS);

  useEffect((): void => {
    lastBlock && setState((prev) =>
      extractEvents(api, lastBlock, prev)
    );
  }, [api, lastBlock]);

  return state;
}

export default createNamedHook('useEvents', useEventsImpl);
