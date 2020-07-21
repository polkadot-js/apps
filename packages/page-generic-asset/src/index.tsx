// Copyright 2019 @polkadot/app-generic-asset authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, { useMemo } from 'react';
import { Route, Switch } from 'react-router';
import { Tabs } from '@polkadot/react-components';

import Transfer from './Transfer';
import Assets from './Assets';

import { useTranslation } from './translate';

interface Props {
  basePath: string;
}

function AssetApp ({ basePath }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const items = useMemo(() => [
    {
      isRoot: true,
      name: 'assets',
      text: t<string>('Assets')
    },
    {
      name: 'transfer',
      text: t<string>('Transfer')
    }
  ], [t]);

  return (
    <main className='treasury--App'>
      <header>
        <Tabs
          basePath={basePath}
          items={items}
        />
      </header>
      <Switch>
        <Route path={`${basePath}/transfer`}><Transfer /></Route>
        <Route><Assets /></Route>
      </Switch>
    </main>
  );
}

export default React.memo(AssetApp);
