// Copyright 2017-2025 @polkadot/app-democracy authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useMemo } from 'react';
import { Route, Routes } from 'react-router';

import { Tabs } from '@polkadot/react-components';

import Overview from './Overview/index.js';
import { useTranslation } from './translate.js';

export { default as useCounter } from './useCounter.js';

interface Props {
  basePath: string;
}

function DemocracyApp ({ basePath }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  const items = useMemo(() => [
    {
      isRoot: true,
      name: 'overview',
      text: t('Overview')
    }
  ], [t]);

  return (
    <main className='democracy--App'>
      <Tabs
        basePath={basePath}
        items={items}
      />
      <Routes>
        <Route path={basePath}>
          <Route
            element={
              <Overview />
            }
            index
          />
        </Route>
      </Routes>
    </main>
  );
}

export default React.memo(DemocracyApp);
