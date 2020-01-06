// Copyright 2017-2020 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AppProps, BareProps, I18nProps } from '@polkadot/react-components/types';

import React from 'react';
import { Route, Switch } from 'react-router';
import { HelpOverlay, Tabs } from '@polkadot/react-components';
import uiSettings from '@polkadot/ui-settings';

import basicMd from './md/basic.md';
import Overview from './Overview';
import translate from './translate';

export { default as useCounter } from './useCounter';

interface Props extends AppProps, BareProps, I18nProps {}

const hidden = uiSettings.uiMode === 'full'
  ? []
  : ['propose'];

function DemocracyApp ({ basePath, t }: Props): React.ReactElement<Props> {
  return (
    <main className='democracy--App'>
      <HelpOverlay md={basicMd} />
      <header>
        <Tabs
          basePath={basePath}
          hidden={hidden}
          items={[
            {
              isRoot: true,
              name: 'overview',
              text: t('Democracy overview')
            }
          ]}
        />
      </header>
      <Switch>
        <Route component={Overview} />
      </Switch>
    </main>
  );
}

export default translate(DemocracyApp);
