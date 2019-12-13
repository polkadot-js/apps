// Copyright 2019 @polkadot/app-generic-asset authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AppProps, BareProps, I18nProps } from '@polkadot/react-components/types';

import React from 'react';
import { Route, Switch } from 'react-router';
import { Tabs } from '@polkadot/react-components';

import Transfer from './Transfer';
import Assets from './Assets';

import translate from './translate';

interface Props extends AppProps, BareProps, I18nProps {}

function AssetApp ({ basePath, t }: Props): React.ReactElement<Props> {
  return (
    <main className='treasury--App'>
      <header>
        <Tabs
          basePath={basePath}
          items={[
            {
              isRoot: true,
              name: 'assets',
              text: t('Assets')
            },
            {
              name: 'transfer',
              text: t('Transfer')
            }
          ]}
        />
      </header>
      <Switch>
        <Route path={`${basePath}/transfer`} component={Transfer} />
        <Route component={Assets} />
      </Switch>
    </main>
  );
}

export default translate(AssetApp);
