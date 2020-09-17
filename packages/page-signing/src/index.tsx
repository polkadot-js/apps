// Copyright 2017-2020 @polkadot/app-signing authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { AppProps as Props } from '@polkadot/react-components/types';

import React, { useRef } from 'react';
import { Route, Switch } from 'react-router';
import Tabs from '@polkadot/react-components/Tabs';

import Hash from './Hash';
import Sign from './Sign';
import Verify from './Verify';
import { useTranslation } from './translate';

function SigningApp ({ basePath }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  const itemsRef = useRef([
    {
      isRoot: true,
      name: 'sign',
      text: t<string>('Sign message')
    },
    {
      name: 'verify',
      text: t<string>('Verify signature')
    },
    {
      name: 'hash',
      text: t<string>('Hash data')
    }
  ]);

  return (
    <main className='toolbox--App'>
      <header>
        <Tabs
          basePath={basePath}
          items={itemsRef.current}
        />
      </header>
      <Switch>
        <Route path={`${basePath}/hash`}><Hash /></Route>
        <Route path={`${basePath}/verify`}><Verify /></Route>
        <Route><Sign /></Route>
      </Switch>
    </main>
  );
}

export default React.memo(SigningApp);
