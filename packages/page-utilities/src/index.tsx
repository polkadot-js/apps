// Copyright 2017-2025 @polkadot/app-utilities authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useRef } from 'react';
import { Route, Routes } from 'react-router';

import { Tabs } from '@polkadot/react-components';

import Convert from './Convert.js';
import Hash from './Hash.js';
import { useTranslation } from './translate.js';
import Xcm from './Xcm.js';

interface Props {
  basePath: string;
  className?: string;
}

function UtilitiesApp ({ basePath, className }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  const tabsRef = useRef([
    {
      isRoot: true,
      name: 'convert',
      text: t('Convert address')
    },
    {
      name: 'hash',
      text: t('Hash data')
    },
    {
      name: 'xcm',
      text: t('Encode XCM')
    }
  ]);

  return (
    <main className={className}>
      <Tabs
        basePath={basePath}
        items={tabsRef.current}
      />
      <Routes>
        <Route path={basePath}>
          <Route
            element={
              <Xcm />
            }
            path='xcm'
          />
          <Route
            element={
              <Hash />
            }
            path='hash'
          />
          <Route
            element={
              <Convert />
            }
            index
          />
        </Route>
      </Routes>
    </main>
  );
}

export default React.memo(UtilitiesApp);
