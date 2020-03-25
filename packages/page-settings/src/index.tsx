// Copyright 2017-2020 @polkadot/app-settings authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AppProps as Props } from '@polkadot/react-components/types';

import React, { useMemo } from 'react';
import { Route, Switch } from 'react-router';
import { HelpOverlay, Tabs } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';

import md from './md/basics.md';
import { useTranslation } from './translate';
import Developer from './Developer';
import Extensions from './Extensions';
import General from './General';

function SettingsApp ({ basePath, onStatusChange }: Props): React.ReactElement<Props> {
  const { extensions } = useApi();
  const { t } = useTranslation();
  const items = useMemo(() => [
    {
      isRoot: true,
      name: 'general',
      text: t('General')
    },
    {
      name: 'extensions',
      text: t('Extensions')
    },
    {
      name: 'developer',
      text: t('Developer')
    }
  ], [t]);
  const hidden = useMemo(
    () => extensions?.length ? [] : ['extensions'],
    [extensions]
  );

  return (
    <main className='settings--App'>
      <HelpOverlay md={md} />
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
        <Route path={`${basePath}/extensions`}>
          <Extensions />
        </Route>
        <Route component={General} />
      </Switch>
    </main>
  );
}

export default React.memo(SettingsApp);
