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
import Election from './Election';
import Applicants from './Applicants';
import Votes from './Votes';
import Reveals from './Reveals';

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
          name: 'election',
          text: t('Election')
        },
        {
          name: 'applicants',
          text: t('Applicants')
        },
        {
          name: 'votes',
          text: t('Votes')
        },
        {
          name: 'reveals',
          text: t('Reveals')
        }
      ]
    };
  }

  render () {
    const { basePath } = this.props;
    const { tabs } = this.state;
    return (
      <main className='election--App'>
        <header>
          <Tabs
            basePath={basePath}
            items={tabs}
          />
        </header>
        <Switch>
          <Route path={`${basePath}/applicants`} component={Applicants} />
          <Route path={`${basePath}/votes`} component={Votes} />
          <Route path={`${basePath}/reveals`} component={Reveals} />
          <Route component={Election} />
        </Switch>
      </main>
    );
  }
}

export default translate(App);
