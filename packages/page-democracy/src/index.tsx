// Copyright 2017-2021 @polkadot/app-democracy authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useMemo } from 'react';
import { Route, Switch } from 'react-router';

import { HelpOverlay, Tabs } from '@polkadot/react-components';

import useDispatchCounter from './Execute/useCounter';
import basicMd from './md/basic.md';
import Execute from './Execute';
import Overview from './Overview';
import { useTranslation } from './translate';

export { default as useCounter } from './useCounter';

interface Props {
  basePath: string;
}

function DemocracyApp ({ basePath }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const dispatchCount = useDispatchCounter();

  const items = useMemo(() => [
    {
      isRoot: true,
      name: 'overview',
      text: t<string>('Overview')
    },
    {
      count: dispatchCount,
      name: 'dispatch',
      text: t<string>('Dispatch')
    }
  ], [dispatchCount, t]);

  return (
    <main className='democracy--App'>
      <HelpOverlay md={basicMd as string} />
      <Tabs
        basePath={basePath}
        items={items}
      />
      <Switch>
        <Route path={`${basePath}/dispatch`}>
          <Execute />
        </Route>
        <Route><Overview /></Route>
      </Switch>
    </main>
  );
}

export default React.memo(DemocracyApp);
