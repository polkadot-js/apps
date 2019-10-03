// Copyright 2017-2019 @polkadot/app-storage authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AppProps, I18nProps } from '@polkadot/react-components/types';
import { QueryTypes } from './types';

import './index.css';

import React, { useState } from 'react';

import Queries from './Queries';
import Selection from './Selection';
import translate from './translate';

interface Props extends AppProps, I18nProps {}

function StorageApp ({ basePath }: Props): React.ReactElement<Props> {
  const [queue, setQueue] = useState<QueryTypes[]>([]);

  const _onAdd = (query: QueryTypes): void => setQueue([query, ...queue]);
  const _onRemove = (id: number): void => setQueue(queue.filter((item): boolean => item.id !== id));

  return (
    <main className='storage--App'>
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

export default translate(StorageApp);
