// Copyright 2017-2024 @polkadot/app-coretime authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { TabItem } from '@polkadot/react-components/types';

import React, { useMemo, useRef } from 'react';
import { Route, Routes } from 'react-router-dom';

import { Tabs } from '@polkadot/react-components';
import { useApi, useCoretimeInformation } from '@polkadot/react-hooks';
import { CoreTimeChainConsts } from '@polkadot/react-hooks/types';

import Overview from './Overview/index.js';
import Sale from './Sale/index.js';
import { useTranslation } from './translate.js';

interface Props {
  basePath: string;
  className?: string;
}

function createItemsRef (t: (key: string, options?: { replace: Record<string, unknown> }) => string): TabItem[] {
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

function CoretimeApp ({ basePath, className }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const itemsRef = useRef(createItemsRef(t));
  const { api, isApiReady } = useApi();
  const coretimeInfo = useCoretimeInformation(api, isApiReady);

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
              coretimeInfo && <Overview coretimeInfo={coretimeInfo} />
            }
            index
          />
          <Route
            element={
              coretimeInfo && <Sale coretimeInfo={coretimeInfo} />
            }
            path='sale'
          />
        </Route>
      </Routes>
    </main>
  );
}

export default React.memo(CoretimeApp);
