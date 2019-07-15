// Copyright 2017-2019 @polkadot/app-settings authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AppProps, I18nProps } from '@polkadot/ui-app/types';
import { TabItem } from '@polkadot/ui-app/Tabs';

import React from 'react';
import { Route, Switch } from 'react-router';
import { HelpOverlay, Tabs } from '@polkadot/ui-app';
import uiSettings from '@polkadot/ui-settings';

import md from './md/basics.md';
import translate from './translate';
import Developer from './Developer';
import General from './General';

type Props = AppProps & I18nProps;

interface State {
  tabs: TabItem[];
}

class App extends React.PureComponent<Props, State> {
  public constructor (props: Props) {
    super(props);

    const { t } = props;

    this.state = {
      tabs: [
        {
          isRoot: true,
          name: 'general',
          text: t('General')
        },
        {
          name: 'developer',
          text: t('Developer')
        }
      ]
    };
  }

  public render (): React.ReactNode {
    const { basePath } = this.props;
    const { tabs } = this.state;
    const hidden = uiSettings.uiMode === 'full'
      ? []
      : ['developer'];

    return (
      <main className='settings--App'>
        <HelpOverlay md={md} />
        <header>
          <Tabs
            basePath={basePath}
            hidden={hidden}
            items={tabs}
          />
        </header>
        <Switch>
          <Route path={`${basePath}/developer`} render={this.DeveloperWithStatus} />
          <Route component={General} />
        </Switch>
      </main>
    );
  }

  private DeveloperWithStatus = () => {
    return (
      <Developer
        onStatusChange={() => this.props.onStatusChange}
        {...this.props}
      />
    );
  }
}

export default translate(App);
