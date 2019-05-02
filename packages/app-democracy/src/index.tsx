// Copyright 2017-2019 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AppProps, BareProps, I18nProps } from '@polkadot/ui-app/types';

import './index.css';

import React from 'react';
import { Route, Switch } from 'react-router';
import { HelpOverlay,Tabs } from '@polkadot/ui-app';

import basicMd from './md/basic.md';
import Overview from './Overview';
import Propose from './Propose';
import translate from './translate';

type Props = AppProps & BareProps & I18nProps;

class App extends React.PureComponent<Props> {
  render () {
    const { basePath, t } = this.props;

    return (
      <main className='democracy--App'>
        <HelpOverlay md={basicMd} />
        <header>
          <Tabs
            basePath={basePath}
            items={[
              {
                name: 'overview',
                text: t('Democracy overview')
              },
              {
                name: 'propose',
                text: t('Submit proposal')
              }
            ]}
          />
        </header>
        <Switch>
          <Route path={`${basePath}/propose`} render={() => <Propose basePath={basePath} />} />
          <Route component={Overview} />
        </Switch>
      </main>
    );
  }
}

export default translate(App);
