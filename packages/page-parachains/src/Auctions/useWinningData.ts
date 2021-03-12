// Copyright 2017-2021 @polkadot/app-crowdloan authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Option } from '@polkadot/types';
import type { BlockNumber, WinningData } from '@polkadot/types/interfaces';
import type { WinnerData, Winning } from './types';

import { useEffect, useState } from 'react';

import { useApi, useExtrinsicTrigger } from '@polkadot/react-hooks';

const RANGES = [
  '0-0', '0-1', '0-2', '0-3',
  '1-1', '1-2', '1-3',
  '2-2', '2-3',
  '3-3'
];

export default function useWinningData (): Winning[] {
  const { api } = useApi();
  const [winning, setWinning] = useState<Winning[]>([]);
  const trigger = useExtrinsicTrigger([api.tx.auctions.bid]);

  useEffect((): void => {
    trigger &&
      api.query.auctions.winning
        .entries<Option<WinningData>, [BlockNumber]>()
        .then((values): void => {
          setWinning(
            values.reduce<Winning[]>((winning, [{ args: [blockNumber] }, optData]): Winning[] => {
              if (optData.isSome) {
                const winners = optData.unwrap().reduce<WinnerData[]>((winners, optEntry, index): WinnerData[] => {
                  if (optEntry.isSome) {
                    const [accountId, paraId, value] = optEntry.unwrap();

                    winners.push({ accountId, paraId, range: RANGES[index], value });
                  }

                  return winners;
                }, []);

                if (winners.length) {
                  winning.push({ blockNumber, winners });
                }
              }

              return winning;
            }, []).sort((a, b) => b.blockNumber.cmp(a.blockNumber))
          );
        })
        .catch(console.error);
  }, [api, trigger]);

  return winning;
}
