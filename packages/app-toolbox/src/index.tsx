// Copyright 2017-2019 @polkadot/app-toolbox authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AppProps, I18nProps } from '@polkadot/ui-app/types';

import './index.css';

import React from 'react';
import { Route, Switch } from 'react-router';
import Tabs, { TabItem } from '@polkadot/ui-app/Tabs';

import Hash from './Hash';
import Rpc from './Rpc';
import Sign from './Sign';
import Verify from './Verify';
import translate from './translate';

type Props = AppProps & I18nProps;

type State = {
  tabs: Array<TabItem>
};

class ToolboxApp extends React.PureComponent<Props, State> {
  constructor (props: Props) {
    super(props);

    const { t } = this.props;

    this.state = {
      tabs: [
        {
          name: 'rpc',
          text: 'RPC calls'
        },
        {
          name: 'hash',
          text: t('Hash data')
        },
        {
          name: 'sign',
          text: t('Sign message')
        },
        {
          name: 'verify',
          text: t('Verify signature')
        }
      ]
    };
  }
  render () {
    const { basePath } = this.props;
    const { tabs } = this.state;

    return (
      <main className='toolbox--App'>
        <header>
          <Tabs
            basePath={basePath}
            items={tabs}
          />
        </header>
        <Switch>
          <Route path={`${basePath}/hash`} component={Hash} />
          <Route path={`${basePath}/sign`} component={Sign} />
          <Route path={`${basePath}/verify`} component={Verify} />
          <Route component={Rpc} />
        </Switch>
      </main>
    );
  }
}

export default translate(ToolboxApp);
