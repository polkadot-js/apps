
import React from 'react';
import { Route, Switch } from 'react-router';

import { AppProps, I18nProps } from '@polkadot/ui-app/types';
import Tabs, { TabItem } from '@polkadot/ui-app/Tabs';

// our app-specific styles
import './index.css';

// local imports and components
import translate from './translate';
import Help from './Help';

// define out internal types
type Props = AppProps & I18nProps & {};

type State = {};

class App extends React.PureComponent<Props, State> {

  state: State = {};

  private buildTabs (): TabItem[] {
    const { t } = this.props;
    return [
      {
        name: 'help',
        text: t('Help and News')
      }
    ];
  }

  render () {
    const { basePath } = this.props;
    const tabs = this.buildTabs();
    return (
      <main className='JoyHelp'>
        <header>
          <Tabs basePath={basePath} items={tabs} />
        </header>
        <Switch>
          <Route component={Help} />
        </Switch>
      </main>
    );
  }
}

export default translate(
  App
);
