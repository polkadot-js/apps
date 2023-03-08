// Copyright 2017-2023 @polkadot/app-signing authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AppProps as Props } from '@polkadot/react-components/types';

import React, { useRef } from 'react';
import { Route, Switch } from 'react-router';

import { Tabs } from '@polkadot/react-components';

import Sign from './Sign.js';
import { useTranslation } from './translate.js';
import Verify from './Verify.js';

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
    }
  ]);

  return (
    <main className='toolbox--App'>
      <Tabs
        basePath={basePath}
        items={itemsRef.current}
      />
      <Switch>
        <Route path={`${basePath}/verify`}><Verify /></Route>
        <Route><Sign /></Route>
      </Switch>
    </main>
  );
}

export default React.memo(SigningApp);
