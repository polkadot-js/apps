// Copyright 2017-2019 @polkadot/app-transfer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AppProps, I18nProps } from '@polkadot/ui-app/types';

import React from 'react';
import { HelpOverlay,Tabs } from '@polkadot/ui-app';

import './index.css';
import basicMd from './md/basic.md';
import Transfer from './Transfer';
import translate from './translate';

type Props = AppProps & I18nProps;

class App extends React.PureComponent<Props> {
  render () {
    const { basePath, t } = this.props;

    return (
      <main className='transfer--App'>
        <HelpOverlay md={basicMd} />
        <header>
          <Tabs
            basePath={basePath}
            items={[{
              name: 'create',
              text: t('Balance transfer')
            }]}
          />
        </header>
        <Transfer />
      </main>
    );
  }
}

export default translate(App);
