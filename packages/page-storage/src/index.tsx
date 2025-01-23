// Copyright 2017-2025 @polkadot/app-storage authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AppProps as Props } from '@polkadot/react-components/types';
import type { QueryTypes } from './types.js';

import React, { useCallback, useState } from 'react';

import { styled } from '@polkadot/react-components';

import Selection from './Selection/index.js';
import Queries from './Queries.js';

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
    <StyledMain className={`${className} storage--App`}>
      <Selection
        basePath={basePath}
        onAdd={_onAdd}
      />
      <Queries
        onRemove={_onRemove}
        value={queue}
      />
    </StyledMain>
  );
}

const StyledMain = styled.main`
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
`;

export default React.memo(StorageApp);
