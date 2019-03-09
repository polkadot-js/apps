// Copyright 2017-2019 @polkadot/app-explorer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AppProps, BareProps, I18nProps } from '@polkadot/ui-app/types';

import './index.css';

import React from 'react';
import { Route, Switch } from 'react-router';
import Tabs, { TabItem } from '@polkadot/ui-app/Tabs';
import translate from './translate';

import BlockByHash from './BlockByHash';
import Main from './Main';import NodeInfo from './NodeInfo';

type Props = AppProps & BareProps & I18nProps;

type State = {
  items: Array<TabItem>
};

class ExplorerApp extends React.Component<Props, State> {
  constructor (props: Props) {
    super(props);

    const { t } = this.props;

    this.state = {
      items: [
        {
          name: 'chain',
          text: t('Chain info')
        },
        {
          hasParams: true,
          name: 'hash',
          text: t('Block query')
        },
        {
          name: 'node',
          text: t('Node info')
        }
      ]
    };
  }

  render () {
    const { basePath } = this.props;
    const { items } = this.state;

    return (
      <main className='explorer--App'>
        <header>
          <Tabs
            basePath={basePath}
            items={items}
          />
        </header>
        <Switch>
          <Route path={`${basePath}/hash/:hash`} component={BlockByHash} />
          <Route path={`${basePath}/hash`} component={BlockByHash} />
          <Route path={`${basePath}/node`} component={NodeInfo} />
          <Route component={Main} />
        </Switch>
      </main>
    );
  }
}

export default translate(ExplorerApp);
