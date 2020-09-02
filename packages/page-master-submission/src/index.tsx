// Copyright 2017-2020 @polkadot/app-master-submission authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AppProps as Props } from '@polkadot/react-components/types';

import React, { useMemo } from 'react';
import { Route, Switch } from 'react-router';
import { Tabs } from '@polkadot/react-components';

import Selection from './Selection';
import Create from './Create';
import { useTranslation } from './translate';

function MasterSubmitApp ({ basePath }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const items = useMemo(() => [{
    isRoot: true,
    name: 'vote',
    text: t<string>('Proposal voting')
  }, {
    isRoot: false,
    name: 'create',
    text: t<string>('Proposal creation')
  }, {
    isRoot: false,
    name: 'execute',
    text: t<string>('Proposal execution')
  }], [t]);

  return (
    <main className='master-submit--App'>
      <header>
        <Tabs
          basePath={basePath}
          items={items}
        />
      </header>
      <Switch>
        <Route path={`${basePath}/create`}>
          <Create />
        </Route>
        <Route path={`${basePath}/execute`}>
          TODO
        </Route>
        <Route>
          <Selection />
        </Route>
      </Switch>
    </main>
  );
}

export default React.memo(MasterSubmitApp);
