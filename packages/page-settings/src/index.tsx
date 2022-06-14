// Copyright 2017-2022 @polkadot/app-settings authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AppProps as Props } from '@polkadot/react-components/types';

import React, { useMemo } from 'react';
import { Route, Switch } from 'react-router';

import { HelpOverlay, Tabs } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';

import md from './md/basics.md';
import Developer from './Developer';
import General from './General';
import I18n from './I18n';
import Metadata from './Metadata';
import { useTranslation } from './translate';
import useCounter from './useCounter';

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
      <HelpOverlay md={md as string} />
      <Tabs
        basePath={basePath}
        hidden={hidden}
        items={items}
      />
      <Switch>
        <Route path={`${basePath}/developer`}>
          <Developer
            basePath={basePath}
            onStatusChange={onStatusChange}
          />
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
