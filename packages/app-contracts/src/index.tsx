// Copyright 2017-2019 @polkadot/app-contracts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AppProps, I18nProps } from '@polkadot/ui-app/types';
import { TabItem } from '@polkadot/ui-app/Tabs';
import { ComponentProps, LocationProps } from './types';

import React from 'react';
import { Route, Switch } from 'react-router';
import { HelpOverlay, Tabs } from '@polkadot/ui-app';

import introMd from './md/intro.md';
import store from './store';
import translate from './translate';
import Call from './Call';
import Code from './Code';
import Instantiate from './Instantiate';

type Props = AppProps & I18nProps;
type State = {
  tabs: Array<TabItem>,
  updated: number
};

class App extends React.PureComponent<Props, State> {
  state: State;

  constructor (props: Props) {
    super(props);

    const { t } = props;

    store.on('new-code', this.triggerUpdate);
    store.on('new-contract', this.triggerUpdate);

    this.state = {
      tabs: [
        {
          name: 'call',
          text: t('Call')
        },
        {
          name: 'instantiate',
          text: t('Instance')
        },
        {
          name: 'code',
          text: t('Code')
        }
      ],
      updated: 0
    };
  }

  render () {
    const { basePath } = this.props;
    const { tabs } = this.state;
    const hidden = store.hasContracts
      ? []
      : ['call'];

    if (!store.hasCode) {
      hidden.push('instantiate');
    }

    return (
      <main className='contracts--App'>
        <HelpOverlay md={introMd} />
        <header>
          <Tabs
            basePath={basePath}
            hidden={hidden}
            items={tabs}
          />
        </header>
        <Switch>
          <Route path={`${basePath}/instantiate`} render={this.renderComponent(Instantiate)} />
          <Route path={`${basePath}/code`} render={this.renderComponent(Code)} />
          <Route
            render={
              hidden.includes('call')
                ? (
                  hidden.includes('instantiate')
                    ? this.renderComponent(Code)
                    : this.renderComponent(Instantiate)
                )
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

  private triggerUpdate = (): void => {
    this.setState({ updated: Date.now() });
  }
}

export default translate(App);
