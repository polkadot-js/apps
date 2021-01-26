// Copyright 2017-2020 @canvas-ui/react-query authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ResetStorageModal } from '@canvas-ui/react-components';
import { useApi, useCall } from '@canvas-ui/react-hooks';
import React, { useEffect, useState } from 'react';

import { HeaderExtended } from '@polkadot/api-derive';
import { EraRewardPoints } from '@polkadot/types/interfaces';
import { formatNumber } from '@polkadot/util';

export interface Authors {
  byAuthor: Record<string, string>;
  eraPoints: Record<string, string>;
  lastBlockAuthors: string[];
  lastBlockNumber?: string;
  lastHeader?: HeaderExtended;
  lastHeaders: HeaderExtended[];
}

interface Props {
  children: React.ReactNode;
}

const MAX_HEADERS = 50;

const byAuthor: Record<string, string> = {};
const eraPoints: Record<string, string> = {};
const BlockAuthorsContext: React.Context<Authors> = React.createContext<Authors>({ byAuthor, eraPoints, lastBlockAuthors: [], lastHeaders: [] });
const ValidatorsContext: React.Context<string[]> = React.createContext<string[]>([]);

function BlockAuthorsBase ({ children }: Props): React.ReactElement<Props> {
  const { api, isApiReady } = useApi();
  const queryPoints = useCall<EraRewardPoints>(isApiReady && api.derive.staking?.currentPoints, []);
  const [state, setState] = useState<Authors>({ byAuthor, eraPoints, lastBlockAuthors: [], lastHeaders: [] });
  const [validators, setValidators] = useState<string[]>([]);
  const [isChainPurged, setIsChainPurged] = useState(false);

  useEffect((): void => {
    // No unsub, global context - destroyed on app close
    api.isReady.then((): void => {
      let lastHeaders: HeaderExtended[] = [];
      let lastBlockAuthors: string[] = [];
      let lastBlockNumber = '';

      // subscribe to all validators
      api.query.session && api.query.session.validators((validatorIds): void => {
        setValidators(validatorIds.map((validatorId) => validatorId.toString()));
      }).catch(console.error);

      // Set block one hash to check if contract/code purge needed
      api.queryMulti(
        [api.query.system.chain, [api.query.system.blockHash, 1]],
        ([chainName, blockOneHash]) => {
          if (chainName.toString() === 'Development') {
            window.localStorage.setItem('blockOneHash', blockOneHash.toString());
          }
        }
      ).catch(console.error);

      // subscribe to new headers
      api.derive.chain.subscribeNewHeads(async (lastHeader): Promise<void> => {
        if (lastHeader?.number) {
          const blockNumber = lastHeader.number.unwrap();
          const thisBlockAuthor = lastHeader.author?.toString();
          const thisBlockNumber = formatNumber(blockNumber);
          const chainName = (await api.rpc.system.chain()).toString();

          const blockOneHash = (await api.query.system.blockHash(1));
          const blockOneHashRef = window.localStorage.getItem('blockOneHash');

          console.log(blockOneHash.toString());
          console.log(blockOneHashRef);

          if (
            chainName === 'Development' &&
            blockOneHashRef &&
            JSON.parse(blockOneHashRef) as string !== blockOneHash.toString()
          ) {
            setIsChainPurged(true);
          }

          window.localStorage.setItem('currentBlockIndex', thisBlockNumber);

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
            .filter((old, index): boolean => index < MAX_HEADERS && old.number.unwrap().lt(blockNumber))
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
    <ValidatorsContext.Provider value={validators}>
      <BlockAuthorsContext.Provider value={state}>
        {children}
        {isChainPurged && (
          <ResetStorageModal />
        )}
      </BlockAuthorsContext.Provider>
    </ValidatorsContext.Provider>
  );
}

const BlockAuthors = React.memo(BlockAuthorsBase);

export { BlockAuthorsContext, BlockAuthors, ValidatorsContext };
