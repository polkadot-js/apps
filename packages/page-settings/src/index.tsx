// Copyright 2017-2025 @polkadot/app-settings authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AppProps as Props } from '@polkadot/react-components/types';

import React, { useMemo } from 'react';
import { Route, Routes } from 'react-router';

import { Tabs } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';

import I18n from './I18n/index.js';
import Metadata from './Metadata/index.js';
import Developer from './Developer.js';
import General from './General.js';
import { useTranslation } from './translate.js';
import useCounter from './useCounter.js';

export { useCounter };

function SettingsApp ({ basePath, onStatusChange }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api, isApiConnected, isApiReady, isDevelopment } = useApi();
  const numExtensions = useCounter();

  const items = useMemo(() => [
    {
      isRoot: true,
      name: 'general',
      text: t('General')
    },
    {
      count: numExtensions,
      name: 'metadata',
      text: t('Metadata')
    },
    {
      name: 'developer',
      text: t('Developer')
    },
    {
      name: 'i18n',
      text: t('Translate')
    }
  ], [numExtensions, t]);

  const hidden = useMemo(
    () => (isApiConnected && isApiReady)
      ? isDevelopment || (api.runtimeMetadata.version <= 13)
        ? []
        : ['developer']
      : ['metadata', 'i18n'],
    [api, isApiConnected, isApiReady, isDevelopment]
  );

  return (
    <main className='settings--App'>
      <Tabs
        basePath={basePath}
        hidden={hidden}
        items={items}
      />
      <Routes>
        <Route path={basePath}>
          <Route
            element={
              <Developer onStatusChange={onStatusChange} />
            }
            path='developer'
          />
          <Route
            element={
              <I18n />
            }
            path='i18n'
          />
          <Route
            element={
              <Metadata />
            }
            path='metadata'
          />
          <Route
            element={
              <General />
            }
            index
          />
        </Route>
      </Routes>
    </main>
  );
}

export default React.memo(SettingsApp);
