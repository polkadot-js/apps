// Copyright 2017-2022 @polkadot/react-query authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { HeaderExtended } from '@polkadot/api-derive/types';
import type { EraRewardPoints } from '@polkadot/types/interfaces';

import React, { useEffect, useState } from 'react';

import { useApi, useCall } from '@polkadot/react-hooks';
import { formatNumber, isFunction } from '@polkadot/util';

// TODO update HeaderExtended in api-derive
export interface HeaderExtendedWithMapping extends HeaderExtended {
  authorFromMapping?: string;
}

export interface Authors {
  byAuthor: Record<string, string>;
  eraPoints: Record<string, string>;
  lastBlockAuthors: string[];
  lastBlockNumber?: string;
  lastHeader?: HeaderExtendedWithMapping;
  lastHeaders: HeaderExtendedWithMapping[];
}

interface Props {
  children: React.ReactNode;
}

const MAX_HEADERS = 75;

const byAuthor: Record<string, string> = {};
const eraPoints: Record<string, string> = {};
const BlockAuthorsContext: React.Context<Authors> = React.createContext<Authors>({ byAuthor, eraPoints, lastBlockAuthors: [], lastHeaders: [] });
const ValidatorsContext: React.Context<string[]> = React.createContext<string[]>([]);

function BlockAuthorsBase ({ children }: Props): React.ReactElement<Props> {
  const { api, isApiReady } = useApi();
  const queryPoints = useCall<EraRewardPoints>(isApiReady && api.derive.staking?.currentPoints);
  const [state, setState] = useState<Authors>({ byAuthor, eraPoints, lastBlockAuthors: [], lastHeaders: [] });
  const [validators, setValidators] = useState<string[]>([]);

  useEffect((): void => {
    // No unsub, global context - destroyed on app close
    api.isReady.then((): void => {
      let lastHeaders: HeaderExtendedWithMapping[] = [];
      let lastBlockAuthors: string[] = [];
      let lastBlockNumber = '';
      // Some blockchains such as Moonbeam need to fetch the author accountId from a mapping
      const isAuthorMappingWithDeposit = isFunction(api.query.authorMapping?.mappingWithDeposit);

      // subscribe to all validators
      api.query.session && api.query.session.validators((validatorIds): void => {
        setValidators(validatorIds.map((validatorId) => validatorId.toString()));
      }).catch(console.error);

      // subscribe to new headers
      api.derive.chain.subscribeNewHeads(async (lastHeader: HeaderExtendedWithMapping): Promise<void> => {
        if (lastHeader?.number) {
          const blockNumber = lastHeader.number.unwrap();
          let thisBlockAuthor = '';

          // Check for digest type
          const hasConsensusDigest = lastHeader.digest.logs && lastHeader.digest.logs[0] && lastHeader.digest.logs[0].isConsensus && lastHeader.digest.logs[0].asConsensus[1];
          const hasPreRuntimeDigest = lastHeader.digest.logs && lastHeader.digest.logs[0] && lastHeader.digest.logs[0].isPreRuntime && lastHeader.digest.logs[0].asPreRuntime[1];

          if (lastHeader.author) {
            thisBlockAuthor = lastHeader.author.toString();
          } else if (isAuthorMappingWithDeposit && (hasConsensusDigest || hasPreRuntimeDigest)) { // Check for a Digest
            // Some blockchains such as Moonbeam need to fetch the author accountId from a mapping
            thisBlockAuthor = ((await api.query.authorMapping.mappingWithDeposit(hasConsensusDigest ? lastHeader.digest.logs[0].asConsensus[1] : lastHeader.digest.logs[0].asPreRuntime[1])).toHuman() as {
              account: string;
              deposit: string;
            }).account;
            lastHeader.authorFromMapping = thisBlockAuthor;
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
            .reduce((next, header): HeaderExtendedWithMapping[] => {
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
      </BlockAuthorsContext.Provider>
    </ValidatorsContext.Provider>
  );
}

const BlockAuthors = React.memo(BlockAuthorsBase);

export { BlockAuthorsContext, BlockAuthors, ValidatorsContext };
