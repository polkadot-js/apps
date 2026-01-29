// Copyright 2017-2025 @polkadot/app-rpc authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AppProps as Props } from '@polkadot/react-components/types';

import React, { useRef } from 'react';
import { Route, Routes } from 'react-router';

import { Tabs } from '@polkadot/react-components';

import Rpc from './Rpc/index.js';
import { useTranslation } from './translate.js';

function RpcApp ({ basePath }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  const itemsRef = useRef([
    {
      isRoot: true,
      name: 'rpc',
      text: t('Submission')
    }
  ]);

  return (
    <main className='rpc--App'>
      <Tabs
        basePath={basePath}
        items={itemsRef.current}
      />
      <Routes>
        <Route path={basePath}>
          <Route
            element={
              <Rpc />
            }
            index
          />
        </Route>
      </Routes>
    </main>
  );
}

export default React.memo(RpcApp);
