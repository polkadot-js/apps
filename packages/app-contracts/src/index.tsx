// Copyright 2017-2019 @polkadot/app-contracts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AppProps, I18nProps } from '@polkadot/ui-app/types';
import { TabItem } from '@polkadot/ui-app/Tabs';
import { ComponentProps, LocationProps } from './types';

import React from 'react';
import { Route, Switch } from 'react-router';
import { Tabs } from '@polkadot/ui-app';

import translate from './translate';
import Attach from './Attach';
import Call from './Call';
import Create from './Create';
import Deploy from './Deploy';

type Props = AppProps & I18nProps;
type State = {
  hidden: Array<string>,
  tabs: Array<TabItem>;
};

class App extends React.PureComponent<Props, State> {
  state: State;

  constructor (props: Props) {
    super(props);

    const { t } = props;

    this.state = {
      hidden: [],
      tabs: [
        {
          name: 'call',
          text: t('Call')
        },
        {
          name: 'attach',
          text: t('Add existing')
        },
        {
          name: 'create',
          text: t('Create new')
        },
        {
          name: 'deploy',
          text: t('Deploy code')
        }
      ]
    };
  }

  render () {
    const { basePath } = this.props;
    const { hidden, tabs } = this.state;

    return (
      <main className='contracts--App'>
        <header>
          <Tabs
            basePath={basePath}
            hidden={hidden}
            items={tabs}
          />
        </header>
        <Switch>
          <Route path={`${basePath}/attach`} render={this.renderComponent(Attach)} />
          <Route path={`${basePath}/create`} render={this.renderComponent(Create)} />
          <Route path={`${basePath}/create/:codeHash`} render={this.renderComponent(Create)} />
          <Route path={`${basePath}/deploy`} render={this.renderComponent(Deploy)} />
          <Route
            render={
              hidden.includes('call')
                ? this.renderComponent(Deploy)
                : this.renderComponent(Call)
            }
          />
        </Switch>
      </main>
    );
  }

  private renderComponent (Component: React.ComponentType<ComponentProps>) {
    return ({ match }: LocationProps) => {
      const { basePath, location, onStatusChange } = this.props;

      return (
        <Component
          basePath={basePath}
          location={location}
          match={match}
          onStatusChange={onStatusChange}
        />
      );
    };
  }
}

export default translate(App);
