
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
import List from './List';
import DetailsByHandle from './DetailsByHandle';
import EditForm from './EditForm';

// define out internal types
type Props = AppProps & ApiProps & I18nProps & {
  firstMemberId?: BN,
  nextMemberId?: BN
};

class App extends React.PureComponent<Props> {

  private buildTabs (): TabItem[] {
    const { t, nextMemberId, firstMemberId } = this.props;
    let memberCount = 0;
    if (nextMemberId && firstMemberId) {
      memberCount = nextMemberId.sub(firstMemberId).toNumber();
    }
    return [
      {
        name: 'members',
        text: t('All members') + ` (${memberCount})`
      },
      {
        name: 'edit',
        text: t('Edit my profile')
      },
      {
        name: 'dashboard',
        text: t('Dashboard')
      }
    ];
  }

  private renderList () {
    const { firstMemberId, nextMemberId, ...otherProps } = this.props;
    return firstMemberId && nextMemberId
      ? <List firstMemberId={firstMemberId} nextMemberId={nextMemberId} {...otherProps} />
      : <em>Loading...</em>;
  }

  render () {
    const { basePath } = this.props;
    const tabs = this.buildTabs();
    const list = () => this.renderList();

    return (
      <main className='members--App'>
        <header>
          <Tabs basePath={basePath} items={tabs} />
        </header>
        <Switch>
          <Route path={`${basePath}/edit`} component={EditForm} />
          <Route path={`${basePath}/dashboard`} component={Dashboard} />
          <Route path={`${basePath}/:handle`} component={DetailsByHandle} />
          <Route render={list} />
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
