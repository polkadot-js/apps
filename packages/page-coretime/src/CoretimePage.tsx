// Copyright 2017-2025 @polkadot/app-coretime authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { TabItem } from '@polkadot/react-components/types';
import type { ChainName } from './types.js';

import React, { useRef } from 'react';
import { Route, Routes } from 'react-router-dom';

import { Tabs } from '@polkadot/react-components';
import { useCall } from '@polkadot/react-hooks';

import Overview from './Overview/index.js';
import Sale from './Sale/index.js';
import { useTranslation } from './translate.js';

interface Props {
  basePath: string;
  className?: string;
  api: ApiPromise;
  isApiReady: boolean;
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

function CoretimePage ({ api, basePath, className, isApiReady }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const itemsRef = useRef(createItemsRef(t));
  const chainName = useCall<string>(isApiReady && api?.rpc.system.chain)?.toString().toLowerCase() as ChainName;

  return (
    <main className={className}>
      <Tabs
        basePath={basePath}
        items={itemsRef.current}
      />
      <Routes>
        <Route path={basePath}>
          <Route
            element={<Overview chainName={chainName} />}
            index
          />
          <Route
            element={<Sale chainName={chainName} />}
            path='sale'
          />
        </Route>
      </Routes>
    </main>
  );
}

export default React.memo(CoretimePage);
