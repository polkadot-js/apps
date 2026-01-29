// Copyright 2017-2025 @polkadot/app-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { SignedBlockExtended } from '@polkadot/api-derive/types';
import type { GenericExtrinsic, u32 } from '@polkadot/types';
import type { Block } from '@polkadot/types/interfaces';
import type { Detail, Result } from './types.js';

import { useEffect, useMemo, useRef, useState } from 'react';

import { createNamedHook, useApi, useCall } from '@polkadot/react-hooks';

const INITIAL_ITEMS = 50;
const MAX_ITEMS = INITIAL_ITEMS;
const EMPTY: Result = {
  details: [],
  isLoaded: false,
  maxItems: MAX_ITEMS,
  stdDev: 0,
  timeAvg: 0,
  timeMax: 0,
  timeMin: 0
};

function getSetter ({ extrinsics }: Block): GenericExtrinsic | undefined {
  return extrinsics.find(({ method: { method, section } }) =>
    method === 'set' &&
    section === 'timestamp'
  );
}

/**
 * Calculates the delay for each block, correctly handling elastic scaling
 * by distributing the time difference across all blocks produced between two differing slots.
 */
function calcDelay (details: Detail[]): Detail[] {
  const filtered = details
    .sort((a, b) => a.block.number - b.block.number)
    .filter(({ block }, index) =>
      index === 0 ||
      block.number > details[index - 1].block.number
    );

  for (let i = 0; i < filtered.length - 1; i++) {
    const a = filtered[i];
    const b = filtered[i + 1];

    // Check if the current block 'a' and the next block 'b' share the same timestamp.
    // If they do, 'a' cannot be the slot anchor for 'b', so we skip 'a' and let the loop continue
    // to find the true anchor later when 'b' or a subsequent block is processed.
    if (a.now === b.now) {
      continue;
    }

    // At this point, 'a' is the last block of the previous slot
    // and 'b' is the first block of the new slot.

    const delta = b.now - a.now;

    if (delta < 0) {
      b.delay = 0;
      continue;
    }

    let k = i + 1;

    // Find the end of the current slot
    while (k < filtered.length && filtered[k].now === b.now) {
      k++;
    }

    const lastBlockInSlot = filtered[k - 1];
    const blocksInWindow = lastBlockInSlot.block.number - a.block.number;

    if (blocksInWindow <= 0) {
      b.delay = delta;
      continue;
    }

    // Calculate the distributed delay (Delta t / N)
    const distributedDelay = delta / blocksInWindow;

    // Apply the distributed delay to ALL blocks in the current slot/window
    for (let m = i + 1; m < k; m++) {
      filtered[m].delay = distributedDelay;
    }
  }

  return filtered.slice(-MAX_ITEMS);
}

function addBlock (prev: Detail[], { block, events }: SignedBlockExtended): Detail[] {
  const setter = getSetter(block);

  if (!setter) {
    return prev;
  }

  return [
    ...prev,
    {
      block: {
        bytes: block.encodedLength,
        number: block.header.number.toNumber()
      },
      delay: 0,
      events: {
        count: events.length,
        system: events.filter(({ phase }) => !phase.isApplyExtrinsic).length
      },
      extrinsics: {
        bytes: block.extrinsics.reduce((a, x) => a + x.encodedLength, 0),
        count: block.extrinsics.length
      },
      now: (setter.args[0] as u32).toNumber(),
      parentHash: block.header.parentHash
    }
  ];
}

function addBlocks (prev: Detail[], blocks: SignedBlockExtended[]): Detail[] {
  return blocks.reduce((p, b) => addBlock(p, b), prev);
}

async function getBlocks (api: ApiPromise, blockNumbers: number[]): Promise<SignedBlockExtended[]> {
  if (!blockNumbers.length) {
    return [];
  }

  const blocks = await Promise.all(
    blockNumbers.map((n) => api.derive.chain.getBlockByNumber(n))
  );

  return blocks.filter((b): b is SignedBlockExtended => !!b);
}

async function getPrev (api: ApiPromise, { block: { header } }: SignedBlockExtended): Promise<SignedBlockExtended[]> {
  const blockNumbers: number[] = [];
  let blockNumber = header.number.toNumber();

  for (let i = 1; blockNumber > 0 && i <= INITIAL_ITEMS; i++) {
    blockNumbers.push(--blockNumber);
  }

  return getBlocks(api, blockNumbers);
}

async function getNext (api: ApiPromise, { block: { number: start } }: Detail, { block: { number: end } }: Detail): Promise<SignedBlockExtended[]> {
  const blockNumbers: number[] = [];

  for (let n = start + 1; n < end; n++) {
    blockNumbers.push(n);
  }

  return getBlocks(api, blockNumbers);
}

function useLatencyImpl (): Result {
  const { api } = useApi();
  const [details, setDetails] = useState<Detail[]>([]);
  const signedBlock = useCall<SignedBlockExtended>(api.derive.chain.subscribeNewBlocks);
  const hasHistoric = useRef(false);

  useEffect((): void => {
    if (!signedBlock) {
      return;
    }

    setDetails((prev) => calcDelay(addBlock(prev, signedBlock)));

    if (hasHistoric.current) {
      return;
    }

    hasHistoric.current = true;

    getPrev(api, signedBlock)
      .then((all) => setDetails((prev) => calcDelay(addBlocks(prev, all))))
      .catch(console.error);
  }, [api, signedBlock]);

  useEffect((): void => {
    if (details.length <= 2) {
      return;
    }

    const lastIndex = details.findIndex(({ block }, index) =>
      index !== (details.length - 1) &&
      (details[index + 1].block.number - block.number) > 1
    );

    if (lastIndex === -1) {
      return;
    }

    getNext(api, details[lastIndex], details[lastIndex + 1])
      .then((all) => setDetails((prev) => calcDelay(addBlocks(prev, all))))
      .catch(console.error);
  }, [api, details]);

  return useMemo((): Result => {
    const delays = details
      .map(({ delay }) => delay)
      .filter((delay) => delay);

    if (!delays.length) {
      return EMPTY;
    }

    const timeAvg = delays.reduce((avg, d) => avg + d, 0) / delays.length;
    const stdDev = Math.sqrt(delays.reduce((dev, d) => dev + Math.pow(timeAvg - d, 2), 0) / delays.length);

    return {
      details,
      isLoaded: details.length === MAX_ITEMS,
      maxItems: MAX_ITEMS,
      stdDev,
      timeAvg,
      timeMax: Math.max(...delays),
      timeMin: Math.min(...delays)
    };
  }, [details]);
}

export default createNamedHook('useLatency', useLatencyImpl);
