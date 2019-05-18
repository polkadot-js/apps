// Copyright 2017-2019 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AppProps, BareProps, I18nProps } from '@polkadot/ui-app/types';
import { TabItem } from '@polkadot/ui-app/Tabs';

import './index.css';

import React from 'react';
import { Route, Switch } from 'react-router';
import { HelpOverlay,Tabs } from '@polkadot/ui-app';
import uiSettings from '@polkadot/ui-settings';

import accountObservable from '@polkadot/ui-keyring/observable/accounts';
import basicMd from './md/basic.md';
import Delegations from './Delegations';
import Overview from './Overview';
import Propose from './Propose';
import translate from './translate';
import { withMulti, withObservable } from '@polkadot/ui-api';

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
          name: 'overview',
          text: t('Democracy overview')
        },
        {
          name: 'propose',
          text: t('Submit proposal')
        },
        {
          name: 'delegations',
          text: t('Manage delegations')
        }
      ]
    };
  }

  render () {
    const { allAccounts, basePath } = this.props;
    const { tabs } = this.state;
    let hidden = [];
    if (uiSettings.uiMode !== 'full') {
      hidden.push('propose');
    }
    if (!allAccounts || Object.keys(allAccounts).length === 0) {
      hidden.push('delegations');
    }

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
          <Route path={`${basePath}/delegations`} render={() => <Delegations basePath={basePath} />} />
          <Route path={`${basePath}/propose`} render={() => <Propose basePath={basePath} />} />
          <Route component={Overview} />
        </Switch>
      </main>
    );
  }
}

export default withMulti(
  App,
  translate,
  withObservable(accountObservable.subject, { propName: 'allAccounts' })
);
