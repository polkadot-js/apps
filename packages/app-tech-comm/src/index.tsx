// Copyright 2017-2020 @polkadot/app-tech-comm authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DerivedCollectiveProposals } from '@polkadot/api-derive/types';
import { AccountId } from '@polkadot/types/interfaces';
import { AppProps, BareProps } from '@polkadot/react-components/types';

import React, { useEffect, useState } from 'react';
import { Route, Switch } from 'react-router';
import { useAccounts, useApi, useCall } from '@polkadot/react-hooks';
import { Proposals, Tabs } from '@polkadot/react-components';

import Overview from './Overview';
import Summary from './Summary';
import { useTranslation } from './translate';

export { default as useCounter } from './useCounter';

interface Props extends AppProps, BareProps {}

export default function TechCommApp ({ basePath, className }: Props): React.ReactElement<Props> {
  const { api } = useApi();
  const { t } = useTranslation();
  const { allAccounts } = useAccounts();
  const proposals = useCall<DerivedCollectiveProposals>(api.derive.technicalCommittee.proposals);
  const members = useCall<AccountId[]>(api.query.technicalCommittee.members);

  const [isMember, setIsMember] = useState(false);
  useEffect((): void => {
    if (allAccounts && members) {
      setIsMember(
        members.some((accountId): boolean => allAccounts.includes(accountId.toString()))
      );
    }
  }, [allAccounts, members]);

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
            isMember={isMember}
            memberCount={members?.length || 0}
            proposals={proposals}
          />
        </Route>
        <Route path={basePath}>
          <Overview
            members={members}
          />
        </Route>
      </Switch>
    </main>
  );
}
