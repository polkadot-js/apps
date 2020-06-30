// Copyright 2017-2020 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, { useMemo } from 'react';
import { Route, Switch } from 'react-router';
import { HelpOverlay, Tabs } from '@polkadot/react-components';
import uiSettings from '@polkadot/ui-settings';

import basicMd from './md/basic.md';
import Overview from './Overview';
import { useTranslation } from './translate';

export { default as useCounter } from './useCounter';

interface Props {
  basePath: string;
}

const hidden = uiSettings.uiMode === 'full'
  ? []
  : ['propose'];

function DemocracyApp ({ basePath }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const items = useMemo(() => [
    {
      isRoot: true,
      name: 'overview',
      text: t<string>('Democracy overview')
    }
  ], [t]);

  return (
    <main className='democracy--App'>
      <HelpOverlay md={basicMd as string} />
      <header>
        <Tabs
          basePath={basePath}
          hidden={hidden}
          items={items}
        />
      </header>
      <Switch>
        <Route component={Overview} />
      </Switch>
    </main>
  );
}

export default React.memo(DemocracyApp);
