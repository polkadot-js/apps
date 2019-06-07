// Copyright 2017-2019 @polkadot/app-contracts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AppProps, I18nProps } from '@polkadot/ui-app/types';
import { ComponentProps, LocationProps } from './types';

import React from 'react';
import { Route, RouteComponentProps, Switch } from 'react-router';
import { withRouter } from 'react-router-dom';
import { HelpOverlay, Tabs } from '@polkadot/ui-app';
import { withMulti, withObservable } from '@polkadot/ui-api';
import keyring from '@polkadot/ui-keyring';
import { SubjectInfo } from '@polkadot/ui-keyring/observable/types';

import introMd from './md/intro.md';
import store from './store';
import translate from './translate';
import Contracts from './Contracts';
import Codes from './Codes';
import Deploy from './Deploy';

type Props = AppProps & I18nProps & RouteComponentProps & {
  accounts: SubjectInfo[],
  contracts: SubjectInfo[]
};

type State = {
  codeHash?: string,
  hasContracts: boolean,
  isDeployOpen: boolean,
  updated: number
};

class App extends React.PureComponent<Props, State> {
  state: State = {
    hasContracts: false,
    isDeployOpen: false,
    updated: 0
  };

  constructor (props: Props) {
    super(props);

    store.on('new-code', this.triggerUpdate);
    store.on('removed-code', this.triggerUpdate);

    // since we have a dep on the async API, we load here
    store.loadAll().catch(() => {
      // noop, handled internally
    });
  }

  static getDerivedStateFromProps ({ contracts }: Props): State {
    const hasContracts = !!contracts && Object.keys(contracts).length >= 1;

    return {
      hasContracts
    } as State;
  }

  render () {
    const { basePath, t } = this.props;
    const { codeHash, isDeployOpen } = this.state;
    const hidden: Array<string> = [];

    return (
      <main className='contracts--App'>
        <HelpOverlay md={introMd} />
        <header>
          <Tabs
            basePath={basePath}
            hidden={hidden}
            items={[
              {
                name: 'code',
                text: 'Code'
              },
              {
                isRoot: true,
                name: 'contracts',
                text: 'Contracts'
              }
            ].map(tab => ({ ...tab, text: t(tab.text) }))
            }
          />
        </header>
        <Switch>
          <Route path={`${basePath}/code`} render={this.renderComponent(Codes)} />
          <Route render={this.renderComponent(Contracts)} exact />
        </Switch>
        <Deploy
          basePath={basePath}
          codeHash={codeHash}
          isOpen={isDeployOpen}
          onClose={this.hideDeploy}
        />
      </main>
    );
  }

  private renderComponent (Component: React.ComponentType<ComponentProps>) {
    return ({ match }: LocationProps) => {
      const { accounts, basePath, contracts, location, onStatusChange } = this.props;

      if (!contracts) {
        return null;
      }

      return (
        <Component
          accounts={accounts}
          basePath={basePath}
          contracts={contracts}
          hasCode={store.hasCode}
          location={location}
          match={match}
          onStatusChange={onStatusChange}
          showDeploy={this.showDeploy}
        />
      );
    };
  }

  private showDeploy = (codeHash?: string) => () => {
    this.setState({
      codeHash: codeHash || undefined,
      isDeployOpen: true
    });
  }

  private hideDeploy = () => {
    this.setState({ isDeployOpen: false });
  }

  private triggerUpdate = (): void => {
    this.setState({ updated: Date.now() });
  }
}
export default withMulti(
  App,
  translate,
  withObservable(keyring.accounts.subject, { propName: 'accounts' }),
  withObservable(keyring.contracts.subject, { propName: 'contracts' }),
  withRouter
);
