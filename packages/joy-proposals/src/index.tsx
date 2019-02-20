
import React from 'react';
import { Route, Switch } from 'react-router';
import { AppProps, I18nProps } from '@polkadot/ui-app/types';
import Tabs, { TabItem } from '@polkadot/ui-app/Tabs';

// our app-specific styles
import './index.css';

// local imports and components
import translate from './translate';
import Proposals from './Proposals';
import NewForm from './NewForm';

function Active () {
  return <Proposals title='Active proposals' showActive />;
}

function Finalized () {
  return <Proposals title='Finalized proposals' showAccepted showRejected showSlashed />;
}

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
          name: 'active',
          text: t('Active')
        },
        {
          name: 'finalized',
          text: t('Finalized')
        },
        {
          name: 'new',
          text: t('Create new')
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
          <Tabs basePath={basePath} items={tabs} />
        </header>
        <Switch>
          <Route path={`${basePath}/finalized`} component={Finalized} />
          <Route path={`${basePath}/new`} component={NewForm} />
          <Route component={Active} />
        </Switch>
      </main>
    );
  }
}

export default translate(App);
