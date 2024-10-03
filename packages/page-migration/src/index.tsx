// Copyright 2017-2022 @polkadot/app-migration authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useRef } from 'react';
import { Route, Switch } from 'react-router';

import { Tabs } from '@polkadot/react-components';
import type { AppProps as Props } from '@polkadot/react-components/types';

import Migration from './Migration';
import { useTranslation } from './translate';

function MigrationApp ({ basePath }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  const itemsRef = useRef([
    {
      isRoot: true,
      name: 'migration',
      text: t<string>('Dock to Cheqd')
    }
  ]);

  return (
    <main className='migration--App'>
      <Tabs
        basePath={basePath}
        items={itemsRef.current}
      />
      <Switch>
        <Route><Migration /></Route>
      </Switch>
    </main>
  );
}

export default React.memo(MigrationApp);
