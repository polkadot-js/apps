// Copyright 2017-2019 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AppProps, BareProps, I18nProps } from '@polkadot/ui-app/types';
import { TabItem } from '@polkadot/ui-app/Tabs';

import './index.css';

import React from 'react';
import { Route, Switch } from 'react-router';
import { HelpOverlay,Tabs } from '@polkadot/ui-app';
// import uiSettings from '@polkadot/ui-settings';

import basicMd from './md/basic.md';
import Overview from './Overview';
import Propose from './Propose';
import Settings from './Settings';

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
          text: t('Treasury overview')
        },
        {
          name: 'propose',
          text: t('Submit proposal')
        },
        {
          name: 'settings',
          text: t('Edit settings')
        }
      ]
    };
  }

  render () {
    const { basePath } = this.props;
    const { tabs } = this.state;
    // const hidden = uiSettings.uiMode === 'full'
    //   ? []
    //   : ['propose'];
    const hidden = [] as Array<string>;

    return (
      <main className='treasury--App'>
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
          <Route path={`${basePath}/settings`} component={Settings} />
          <Route component={Overview} />
        </Switch>
      </main>
    );
  }
}

export default translate(App);
