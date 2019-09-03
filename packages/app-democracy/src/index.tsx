// Copyright 2017-2019 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AppProps, BareProps, I18nProps } from '@polkadot/react-components/types';
import { TabItem } from '@polkadot/react-components/Tabs';

import React from 'react';
import { Route, Switch } from 'react-router';
import { HelpOverlay, Tabs } from '@polkadot/react-components';
import uiSettings from '@polkadot/ui-settings';

import basicMd from './md/basic.md';
import Overview from './Overview';
import Propose from './Propose';
import translate from './translate';

interface Props extends AppProps, BareProps, I18nProps {}

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
          name: 'overview',
          text: t('Democracy overview')
        },
        {
          name: 'propose',
          text: t('Submit proposal')
        }
      ]
    };
  }

  public render (): React.ReactNode {
    const { basePath } = this.props;
    const { tabs } = this.state;
    const hidden = uiSettings.uiMode === 'full'
      ? []
      : ['propose'];

    return (
      <main className='democracy--App'>
        <HelpOverlay md={basicMd} />
        <header>
          <Tabs
            basePath={basePath}
            hidden={hidden}
            items={tabs}
          />
        </header>
        <Switch>
          <Route
            path={`${basePath}/propose`}
            render={(): React.ReactNode => <Propose basePath={basePath} />}
          />
          <Route component={Overview} />
        </Switch>
      </main>
    );
  }
}

export default translate(App);
