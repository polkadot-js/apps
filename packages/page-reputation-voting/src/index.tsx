// Copyright 2017-2025 @polkadot/app-reputation-voting authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useMemo } from 'react';
import { Route, Routes } from 'react-router';

import { Tabs } from '@polkadot/react-components';

import Processed from './Processed/index.js';
import Referenda from './Referenda/index.js';
import { useTranslation } from './translate.js';

export { default as useCounter } from './useCounter.js';

interface Props {
  basePath: string;
  className?: string;
}

function App ({ basePath, className }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  const items = useMemo(() => [
    {
      isRoot: true,
      name: 'overview',
      text: t('Active')
    },
    {
      name: 'processed',
      text: t('Processed')
    }
  ], [t]);

  return (
    <main className={className}>
      <Tabs
        basePath={basePath}
        items={items}
      />
      <Routes>
        <Route path={basePath}>
          <Route
            element={<Referenda />}
            index
          />
          <Route
            element={<Processed />}
            path='processed'
          />
        </Route>
      </Routes>
    </main>
  );
}

export default React.memo(App);
