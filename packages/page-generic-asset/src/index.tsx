// Copyright 2019 @polkadot/app-generic-asset authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useRef } from 'react';
import { Route, Switch } from 'react-router';
import { Tabs } from '@polkadot/react-components';

import Transfer from './Transfer';
import Assets from './Assets';

import { useTranslation } from './translate';

interface Props {
  basePath: string;
}

function AssetTabs ({ basePath }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  const itemsRef = useRef([
    {
      isRoot: true,
      name: 'assets',
      text: t<string>('Assets')
    },
    {
      name: 'transfer',
      text: t<string>('Transfer')
    }
  ]);

  return (
    <Tabs
      basePath={basePath}
      items={itemsRef.current}
    />
  );
}

function AssetApp ({ basePath }: Props): React.ReactElement<Props> {
  return (
    <Switch>
      <Route path={`${basePath}/transfer`}><Transfer /></Route>
      <Route><Assets /></Route>
    </Switch>
  );
}

export const Component = React.memo(AssetApp);
export const TabsComponent = React.memo(AssetTabs);
