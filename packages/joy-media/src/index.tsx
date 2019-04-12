
import React from 'react';
import { Route, Switch } from 'react-router';

import { AppProps, I18nProps } from '@polkadot/ui-app/types';
import Tabs, { TabItem } from '@polkadot/ui-app/Tabs';

import './index.css';

import translate from './translate';
import Upload from './Upload';
import Explore from './Explore';
import { Play } from './View';

type Props = AppProps & I18nProps & {};

class App extends React.PureComponent<Props> {

  private buildTabs (): TabItem[] {
    const { t } = this.props;
    return [
      {
        name: 'media',
        text: t('Explore')
      },
      {
        name: 'upload',
        text: t('Upload')
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
          <Route component={Explore} />
        </Switch>
      </main>
    );
  }
}

export default translate(App);
