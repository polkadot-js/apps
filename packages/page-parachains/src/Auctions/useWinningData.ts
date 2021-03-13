// Copyright 2017-2021 @polkadot/app-crowdloan authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Option, StorageKey } from '@polkadot/types';
import type { BlockNumber, LeasePeriodOf, WinningData } from '@polkadot/types/interfaces';
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

function mergeCurrent (current: Winning, prev: Winning[] | null): Winning[] | null {
  if (current.winners.length && prev && prev.length && isNewWinners(current.winners, prev[0].winners)) {
    return [current, ...prev];
  }

  return prev;
}

export default function useWinningData (auctionInfo: [LeasePeriodOf, BlockNumber] | null): Winning[] | null {
  const { api } = useApi();
  const [winning, setWinning] = useState<Winning[] | null>(null);
  const bestNumber = useCall<BlockNumber>(api.derive.chain.bestNumber);
  const trigger = useEventTrigger([api.events.auctions?.BidAccepted]);
  const triggerRef = useRef(trigger);

  // gets all entries, once-off
  const allEntries = useCall<Winning[]>(auctionInfo && api.query.auctions?.winning.entries, undefined, {
    transform: (values: [StorageKey<[BlockNumber]>, Option<WinningData>][]): Winning[] =>
      extractData(auctionInfo && auctionInfo[1], values)
  });

  // the first entry will update while we are not in the ending period, always track
  const firstEntry = useCall<Winning>(api.query.auctions?.winning, [0], {
    transform: (optData: Option<WinningData>): Winning =>
      createWinning(null, null, extractWinners(optData))
  });

  useEffect((): void => {
    allEntries && setWinning(allEntries);
  }, [allEntries]);

  useEffect((): void => {
    firstEntry && setWinning((prev): Winning[] => {
      if (!firstEntry.winners.length) {
        return prev || [];
      }

      let updated: Winning[] = prev || [];

      if (updated.length) {
        updated[updated.length - 1] = firstEntry;
      } else {
        updated = [firstEntry];
      }

      return [...updated];
    });
  }, [firstEntry]);

  useEffect((): void => {
    if (auctionInfo && bestNumber && bestNumber.gt(auctionInfo[1]) && triggerRef.current !== trigger) {
      const blockOffset = bestNumber.sub(auctionInfo[1]).add(BN_ONE);

      triggerRef.current = trigger;

      api.query.auctions
        ?.winning<Option<WinningData>>(blockOffset)
        .then((current) => setWinning((prev) =>
          mergeCurrent(createWinning(auctionInfo[1], blockOffset, extractWinners(current)), prev)
        ))
        .catch(console.error);
    }
  }, [api, auctionInfo, bestNumber, trigger, triggerRef]);

  return winning;
}
