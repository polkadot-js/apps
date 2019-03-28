import { AppProps, I18nProps } from '@polkadot/ui-app/types';
import { ApiProps } from '@polkadot/ui-api/types';
import { SubjectInfo } from '@polkadot/ui-keyring/observable/types';
import { ComponentProps } from './props';
import { Request, Role } from './types';

import React from 'react';
import { Route, Switch } from 'react-router';
import { AccountId } from '@polkadot/types';
import Tabs, { TabItem } from '@polkadot/ui-app/Tabs';
import accountObservable from '@polkadot/ui-keyring/observable/accounts';
import { withCalls, withMulti, withObservable } from '@polkadot/ui-api/index';

import ActorsList from './ActorsList';
import Actions from './Actions';
import AvailableRoles from './AvailableRoles';

import './index.css';

import translate from './translate';

type Props = AppProps & ApiProps & I18nProps & {
  requests?: Array<Request>,
  actors?: Array<AccountId>,
  roles?: Array<Role>,
  allAccounts?: SubjectInfo,
};

type State = {
  tabs: Array<TabItem>,
  actors: Array<string>,
  requests: Array<Request>,
  roles: Array<Role>,
};

class App extends React.PureComponent<Props, State> {
  state: State;

  constructor (props: Props) {
    super(props);

    const { t } = props;

    this.state = {
      actors: [],
      requests: [],
      roles: [],
      tabs: [
        {
          name: 'live',
          text: t('Live')
        },
        {
          name: 'roles',
          text: t('Available Roles')
        },
        {
          name: 'actions',
          text: t('My requests')
        },
      ],
    };
  }

  static getDerivedStateFromProps ({ actors, requests, roles }: Props): State {
    return {
      actors: (actors || []).map((accountId) =>
        accountId.toString()
      ),
      requests: (requests || []).map((request) =>
        request
      ),
      roles: (roles || []).map((role) =>
        role
      ),
    } as State;
  }

  render () {
    const { allAccounts } = this.props;
    const { tabs } = this.state;
    const { basePath } = this.props;
    const hasAccounts = allAccounts && Object.keys(allAccounts).length;
    const filteredTabs = hasAccounts
      ? tabs
      : tabs.filter(({ name }) =>
        !['actions'].includes(name)
      );

    return (
      <main className='actors--App'>
        <header>
          <Tabs
            basePath={basePath}
            items={filteredTabs}
          />
        </header>
        <Switch>
          <Route path={`${basePath}/actions`} render={this.renderComponent(Actions)} />
          <Route path={`${basePath}/roles`} render={this.renderComponent(AvailableRoles)} />
          <Route render={this.renderComponent(ActorsList)} />
        </Switch>
      </main>
    );
  }

  private renderComponent (Component: React.ComponentType<ComponentProps>) {
    return (): React.ReactNode => {
      const { actors, requests, roles } = this.state;

      return (
        <Component
          actors={actors}
          requests={requests}
          roles={roles}
        />
      );
    };
  }

}

export default withMulti(
  App,
  translate,
  withObservable(accountObservable.subject, { propName: 'allAccounts' }),
  withCalls<Props>(
    ['query.actors.actors', { propName: 'actors' }],
    ['query.actors.roleEntryRequests', { propName: 'requests' }],
    ['query.actors.availableRoles', { propName: 'roles' }],
  )
);
