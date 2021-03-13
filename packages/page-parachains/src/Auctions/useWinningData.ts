// Copyright 2017-2021 @polkadot/app-crowdloan authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Option, StorageKey } from '@polkadot/types';
import type { BlockNumber, WinningData } from '@polkadot/types/interfaces';
import type { WinnerData, Winning } from './types';

import BN from 'bn.js';
import { useEffect, useRef, useState } from 'react';

import { useApi, useCall, useEventTrigger } from '@polkadot/react-hooks';
import { BN_ONE, BN_ZERO } from '@polkadot/util';

const RANGES = [
  '0-0', '0-1', '0-2', '0-3',
  '1-1', '1-2', '1-3',
  '2-2', '2-3',
  '3-3'
];

const FIRST_PARAM = [0];

function isNewWinners (a: WinnerData[], b: WinnerData[]): boolean {
  return JSON.stringify({ w: a }) !== JSON.stringify({ w: b });
}

function extractWinners (optData: Option<WinningData>): WinnerData[] {
  return optData.isNone
    ? []
    : optData.unwrap().reduce<WinnerData[]>((winners, optEntry, index): WinnerData[] => {
      if (optEntry.isSome) {
        const [accountId, paraId, value] = optEntry.unwrap();

        winners.push({ accountId, paraId, range: RANGES[index], value });
      }

      return winners;
    }, []);
}

function createWinning (endBlock: BlockNumber | null, blockOffset: BN | null | undefined, winners: WinnerData[]): Winning {
  return {
    blockNumber: endBlock && blockOffset
      ? blockOffset.add(endBlock)
      : blockOffset || BN_ZERO,
    blockOffset: blockOffset || BN_ZERO,
    total: winners.reduce((total, { value }) => total.iadd(value), new BN(0)),
    winners
  };
}

function extractData (endBlock: BlockNumber | null, values: [StorageKey<[BlockNumber]>, Option<WinningData>][]): Winning[] {
  return values
    .sort(([{ args: [a] }], [{ args: [b] }]) => a.cmp(b))
    .reduce((all: Winning[], [{ args: [blockOffset] }, optData]): Winning[] => {
      const winners = extractWinners(optData);

      winners.length && (
        all.length === 0 ||
        isNewWinners(winners, all[all.length - 1].winners)
      ) && all.push(createWinning(endBlock, blockOffset, winners));

      return all;
    }, [])
    .reverse();
}

function mergeCurrent (prev: Winning[] | null, optCurrent: Option<WinningData>, endBlock: BlockNumber, blockOffset: BN): Winning[] | null {
  const current = createWinning(endBlock, blockOffset, extractWinners(optCurrent));

  if (current.winners.length && (!prev?.length || isNewWinners(current.winners, prev[0].winners))) {
    return [current, ...(prev || [])];
  }

  return prev;
}

function mergeFirst (prev: Winning[] | null, optFirstData: Option<WinningData>): Winning[] | null {
  if (prev && prev.length <= 1) {
    const updated: Winning[] = prev || [];
    const firstEntry = createWinning(null, null, extractWinners(optFirstData));

    if (!firstEntry.winners.length) {
      return updated;
    } else if (!updated.length) {
      return [firstEntry];
    }

    updated[updated.length - 1] = firstEntry;

    return updated.slice();
  }

  return prev;
}

export default function useWinningData (endBlock: BlockNumber | null): Winning[] | null {
  const { api } = useApi();
  const [winning, setWinning] = useState<Winning[] | null>(null);
  const bestNumber = useCall<BlockNumber>(api.derive.chain.bestNumber);
  const trigger = useEventTrigger([api.events.auctions?.BidAccepted]);
  const triggerRef = useRef(trigger);
  const allEntries = useCall<[StorageKey<[BlockNumber]>, Option<WinningData>][]>(api.query.auctions?.winning.entries);
  const optFirstData = useCall<Option<WinningData>>(api.query.auctions?.winning, FIRST_PARAM);

  useEffect((): void => {
    allEntries && setWinning(
      extractData(endBlock, allEntries)
    );
  }, [allEntries, endBlock]);

  useEffect((): void => {
    optFirstData && setWinning((prev) =>
      mergeFirst(prev, optFirstData)
    );
  }, [optFirstData]);

  useEffect((): void => {
    if (endBlock && bestNumber && triggerRef.current !== trigger) {
      const blockOffset = bestNumber.gt(endBlock)
        ? bestNumber.sub(endBlock).add(BN_ONE)
        : BN_ZERO;

      triggerRef.current = trigger;

      api.query.auctions
        ?.winning<Option<WinningData>>(blockOffset)
        .then((optCurrent) => setWinning((prev) =>
          mergeCurrent(prev, optCurrent, endBlock, blockOffset)
        ))
        .catch(console.error);
    }
  }, [api, bestNumber, endBlock, trigger, triggerRef]);

  return winning;
}
