// Copyright 2017-2022 @polkadot/app-democracy authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useMemo } from 'react';
import { Route, Switch } from 'react-router';

import { HelpOverlay, Tabs } from '@polkadot/react-components';
import basicMd from './md/basic.md';
import Execute from './Execute';
import Overview from './Overview';
import { useTranslation } from './translate';

export { default as useCounter } from './useCounter';

interface Props {
  basePath: string;
}

function SupersigApp ({ basePath }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  const items = useMemo(() => [
    {
      isRoot: true,
      name: 'dashboard',
      text: t<string>('Dashboard')
    },
    {
      name: 'supersigs',
      text: t<string>('Supersigs')
    },
    {
      name: 'proposals',
      text: t<string>('Proposals')
    }
  ], [, t]);

  return (
    <main className='supersig--App'>
      <HelpOverlay md={basicMd as string} />
      <Tabs
        basePath={basePath}
        items={items}
      />
       <Overview />
      <Switch>
        <Route path={`${basePath}/supersigs`}>
          <Overview />
        </Route>
      </Switch>
      <Switch>
        <Route path={`${basePath}/proposals`}>
        </Route>
        <Route></Route>
      </Switch>
    </main>
  );
}

export default React.memo(SupersigApp);
