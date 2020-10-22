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
        <Route>
          <Selection />
        </Route>
      </Switch>
    </main>
  );
}

export default React.memo(MasterSubmitApp);
