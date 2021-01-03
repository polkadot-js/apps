// Copyright 2017-2021 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useMemo } from 'react';
import { Route, Switch } from 'react-router';

import { Tabs } from '@polkadot/react-components';

import Overview from './Overview';
import { useTranslation } from './translate';

interface Props {
  basePath: string;
}

function ParachainsApp ({ basePath }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  const items = useMemo(() => [
    {
      isRoot: true,
      name: 'overview',
      text: t<string>('Parachains overview')
    }
  ], [t]);

  return (
    <main>
      <header>
        <Tabs
          basePath={basePath}
          isSequence
          items={items}
        />
      </header>
      <Switch>
        <Route>
          <Overview />
        </Route>
      </Switch>
    </main>
  );
}

export default React.memo(ParachainsApp);
