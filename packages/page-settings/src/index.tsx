// Copyright 2017-2020 @polkadot/app-settings authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AppProps as Props } from '@polkadot/react-components/types';

import React, { useMemo } from 'react';
import { Route, Switch } from 'react-router';
import { HelpOverlay, Tabs } from '@polkadot/react-components';
import uiSettings from '@polkadot/ui-settings';

import md from './md/basics.md';
import { useTranslation } from './translate';
import Developer from './Developer';
import I18n from './I18n';
import Metadata from './Metadata';
import General from './General';
import useCounter from './useCounter';

export { useCounter };

const hidden = uiSettings.uiMode === 'full'
  ? []
  : ['developer'];

function SettingsApp ({ basePath, onStatusChange }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const numExtensions = useCounter();
  const items = useMemo(() => [
    {
      isRoot: true,
      name: 'general',
      text: t<string>('General')
    },
    {
      name: 'metadata',
      text: t<string>('Metadata {{count}}', {
        replace: {
          count: numExtensions ? `(${numExtensions})` : ''
        }
      })
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
