// Copyright 2017-2019 @polkadot/react-query authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, { useContext, useEffect, useState } from 'react';
import { HeaderExtended } from '@polkadot/api-derive';
import { ApiContext } from '@polkadot/react-api';
import { formatNumber } from '@polkadot/util';

interface BlockInfo {
  lastBlockAuthor?: string;
  lastBlockNumber?: string;
  lastHeader?: HeaderExtended;
}

interface Authors extends BlockInfo {
  byAuthor: Record<string, string>;
}

interface Props {
  children: React.ReactNode;
  lastHeader?: HeaderExtended;
}

const byAuthor: Record<string, string> = {};
const BlockAuthorsContext: React.Context<Authors> = React.createContext<Authors>({ byAuthor });

function BlockAuthors ({ children, lastHeader }: Props): React.ReactElement<Props> {
  const { api } = useContext(ApiContext);
  const [{ lastBlockAuthor, lastBlockNumber }, setState] = useState<BlockInfo>({});

  useEffect((): void => {
    // TODO We should really unsub - but since this should just be used once,
    // atm I'm rather typing this than doing it the way it is supposed to be
    api.isReady.then((): void => {
      api.derive.chain.subscribeNewHeads((lastHeader): void => {
        if (lastHeader && lastHeader.number) {
          const lastBlockAuthor = lastHeader.author ? lastHeader.author.toString() : undefined;
          const lastBlockNumber = formatNumber(lastHeader.number.unwrap());

          if (lastBlockAuthor) {
            byAuthor[lastBlockAuthor] = lastBlockNumber;
          }

          setState({ lastBlockAuthor, lastBlockNumber });
        }
      });
    });
  }, []);

  return (
    <BlockAuthorsContext.Provider value={{ byAuthor, lastBlockAuthor, lastBlockNumber, lastHeader }}>
      {children}
    </BlockAuthorsContext.Provider>
  );
}

export { BlockAuthorsContext, BlockAuthors };
