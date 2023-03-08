// Copyright 2017-2023 @polkadot/app-runtime authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AppProps as Props } from '@polkadot/react-components/types';

import React, { useRef } from 'react';
import { Route, Switch } from 'react-router';

import { Tabs } from '@polkadot/react-components';

import Runtime from './Runtime.js';
import { useTranslation } from './translate.js';

function RuntimeApp ({ basePath }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  const itemsRef = useRef([
    {
      isRoot: true,
      name: 'runtime',
      text: t<string>('Calls')
    }
  ]);

  return (
    <main className='runtime--App'>
      <Tabs
        basePath={basePath}
        items={itemsRef.current}
      />
      <Switch>
        <Route><Runtime /></Route>
      </Switch>
    </main>
  );
}

export default React.memo(RuntimeApp);
