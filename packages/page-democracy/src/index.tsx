// Copyright 2017-2020 @polkadot/app-democracy authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useMemo } from 'react';
import { Route, Switch } from 'react-router';
import { Tabs } from '@polkadot/react-components';

import basicMd from './md/basic.md';
import Execute from './Execute';
import useDispatchCounter from './Execute/useCounter';
import Overview from './Overview';
import { useTranslation } from './translate';

export { default as useCounter } from './useCounter';

interface Props {
  basePath: string;
}

function DemocracyTabs ({ basePath }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const dispatchCount = useDispatchCounter();
  const items = useMemo(() => [
    {
      isRoot: true,
      name: 'overview',
      text: t<string>('Democracy overview')
    },
    {
      count: dispatchCount,
      name: 'dispatch',
      text: t<string>('Dispatch')
    }
  ], [dispatchCount, t]);

  return (
    <Tabs
      basePath={basePath}
      items={items}
    />);
}

function DemocracyApp ({ basePath }: Props): React.ReactElement<Props> {
  return (
    <Switch>
      <Route path={`${basePath}/dispatch`}>
        <Execute />
      </Route>
      <Route><Overview /></Route>
    </Switch>
  );
}

export const Component = React.memo(DemocracyApp);
export const TabsComponent = React.memo(DemocracyTabs);
export const helpText = basicMd as string;
