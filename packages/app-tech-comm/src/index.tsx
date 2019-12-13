// Copyright 2017-2019 @polkadot/app-tech-comm authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AccountId, Hash } from '@polkadot/types/interfaces';
import { AppProps, BareProps, I18nProps } from '@polkadot/react-components/types';

import React from 'react';
import { Route, Switch } from 'react-router';
import { useApi, useCall } from '@polkadot/react-hooks';
import { Proposals, Tabs } from '@polkadot/react-components';

import Overview from './Overview';
import Summary from './Summary';
import translate from './translate';

export { default as useCounter } from './useCounter';

interface Props extends AppProps, BareProps, I18nProps {}

function App ({ basePath, className, t }: Props): React.ReactElement<Props> {
  const { api } = useApi();
  const members = useCall<AccountId[]>(api.query.technicalCommittee.members, []);
  const proposals = useCall<Hash[]>(api.query.technicalCommittee.proposals, []);

  return (
    <main className={className}>
      <header>
        <Tabs
          basePath={basePath}
          items={[
            {
              isRoot: true,
              name: 'overview',
              text: t('Tech. committee')
            },
            {
              name: 'proposals',
              text: t('Proposals ({{count}})', { replace: { count: proposals?.length || 0 } })
            }
          ]}
        />
      </header>
      <Summary
        members={members}
        proposals={proposals}
      />
      <Switch>
        <Route path={`${basePath}/proposals`}>
          <Proposals
            collective='technicalCommittee'
          />
        </Route>
        <Route path={basePath}>
          <Overview
            members={members}
            proposals={proposals}
          />
        </Route>
      </Switch>
    </main>
  );
}

export default translate(App);
