import { AppProps, I18nProps } from '@polkadot/ui-app/types';

// external imports (including those found in the packages/*
// of this repo)
import React from 'react';
import { Route, Switch } from 'react-router';
import Tabs, { TabItem } from '@polkadot/ui-app/Tabs';

// our app-specific styles
import './index.css';

// local imports and components
import translate from './translate';
import Proposals from './Proposals';

// define out internal types
type Props = AppProps & I18nProps;

type State = {
  tabs: Array<TabItem>,
  accountId?: string
};

class App extends React.PureComponent<Props, State> {

  constructor (props: Props) {
    super(props);
    const { t } = this.props;
    this.state = {
      tabs: [
        {
          name: 'proposals',
          text: t('Proposals')
        }
      ]
    };
  }

  render () {
    const { basePath } = this.props;
    const { tabs } = this.state;
    return (
      <main className='proposals--App'>
        <header>
          <Tabs
            basePath={basePath}
            items={tabs}
          />
        </header>
        <Switch>
          <Route component={Proposals} />
        </Switch>
      </main>
    );
  }
}

export default translate(App);
