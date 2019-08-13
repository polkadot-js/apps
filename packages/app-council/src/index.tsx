// Copyright 2017-2019 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AppProps, BareProps, I18nProps } from '@polkadot/react-components/types';
import { TabItem } from '@polkadot/react-components/Tabs';

import React from 'react';
import { Route, Switch } from 'react-router';
import { Tabs } from '@polkadot/react-components';

import Overview from './Overview';
import Motions from './Motions';
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
          text: t('Council overview')
        },
        {
          name: 'motions',
          text: t('Motions')
        }
      ]
    };
  }

  public render (): React.ReactNode {
    const { basePath } = this.props;
    const { tabs } = this.state;

    return (
      <main>
        <header>
          <Tabs
            basePath={basePath}
            items={tabs}
          />
        </header>
        <Switch>
          <Route path={`${basePath}/motions`} component={Motions} />
          <Route component={Overview} />
        </Switch>
      </main>
    );
  }
}

export default translate(App);
