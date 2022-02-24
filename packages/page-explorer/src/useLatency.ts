// Copyright 2017-2022 @polkadot/app-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { SignedBlockExtended } from '@polkadot/api-derive/types';
import type { GenericExtrinsic, u32 } from '@polkadot/types';
import type { Block, Hash } from '@polkadot/types/interfaces';

import { useEffect, useMemo, useState } from 'react';

import { useApi, useCall } from '@polkadot/react-hooks';

interface Detail {
  blockNumber: number;
  countEvents: number;
  countExtrinsics: number;
  delay: number;
  now: number;
  parentHash: Hash;
}

interface Result {
  avg: number;
  details: Detail[];
  max: number;
  min: number;
}

const MAX_ITEMS = 24;

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
    if (blockNumber <= prev[0].blockNumber) {
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

export default function useLatency (): Result {
  const { api } = useApi();
  const [details, setDetails] = useState<Detail[]>([]);
  const signedBlock = useCall<SignedBlockExtended>(api.derive.chain.subscribeNewBlocks, []);

  useEffect((): void => {
    signedBlock && setDetails((prev) => extractNext(prev, signedBlock));
  }, [signedBlock]);

  useEffect((): void => {
    if (details.length !== 1) {
      return;
    }

    const blockNumbers: number[] = [];
    let blockNumber = details[0].blockNumber - 1;

    for (let i = 1; blockNumber > 0 && i <= MAX_ITEMS; i++) {
      blockNumbers.push(blockNumber);
      blockNumber--;
    }

    if (!blockNumbers.length) {
      return;
    }

    Promise
      .all(blockNumbers.map((n) => api.derive.chain.getBlockByNumber(n)))
      .then((blocks) =>
        setDetails((prev) =>
          blocks
            .filter((b): b is SignedBlockExtended => !!b)
            .reduce((p, b) => extractPrev(p, b), prev)
            .slice(-MAX_ITEMS)
        )
      )
      .catch(console.error);
  }, [api, details]);

  return useMemo((): Result => {
    const delays = details
      .map(({ delay }) => delay)
      .filter((d) => d);

    return delays.length
      ? {
        avg: delays.reduce((avg, d) => avg + (d / delays.length), 0),
        details,
        max: Math.max(...delays),
        min: Math.min(...delays)
      }
      : { avg: 0, details, max: 0, min: 0 };
  }, [details]);
}
