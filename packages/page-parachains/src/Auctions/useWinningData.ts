// Copyright 2017-2021 @polkadot/app-crowdloan authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Option, StorageKey } from '@polkadot/types';
import type { BlockNumber, LeasePeriodOf, WinningData } from '@polkadot/types/interfaces';
import type { WinnerData, Winning } from './types';

import { useEffect, useState } from 'react';

import { useApi, useEventTrigger } from '@polkadot/react-hooks';

const RANGES = [
  '0-0', '0-1', '0-2', '0-3',
  '1-1', '1-2', '1-3',
  '2-2', '2-3',
  '3-3'
];

function extractData (endBlock: BlockNumber | null, values: [StorageKey<[BlockNumber]>, Option<WinningData>][]): Winning[] {
  return values
    .sort(([{ args: [a] }], [{ args: [b] }]) => a.cmp(b))
    .reduce((all: Winning[], [{ args: [blockOffset] }, optData]): Winning[] => {
      if (optData.isSome) {
        const winners = optData.unwrap().reduce<WinnerData[]>((winners, optEntry, index): WinnerData[] => {
          if (optEntry.isSome) {
            const [accountId, paraId, value] = optEntry.unwrap();

            winners.push({ accountId, paraId, range: RANGES[index], value });
          }

          return winners;
        }, []);

        winners.length && (
          all.length === 0 ||
          JSON.stringify({ winners }) !== JSON.stringify({ winners: all[all.length - 1].winners })
        ) && all.push({
          blockNumber: endBlock
            ? blockOffset.add(endBlock)
            : blockOffset,
          winners
        });
      }

      return all;
    }, [])
    .reverse();
}

export default function useWinningData (auctionInfo: [LeasePeriodOf, BlockNumber] | null): Winning[] | null {
  const { api } = useApi();
  const [winning, setWinning] = useState<Winning[] | null>(null);
  const trigger = useEventTrigger([api.events.auctions.BidAccepted]);

  useEffect((): void => {
    trigger &&
      api.query.auctions.winning
        .entries<Option<WinningData>, [BlockNumber]>()
        .then((values) => setWinning(
          extractData(auctionInfo && auctionInfo[1], values))
        )
        .catch(console.error);
  }, [api, auctionInfo, trigger]);

  return winning;
}
