// Copyright 2017-2023 @polkadot/app-settings authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AppProps as Props } from '@polkadot/react-components/types';

import React, { useMemo } from 'react';
import { Route, Switch } from 'react-router';

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
      text: t<string>('General')
    },
    {
      count: numExtensions,
      name: 'metadata',
      text: t<string>('Metadata')
    },
    {
      name: 'developer',
      text: t<string>('Developer')
    },
    {
      name: 'i18n',
      text: t<string>('Translate')
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
      <Switch>
        <Route path={`${basePath}/developer`}>
          <Developer onStatusChange={onStatusChange} />
        </Route>
        <Route path={`${basePath}/i18n`}>
          <I18n />
        </Route>
        <Route path={`${basePath}/metadata`}>
          <Metadata />
        </Route>
        <Route>
          <General />
        </Route>
      </Switch>
    </main>
  );
}

export default React.memo(SettingsApp);
