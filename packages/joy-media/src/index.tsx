
import React from 'react';
import { Route, Switch } from 'react-router';

import { AppProps, I18nProps } from '@polkadot/ui-app/types';
import { ApiProps } from '@polkadot/ui-api/types';
import Tabs, { TabItem } from '@polkadot/ui-app/Tabs';

import './index.css';

import translate from './translate';
import Explore from './Explore';
import Play from './Play';
import Upload from './Upload';

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
          <Route path={`${basePath}/play/:assetName`} component={Play} />
          <Route path={`${basePath}/upload`} component={Upload} />
          <Route path={`${basePath}/dashboard`} component={Dashboard} />
          <Route component={Explore} />
        </Switch>
      </main>
    );
  }
}

export default translate(
  // TODO get count of uploaded content
  // withCalls<Props>(
  //   queryMediaToProp('nextFileId')
  // )(App)
  App
);
