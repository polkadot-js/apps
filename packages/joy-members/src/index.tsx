
import React from 'react';
import { Route, Switch } from 'react-router';

import { AppProps, I18nProps } from '@polkadot/ui-app/types';
import { ApiProps } from '@polkadot/ui-api/types';
import { withCalls } from '@polkadot/ui-api/with';
import Tabs, { TabItem } from '@polkadot/ui-app/Tabs';

import './index.css';

import translate from './translate';
import Dashboard from './Dashboard';
import EditForm from './EditForm';

// define out internal types
type Props = AppProps & ApiProps & I18nProps & {};

type State = {};

class App extends React.PureComponent<Props, State> {

  state: State = {};

  private buildTabs (): TabItem[] {
    const { t } = this.props;
    return [
      {
        name: 'members',
        text: t('Dashboard')
      },
      {
        name: 'new',
        text: t('Register')
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
          <Route path={`${basePath}/new`} component={EditForm} />
          <Route path={`${basePath}/:accountId/edit`} component={EditForm} />
          <Route path={`${basePath}/:accountId`} component={EditForm} />
          <Route component={Dashboard} />
        </Switch>
      </main>
    );
  }
}

export default translate(
  withCalls<Props>(
    // query to get a total number of regirtered members.
  )(App)
);
