// Copyright 2017-2019 @polkadot/react-query authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, { useContext, useEffect, useState } from 'react';
import { HeaderExtended } from '@polkadot/api-derive';
import { ApiContext } from '@polkadot/react-api';
import { formatNumber } from '@polkadot/util';

interface Authors {
  byAuthor: Record<string, string>;
  lastBlockAuthor?: string;
  lastBlockNumber?: string;
  lastHeader?: HeaderExtended;
  lastHeaders: HeaderExtended[];
}

interface Props {
  children: React.ReactNode;
}

const MAX_HEADERS = 20;

const byAuthor: Record<string, string> = {};
const BlockAuthorsContext: React.Context<Authors> = React.createContext<Authors>({ byAuthor, lastHeaders: [] });

function BlockAuthors ({ children }: Props): React.ReactElement<Props> {
  const { api } = useContext(ApiContext);
  const [state, setState] = useState<Authors>({ byAuthor, lastHeaders: [] });

  useEffect((): void => {
    // TODO We should really unsub - but since this should just be used once,
    // atm I'm rather typing this than doing it the way it is supposed to be
    api.isReady.then((): void => {
      let lastHeaders: HeaderExtended[] = [];

      api.derive.chain.subscribeNewHeads((lastHeader): void => {
        if (lastHeader && lastHeader.number) {
          const blockNumber = lastHeader.number.unwrap();
          const lastBlockAuthor = lastHeader.author ? lastHeader.author.toString() : undefined;
          const lastBlockNumber = formatNumber(blockNumber);

          if (lastBlockAuthor) {
            byAuthor[lastBlockAuthor] = lastBlockNumber;
          }

          lastHeaders = lastHeaders
            .filter((old, index): boolean => index < MAX_HEADERS && old.number.unwrap().lt(blockNumber))
            .reduce((next, header): HeaderExtended[] => {
              next.push(header);

              return next;
            }, [lastHeader])
            .sort((a, b): number => b.number.unwrap().cmp(a.number.unwrap()));

          setState({ byAuthor, lastBlockAuthor, lastBlockNumber, lastHeader, lastHeaders });
        }
      });
    });
  }, []);

  return (
    <BlockAuthorsContext.Provider value={state}>
      {children}
    </BlockAuthorsContext.Provider>
  );
}

export { BlockAuthorsContext, BlockAuthors };
