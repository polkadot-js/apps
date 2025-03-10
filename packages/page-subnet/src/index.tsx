// Copyright 2017-2024 @polkadot/app-subnet authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useMemo, useRef } from 'react';

import { Tabs } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';
import type { TabItem } from '@polkadot/react-components/types';

import { useTranslation } from './translate.js';
import { Route, Routes } from 'react-router';
import { isFunction } from '@polkadot/util';
import Subnet from './Subnet/Subnet.tsx';
import User from './User/User.tsx';
import Validator from './Validator/Validator.tsx';

interface Props {
  basePath: string;
  className?: string;
}

function createItemsRef (t: (key: string, options?: { replace: Record<string, unknown> }) => string): TabItem[] {
  return [
    {
      isRoot: true,
      name: 'user',
      text: t('User Dashboard')
    },
    {
      name: 'info',
      text: t('Agere')
    },
    {
      name: 'auditor',
      text: t('Auditor')
    }
  ];
}

function App ({ basePath, className }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();

  const itemsRef = useRef(createItemsRef(t));

  const hidden = useMemo<string[]>(
    () => isFunction(api.query.babe?.authorities) ? [] : ['forks'],
    [api]
  );

  return (
    <main className={className}>
      <Tabs
        basePath={basePath}
        hidden={hidden}
        items={itemsRef.current}
      />
      <Routes>
        <Route path={`${basePath}`} element={<User />} />
        <Route path={`${basePath}/info`} element={<Subnet />} />
        <Route path={`${basePath}/auditor`} element={<Validator />} />
        {/*<Route path={`${basePath}/user`} element={} />*/}
      </Routes>
    </main>
  );
}

export default React.memo(App);
