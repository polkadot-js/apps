// Copyright 2017-2025 @polkadot/app-runtime authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AppProps as Props } from '@polkadot/react-components/types';

import React, { useRef } from 'react';
import { Route, Routes } from 'react-router';

import { Tabs } from '@polkadot/react-components';

import Runtime from './Runtime/index.js';
import { useTranslation } from './translate.js';

function RuntimeApp ({ basePath }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  const itemsRef = useRef([
    {
      isRoot: true,
      name: 'runtime',
      text: t('Calls')
    }
  ]);

  return (
    <main className='runtime--App'>
      <Tabs
        basePath={basePath}
        items={itemsRef.current}
      />
      <Routes>
        <Route path={basePath}>
          <Route
            element={
              <Runtime />
            }
            index
          />
        </Route>
      </Routes>
    </main>
  );
}

export default React.memo(RuntimeApp);
