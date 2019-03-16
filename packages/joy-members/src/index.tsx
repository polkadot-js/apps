
import BN from 'bn.js';
import React from 'react';
import { Route, Switch } from 'react-router';

import { AppProps, I18nProps } from '@polkadot/ui-app/types';
import { ApiProps } from '@polkadot/ui-api/types';
import { withCalls } from '@polkadot/ui-api/with';
import Tabs, { TabItem } from '@polkadot/ui-app/Tabs';

import './index.css';

import { queryMembershipToProp } from './utils';
import translate from './translate';
import Dashboard from './Dashboard';
import EditForm from './EditForm';

// define out internal types
type Props = AppProps & ApiProps & I18nProps & {
  firstMemberId?: BN,
  nextMemberId?: BN
};

type State = {};

class App extends React.PureComponent<Props, State> {

  state: State = {};

  private buildTabs (): TabItem[] {
    const { t, nextMemberId, firstMemberId } = this.props;
    let memberCount = 0;
    if (nextMemberId && firstMemberId) {
      memberCount = nextMemberId.sub(firstMemberId).toNumber();
    }
    return [
      {
        name: 'members',
        text: t('Dashboard')
      },
      {
        name: 'list',
        text: t('All members') + ` (${memberCount})`
      },
      {
        name: 'myProfile',
        text: t('My profile')
      }
    ];
  }

  render () {
    const { basePath } = this.props;
    const tabs = this.buildTabs();
    return (
      <main className='members--App'>
        <header>
          <Tabs basePath={basePath} items={tabs} />
        </header>
        <Switch>
          <Route path={`${basePath}/list`} component={Dashboard} />
          <Route path={`${basePath}/myProfile`} component={EditForm} />
          <Route path={`${basePath}/:accountId`} component={EditForm} />
          <Route component={Dashboard} />
        </Switch>
      </main>
    );
  }
}

export default translate(
  withCalls<Props>(
    queryMembershipToProp('firstMemberId'),
    queryMembershipToProp('nextMemberId')
  )(App)
);
