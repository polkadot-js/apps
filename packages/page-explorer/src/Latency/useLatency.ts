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

function getSetter ({ extrinsics }: Block): GenericExtrinsic | undefined {
  return extrinsics.find(({ method: { method, section } }) =>
    method === 'set' &&
    section === 'timestamp'
  );
}

function extractNext (prev: Detail[], { block, events }: SignedBlockExtended): Detail[] {
  const setter = getSetter(block);

  if (!setter) {
    return prev;
  }

  const now = (setter.args[0] as u32).toNumber();
  const blockNumber = block.header.number.toNumber();
  let delay = 0;

  if (prev.length) {
    if (blockNumber <= prev[prev.length - 1].blockNumber) {
      return prev;
    }

    delay = now - prev[prev.length - 1].now;
  }

  return [
    ...prev,
    {
      blockNumber,
      countEvents: events.length,
      countExtrinsics: block.extrinsics.length,
      delay,
      now,
      parentHash: block.header.parentHash
    }
  ].slice(-MAX_ITEMS);
}

function extractPrev (prev: Detail[], { block, events }: SignedBlockExtended): Detail[] {
  const setter = getSetter(block);

  if (!setter) {
    return prev;
  }

  const now = (setter.args[0] as u32).toNumber();

  prev[0].delay = prev[0].now - now;

  return [
    {
      blockNumber: block.header.number.toNumber(),
      countEvents: events.length,
      countExtrinsics: block.extrinsics.length,
      delay: 0,
      now,
      parentHash: block.header.parentHash
    },
    ...prev
  ];
}

async function getPrev (api: ApiPromise, { block: { header } }: SignedBlockExtended): Promise<SignedBlockExtended[]> {
  const blockNumbers: number[] = [];
  let blockNumber = header.number.toNumber() - 1;

  for (let i = 1; blockNumber > 0 && i <= INITIAL_ITEMS; i++) {
    blockNumbers.push(blockNumber);
    blockNumber--;
  }

  if (!blockNumbers.length) {
    return [];
  }

  const blocks = await Promise.all(
    blockNumbers.map((n) => api.derive.chain.getBlockByNumber(n))
  );

  return blocks.filter((b): b is SignedBlockExtended => !!b);
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

    setDetails((prev) =>
      extractNext(prev, signedBlock)
    );

    if (hasHistoric.current) {
      return;
    }

    hasHistoric.current = true;

    getPrev(api, signedBlock)
      .then((blocks) => {
        if (!blocks.length) {
          return;
        }

        setDetails((prev) =>
          blocks
            .reduce((p, b) => extractPrev(p, b), prev)
            .filter(({ delay }) => delay)
        );
      })
      .catch(console.error);
  }, [api, signedBlock]);

  return useMemo((): Result => {
    const filtered = details.filter(({ delay }) => delay);
    const delays = filtered.map(({ delay }) => delay);

    return filtered.length
      ? {
        details: filtered,
        timeAvg: delays.reduce((avg, d) => avg + (d / delays.length), 0),
        timeMax: Math.max(...delays),
        timeMin: Math.min(...delays)
      }
      : { details: [], timeAvg: 0, timeMax: 0, timeMin: 0 };
  }, [details]);
}
