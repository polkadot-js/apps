// Copyright 2017-2020 @polkadot/app-society authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useRef } from 'react';
import { Route, Switch } from 'react-router';
import { Tabs } from '@polkadot/react-components';

import Overview from './Overview';
import { useTranslation } from './translate';
import useCounter from './useCounter';

interface Props {
  basePath: string;
  className?: string;
}

export { useCounter };

function SocietyTabs ({ basePath }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  const itemsRef = useRef([
    {
      isRoot: true,
      name: 'overview',
      text: t<string>('Society overview')
    }
  ]);

  return (
    <Tabs
      basePath={basePath}
      items={itemsRef.current}
    />
  );
}

function SocietyApp (): React.ReactElement<Props> {
  return (
    <Switch>
      <Route component={Overview} />
    </Switch>
  );
}

export const Component = React.memo(SocietyApp);
export const TabsComponent = React.memo(SocietyTabs);
