// Copyright 2017-2023 @polkadot/app-gilt authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useRef } from 'react';
import { Route, Routes } from 'react-router';

import { Tabs } from '@polkadot/react-components';

import Overview from './Overview/index.js';
import { useTranslation } from './translate.js';

interface Props {
  basePath: string;
  className?: string;
}

function GiltApp ({ basePath, className }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  const tabsRef = useRef([
    {
      isRoot: true,
      name: 'overview',
      text: t<string>('Overview')
    }
  ]);

  return (
    <main className={className}>
      <Tabs
        basePath={basePath}
        items={tabsRef.current}
      />
      <Routes>
        <Route>
          <Overview />
        </Route>
      </Routes>
    </main>
  );
}

export default React.memo(GiltApp);
