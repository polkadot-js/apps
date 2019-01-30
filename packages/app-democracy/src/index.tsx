// Copyright 2017-2019 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AppProps, BareProps, I18nProps } from '@polkadot/ui-app/types';

import './index.css';

import React from 'react';
import { Tabs } from '@polkadot/ui-app/index';

import Proposals from './Proposals';
import Referendums from './Referendums';
import Summary from './Summary';
import translate from './translate';

type Props = AppProps & BareProps & I18nProps;

class App extends React.PureComponent<Props> {
  render () {
    const { basePath, t } = this.props;

    return (
      <main className='democracy--App'>
        <header>
          <Tabs
            basePath={basePath}
            items={[{
              name: 'overview',
              text: t('Democracy overview')
            }]}
          />
        </header>
        <Summary />
        <Referendums />
        <Proposals />
      </main>
    );
  }
}

export default translate(App);
