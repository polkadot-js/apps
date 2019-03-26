
import BN from 'bn.js';
import React from 'react';
import { Route, Switch } from 'react-router';

import { AppProps, I18nProps } from '@polkadot/ui-app/types';
import { ApiProps } from '@polkadot/ui-api/types';
import { withCalls } from '@polkadot/ui-api/with';
import Tabs, { TabItem } from '@polkadot/ui-app/Tabs';

import './index.css';

import { queryMediaToProp } from './utils';
import translate from './translate';

function Explore (props: {}) {
  return <em>TODO Explore media content</em>;
}

function Play (props: {}) {
  return <em>TODO Play a media file by ID</em>;
}

function Upload (props: {}) {
  return <em>TODO Upload a media file</em>;
}

function Dashboard (props: {}) {
  return <em>TODO Dashboard with configuration</em>;
}

// define out internal types
type Props = AppProps & ApiProps & I18nProps & {};

class App extends React.PureComponent<Props> {

  private buildTabs (): TabItem[] {
    const { t } = this.props;
    return [
      {
        name: 'media',
        text: t('Explore content')
      },
      {
        name: 'upload',
        text: t('Upload')
      },
      {
        name: 'dashboard',
        text: t('Dashboard')
      }
    ];
  }

  render () {
    const { basePath } = this.props;
    const tabs = this.buildTabs();
    return (
      <main className='media--App'>
        <header>
          <Tabs basePath={basePath} items={tabs} />
        </header>
        <Switch>
          <Route path={`${basePath}/play/:fileId`} component={Play} />
          <Route path={`${basePath}/upload`} component={Upload} />
          <Route path={`${basePath}/dashboard`} component={Dashboard} />
          <Route render={Explore} />
        </Switch>
      </main>
    );
  }
}

export default translate(
  // withCalls<Props>(
  //   queryMediaToProp('nextFileId')
  // )(App)
  App
);
