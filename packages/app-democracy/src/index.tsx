// Copyright 2017-2019 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AppProps, BareProps, I18nProps } from '@polkadot/ui-app/types';
import { TabItem } from '@polkadot/ui-app/Tabs';

import React from 'react';
import { Route, Switch } from 'react-router';
import { HelpOverlay,Tabs } from '@polkadot/ui-app';
import uiSettings from '@polkadot/ui-settings';

import basicMd from './md/basic.md';
import Overview from './Overview';
import Propose from './Propose';
import translate from './translate';

type Props = AppProps & BareProps & I18nProps;

type State = {
  tabs: Array<TabItem>
};

class App extends React.PureComponent<Props, State> {
  constructor (props: Props) {
    super(props);

    const { t } = props;

    this.state = {
      tabs: [
        {
          isRoot: true,
          name: 'overview',
          text: t('Democracy overview')
        },
        {
          name: 'propose',
          text: t('Submit proposal')
        }
      ]
    };
  }

  render () {
    const { basePath } = this.props;
    const { tabs } = this.state;
    const hidden = uiSettings.uiMode === 'full'
      ? []
      : ['propose'];

    return (
      <main className='democracy--App'>
        <HelpOverlay md={basicMd} />
        <header>
          <Tabs
            basePath={basePath}
            hidden={hidden}
            items={tabs}
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
