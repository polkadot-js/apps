// Copyright 2019 @polkadot/app-generic-asset authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AppProps, BareProps, I18nProps } from '@polkadot/react-components/types';
import { TabItem } from '@polkadot/react-components/Tabs';

import React from 'react';
import { Route, Switch } from 'react-router';
import { Tabs } from '@polkadot/react-components';

import Transfer from './Transfer';
import Assets from './Assets';

import translate from './translate';

type Props = AppProps & BareProps & I18nProps;

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
          name: 'assets',
          text: t('Assets')
        },
        {
          name: 'transfer',
          text: t('Transfer')
        }
      ]
    };
  }

  public render (): React.ReactNode {
    const { basePath } = this.props;
    const { tabs } = this.state;

    return (
      <main className='treasury--App'>
        <header>
          <Tabs
            basePath={basePath}
            items={tabs}
          />
        </header>
        <Switch>
          <Route path={`${basePath}/transfer`} component={Transfer} />
          <Route component={Assets} />
        </Switch>
      </main>
    );
  }
}

export default translate(App);
