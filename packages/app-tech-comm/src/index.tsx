// Copyright 2017-2020 @polkadot/app-tech-comm authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DerivedCollectiveProposals } from '@polkadot/api-derive/types';
import { AppProps, BareProps } from '@polkadot/react-components/types';

import React, { useMemo } from 'react';
import { Route, Switch } from 'react-router';
import { useApi, useCall, useMembers } from '@polkadot/react-hooks';
import { Proposals, Tabs } from '@polkadot/react-components';

import Overview from './Overview';
import { useTranslation } from './translate';

export { default as useCounter } from './useCounter';

interface Props extends AppProps, BareProps {}

export default function TechCommApp ({ basePath, className }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const { members, isMember } = useMembers('technicalCommittee');
  const members = useCall<AccountId[]>(api.query.technicalCommittee.members, []);
  const proposals = useCall<DerivedCollectiveProposals>(api.derive.technicalCommittee.proposals, []);
  const items = useMemo(() => [
    {
      isRoot: true,
      name: 'overview',
      text: t('Tech. committee')
    },
    {
      name: 'proposals',
      text: t('Proposals ({{count}})', { replace: { count: proposals?.length || 0 } })
    }
  ], [proposals, t]);

  return (
    <main className={className}>
      <header>
        <Tabs
          basePath={basePath}
          items={items}
        />
      </header>
      <Switch>
        <Route path={`${basePath}/proposals`}>
          <Proposals
            collective='technicalCommittee'
            header={t('technical committee proposals')}
            isMember={isMember}
            members={members}
            placeholder={t('no proposals')}
            proposals={proposals}
            proposePrompt={t('Submit a new technical committee proposal')}
            thresholdHelp={(t('The minimum number of committee votes required to approve this proposal.'))}
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
