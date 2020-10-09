// Copyright 2017-2020 @polkadot/app-settings authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { AppProps as Props } from '@polkadot/react-components/types';

import React, { useMemo } from 'react';
import { Route, Switch } from 'react-router';
import { HelpOverlay, Tabs } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';

import md from './md/basics.md';
import { useTranslation } from './translate';
import Developer from './Developer';
import I18n from './I18n';
import Metadata from './Metadata';
import General from './General';
import useCounter from './useCounter';

export { useCounter };

function SettingsApp ({ basePath, onStatusChange }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { isApiConnected, isApiReady } = useApi();
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
      ? []
      : ['metadata', 'i18n'],
    [isApiConnected, isApiReady]
  );

  return (
    <main className='settings--App'>
      <HelpOverlay md={md as string} />
      <header>
        <Tabs
          basePath={basePath}
          hidden={hidden}
          items={items}
        />
      </header>
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
        <Route component={General} />
      </Switch>
    </main>
  );
}

export default React.memo(SettingsApp);
