// Copyright 2017-2020 @polkadot/app-storage authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AppProps as Props } from '@polkadot/react-components/types';
import { QueryTypes } from './types';

import React, { useCallback, useState } from 'react';
import styled from 'styled-components';

import Queries from './Queries';
import Selection from './Selection';

function StorageApp ({ basePath, className = '' }: Props): React.ReactElement<Props> {
  const [queue, setQueue] = useState<QueryTypes[]>([]);

  const _onAdd = useCallback(
    (query: QueryTypes) => setQueue((queue: QueryTypes[]) => [query, ...queue]),
    []
  );
  const _onRemove = useCallback(
    (id: number) => setQueue((queue: QueryTypes[]) => queue.filter((item) => item.id !== id)),
    []
  );

  return (
    <main className={`storage--App ${className}`}>
      <Selection
        basePath={basePath}
        onAdd={_onAdd}
      />
      <Queries
        onRemove={_onRemove}
        value={queue}
      />
    </main>
  );
}

export default React.memo(styled(StorageApp)`
  .storage--actionrow {
    align-items: flex-start;
    display: flex;

    .ui--Button {
      margin: 0.25rem;
    }

    &.head {
      flex: 1 1 100%;
      margin: 0 auto;
      max-width: 620px;
    }
  }

  .storage--actionrow-value {
    flex: 1;
    min-width: 0;

    .ui--output {
      word-break: break-all;
    }
  }

  .storage--actionrow-buttons {
    flex: 0;
    padding: 0.5rem 0.25rem;
  }
`);
