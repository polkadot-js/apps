// Copyright 2017-2024 @polkadot/app-coretime authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { TabItem } from '@polkadot/react-components/types';

import React, { useRef } from 'react';

import { Tabs } from '@polkadot/react-components';
import { useTranslation } from './translate.js';
import { Route, Routes } from 'react-router-dom';
import Overview from './Overview/index.js';
import { Sale } from './Sale/index.js';

interface Props {
  basePath: string;
  className?: string;
}

function createItemsRef(t: (key: string, options?: { replace: Record<string, unknown> }) => string): TabItem[] {
  return [
    {
      isRoot: true,
      name: 'overview',
      text: t('Overview')
    },
    {
      name: 'sale',
      text: t('Sale')
    }
  ];
}

function CoretimeApp({ basePath, className }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const itemsRef = useRef(createItemsRef(t));

  return (
    <main className={className}>
      <Tabs
        basePath={basePath}
        items={itemsRef.current}
      />
      <Routes>
        <Route path={basePath}>
          <Route
            element={
              <Overview />
            }
            index
          />
          <Route
            element={
              <Sale />
            }
            path='sale'
          />
        </Route>
      </Routes>
    </main>
  );
}

export default React.memo(CoretimeApp);
