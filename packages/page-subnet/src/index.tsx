// Copyright 2017-2024 @polkadot/app-subnet authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useMemo, useRef } from 'react';

import { Tabs } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';
import type { TabItem } from '@polkadot/react-components/types';

import { useTranslation } from './translate.js';
import { Route, Routes } from 'react-router';
import { isFunction } from '@polkadot/util';
import Subnet from './Subnet.js';
import User from './User/User.js';
import Validator from './Validator/Validator.js';

interface Props {
  basePath: string;
  className?: string;
}

function createItemsRef (t: (key: string, options?: { replace: Record<string, unknown> }) => string): TabItem[] {
  return [
    {
      isRoot: true,
      name: 'subnet',
      text: t('Subnet')
    },
    {
      name: 'validator',
      text: t('Validator')
    },
    {
      name: 'user',
      text: t('User')
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
        <Route path={`${basePath}`} element={<Subnet />} />
        <Route path={`${basePath}/subnet`} element={<Subnet />} />
        <Route path={`${basePath}/validator`} element={<Validator />} />
        <Route path={`${basePath}/user`} element={<User />} />
      </Routes>
    </main>
  );
}

export default React.memo(App);
