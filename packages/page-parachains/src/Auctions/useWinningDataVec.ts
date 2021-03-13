// Copyright 2017-2021 @polkadot/app-crowdloan authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Option } from '@polkadot/types';
import type { BlockNumber, WinningData } from '@polkadot/types/interfaces';
import type { WinnerData, Winning } from './types';

import BN from 'bn.js';
import { useEffect, useState } from 'react';

import { useApi, useCall } from '@polkadot/react-hooks';
import { BN_ZERO, bnToBn } from '@polkadot/util';

const RANGES = [
  '0-0', '0-1', '0-2', '0-3',
  '1-1', '1-2', '1-3',
  '2-2', '2-3',
  '3-3'
];

function isNewWinners (a: WinnerData[], b: WinnerData[]): boolean {
  return JSON.stringify({ w: a }) !== JSON.stringify({ w: b });
}

function extractWinners (data: WinningData | null): WinnerData[] {
  return data
    ? data.reduce<WinnerData[]>((winners, optEntry, index): WinnerData[] => {
      if (optEntry.isSome) {
        const [accountId, paraId, value] = optEntry.unwrap();

        winners.push({ accountId, paraId, range: RANGES[index], value });
      }

      return winners;
    }, [])
    : [];
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

function extractData (endBlock: BlockNumber | null, values: WinningData[]): Winning[] {
  return values
    .reduce((all: Winning[], data, blockOffset): Winning[] => {
      const winners = extractWinners(data);

      winners.length && (
        all.length === 0 ||
        isNewWinners(winners, all[all.length - 1].winners)
      ) && all.push(createWinning(endBlock, bnToBn(blockOffset), winners));

      return all;
    }, [])
    .reverse();
}

export default function useWinningData (endBlock: BlockNumber | null): Winning[] | null {
  const { api } = useApi();
  const [winning, setWinning] = useState<Winning[] | null>(null);

  // the vec of all the winners
  const winningVec = useCall<WinningData[]>(api.query.auctions?.winningVec);

  // the first entry will update while we are not in the ending period, always track
  const optFirst = useCall<Option<WinningData>>(api.query.auctions?.winning, [0]);

  useEffect((): void => {
    optFirst && setWinning((prev): Winning[] => {
      const firstEntry = createWinning(null, null, extractWinners(optFirst.unwrapOr(null)));

      if (!prev || prev.length <= 1) {
        const updated: Winning[] = prev || [];

        if (!firstEntry.winners.length) {
          return updated;
        } else if (updated.length) {
          updated[updated.length - 1] = firstEntry;

          return [...updated];
        }

        return [firstEntry];
      }

      return prev;
    });
  }, [optFirst]);

  useEffect((): void => {
    winningVec && setWinning((prev): Winning[] => {
      const full = extractData(endBlock, winningVec);

      return (!prev || full.length !== prev.length || isNewWinners(full[0].winners, prev[0].winners))
        ? full
        : prev;
    });
  }, [endBlock, winningVec]);

  return winning;
}
