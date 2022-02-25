// Copyright 2017-2022 @polkadot/app-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { SignedBlockExtended } from '@polkadot/api-derive/types';
import type { GenericExtrinsic, u32 } from '@polkadot/types';
import type { Block } from '@polkadot/types/interfaces';
import type { Detail, Result } from './types';

import { useEffect, useMemo, useRef, useState } from 'react';

import { useApi, useCall } from '@polkadot/react-hooks';

const INITIAL_ITEMS = 50;
const MAX_ITEMS = INITIAL_ITEMS;
const EMPTY: Result = {
  details: [],
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

function calcDelay (details: Detail[]): Detail[] {
  const filtered = details
    .sort((a, b) => a.blockNumber - b.blockNumber)
    .filter(({ blockNumber }, index) =>
      index === 0 ||
      blockNumber > details[index - 1].blockNumber
    );

  for (let i = 0; i < filtered.length - 1; i++) {
    const a = filtered[i];
    const b = filtered[i + 1];

    if ((b.blockNumber - a.blockNumber) === 1 && b.delay === 0) {
      b.delay = b.now - a.now;
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
      blockNumber: block.header.number.toNumber(),
      countEvents: events.length,
      countExtrinsics: block.extrinsics.length,
      delay: 0,
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

async function getNext (api: ApiPromise, { blockNumber: start }: Detail, { blockNumber: end }: Detail): Promise<SignedBlockExtended[]> {
  const blockNumbers: number[] = [];

  for (let n = start + 1; n < end; n++) {
    blockNumbers.push(n);
  }

  return getBlocks(api, blockNumbers);
}

export default function useLatency (): Result {
  const { api } = useApi();
  const [details, setDetails] = useState<Detail[]>([]);
  const signedBlock = useCall<SignedBlockExtended>(api.derive.chain.subscribeNewBlocks, []);
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

    const lastIndex = details.findIndex(({ blockNumber }, index) =>
      index !== (details.length - 1) &&
      (details[index + 1].blockNumber - blockNumber) > 1
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
      stdDev,
      timeAvg,
      timeMax: Math.max(...delays),
      timeMin: Math.min(...delays)
    };
  }, [details]);
}
