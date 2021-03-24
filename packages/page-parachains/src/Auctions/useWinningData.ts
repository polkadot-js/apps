// Copyright 2017-2021 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Option, StorageKey } from '@polkadot/types';
import type { BlockNumber, LeasePeriodOf, WinningData } from '@polkadot/types/interfaces';
import type { WinnerData, Winning } from './types';

import BN from 'bn.js';
import { useEffect, useRef, useState } from 'react';

import { useApi, useBestNumber, useCall, useEventTrigger } from '@polkadot/react-hooks';
import { BN_ONE, BN_ZERO } from '@polkadot/util';

import { RANGES } from './constants';

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

export default function useWinningData (auctionInfo: [LeasePeriodOf, BlockNumber] | null): Winning[] | null {
  const { api } = useApi();
  const [result, setResult] = useState<Winning[] | null>(null);
  const bestNumber = useBestNumber();
  const trigger = useEventTrigger([api.events.auctions?.BidAccepted]);
  const triggerRef = useRef(trigger);
  const allEntries = useCall<[StorageKey<[BlockNumber]>, Option<WinningData>][]>(api.query.auctions?.winning.entries);
  const optFirstData = useCall<Option<WinningData>>(api.query.auctions?.winning, FIRST_PARAM);

  // should be fired once, all entries as an initial round
  useEffect((): void => {
    allEntries && setResult(
      extractData(auctionInfo && auctionInfo[1], allEntries)
    );
  }, [allEntries, auctionInfo]);

  // when block 0 changes, update (typically in non-ending-period, static otherwise)
  useEffect((): void => {
    optFirstData && setResult((prev) =>
      mergeFirst(prev, optFirstData)
    );
  }, [optFirstData]);

  // on a bid event, get the new entry (assuming the event really triggered, i.e. not just a block)
  // and add it to the list when not duplicated. Additionally we cleanup after ourselves when endBlock
  // gets cleared
  useEffect((): void => {
    const [, endBlock] = auctionInfo || [null, null];

    if (!endBlock) {
      setResult((prev) => prev && prev.length ? [] : prev);
    } else if (bestNumber && bestNumber.gt(endBlock) && triggerRef.current !== trigger) {
      const blockOffset = bestNumber.sub(endBlock).iadd(BN_ONE);

      triggerRef.current = trigger;

      api.query.auctions
        ?.winning<Option<WinningData>>(blockOffset)
        .then((optCurrent) => setResult((prev) =>
          mergeCurrent(prev, optCurrent, endBlock, blockOffset)
        ))
        .catch(console.error);
    }
  }, [api, bestNumber, auctionInfo, trigger, triggerRef]);

  return result;
}
