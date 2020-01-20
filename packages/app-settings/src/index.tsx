// Copyright 2017-2020 @polkadot/app-settings authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AppProps, I18nProps } from '@polkadot/react-components/types';

import React from 'react';
import { Route, Switch } from 'react-router';

import { HelpOverlay, Tabs } from '@polkadot/react-components';
import uiSettings from '@polkadot/ui-settings';

import md from './md/basics.md';
import translate from './translate';
import Developer from './Developer';
import General from './General';

interface Props extends AppProps, I18nProps {}

const hidden = uiSettings.uiMode === 'full'
  ? []
  : ['developer'];

function SettingsApp (props: Props): React.ReactElement<Props> {
  const _renderDeveloper = (): React.ReactNode => {
    return (
      <Developer {...props} />
    );
  };
  const { basePath, t } = props;

  return (
    <main className='settings--App'>
      <HelpOverlay md={md} />
      <header>
        <Tabs
          basePath={basePath}
          hidden={hidden}
          items={[
            {
              isRoot: true,
              name: 'general',
              text: t('General')
            },
            {
              name: 'developer',
              text: t('Developer')
            }
          ]}
        />
      </header>
      <Switch>
        <Route path={`${basePath}/developer`} render={_renderDeveloper} />
        <Route component={General} />
      </Switch>
    </main>
  );
}

export default translate(SettingsApp);
