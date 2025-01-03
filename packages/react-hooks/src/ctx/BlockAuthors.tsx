// Copyright 2017-2025 @polkadot/react-query authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { HeaderExtended } from '@polkadot/api-derive/types';
import type { EraRewardPoints } from '@polkadot/types/interfaces';
import type { BlockAuthors } from './types.js';

import React, { useEffect, useState } from 'react';

import { useApi, useCall } from '@polkadot/react-hooks';
import { formatNumber } from '@polkadot/util';

interface Props {
  children: React.ReactNode;
}

const MAX_HEADERS = 75;

const byAuthor: Record<string, string> = {};
const eraPoints: Record<string, string> = {};

const EMPTY_STATE: BlockAuthors = { byAuthor, eraPoints, lastBlockAuthors: [], lastHeaders: [] };

export const BlockAuthorsCtx = React.createContext<BlockAuthors>(EMPTY_STATE);

export function BlockAuthorsCtxRoot ({ children }: Props): React.ReactElement<Props> {
  const { api, isApiReady } = useApi();
  const queryPoints = useCall<EraRewardPoints>(isApiReady && api.derive.staking?.currentPoints);
  const [state, setState] = useState<BlockAuthors>(EMPTY_STATE);

  // No unsub, global context - destroyed on app close
  useEffect((): void => {
    api.isReady.then((): void => {
      let lastHeaders: HeaderExtended[] = [];
      let lastBlockAuthors: string[] = [];
      let lastBlockNumber = '';

      // subscribe to new headers
      api.derive.chain.subscribeNewHeads((lastHeader: HeaderExtended): void => {
        if (lastHeader?.number) {
          const blockNumber = lastHeader.number.unwrap();
          let thisBlockAuthor = '';

          if (lastHeader.author) {
            thisBlockAuthor = lastHeader.author.toString();
          }

          const thisBlockNumber = formatNumber(blockNumber);

          if (thisBlockAuthor) {
            byAuthor[thisBlockAuthor] = thisBlockNumber;

            if (thisBlockNumber !== lastBlockNumber) {
              lastBlockNumber = thisBlockNumber;
              lastBlockAuthors = [thisBlockAuthor];
            } else {
              lastBlockAuthors.push(thisBlockAuthor);
            }
          }

          lastHeaders = lastHeaders
            .filter((old, index) => index < MAX_HEADERS && old.number.unwrap().lt(blockNumber))
            .reduce((next, header): HeaderExtended[] => {
              next.push(header);

              return next;
            }, [lastHeader])
            .sort((a, b) => b.number.unwrap().cmp(a.number.unwrap()));

          setState({ byAuthor, eraPoints, lastBlockAuthors: lastBlockAuthors.slice(), lastBlockNumber, lastHeader, lastHeaders });
        }
      }).catch(console.error);
    }).catch(console.error);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect((): void => {
    if (queryPoints) {
      const entries = [...queryPoints.individual.entries()]
        .map(([accountId, points]) => [accountId.toString(), formatNumber(points)]);
      const current = Object.keys(eraPoints);

      // we have an update, clear all previous
      if (current.length !== entries.length) {
        current.forEach((accountId): void => {
          delete eraPoints[accountId];
        });
      }

      entries.forEach(([accountId, points]): void => {
        eraPoints[accountId] = points;
      });
    }
  }, [queryPoints]);

  return (
    <BlockAuthorsCtx.Provider value={state}>
      {children}
    </BlockAuthorsCtx.Provider>
  );
}
