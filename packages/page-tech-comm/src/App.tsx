// Copyright 2017-2022 @polkadot/app-tech-comm authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AccountId, Hash } from '@polkadot/types/interfaces';

import React, { useMemo } from 'react';
import { Route, Switch } from 'react-router';

import { Tabs } from '@polkadot/react-components';
import { useApi, useCall, useCollectiveMembers } from '@polkadot/react-hooks';

import Overview from './Overview';
import Proposals from './Proposals';
import { useTranslation } from './translate';

interface Props {
  basePath: string;
  className?: string;
  type: 'membership' | 'technicalCommittee';
}

const HIDDEN_EMPTY: string[] = [];
const HIDDEN_PROPOSALS: string[] = ['proposals'];

function TechCommApp ({ basePath, className, type }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const { isMember, members } = useCollectiveMembers(type);
  const prime = useCall<AccountId | null>(api.derive[type].prime);
  const hasProposals = useCall<boolean>(api.derive[type].hasProposals);
  const proposalHashes = useCall<Hash[]>(api.derive[type].proposalHashes);

  const items = useMemo(() => [
    {
      isRoot: true,
      name: 'overview',
      text: t<string>('Overview')
    },
    {
      name: 'proposals',
      text: t<string>('Proposals ({{count}})', { replace: { count: (proposalHashes && proposalHashes.length) || 0 } })
    }
  ], [proposalHashes, t]);

  return (
    <main className={className}>
      <Tabs
        basePath={basePath}
        hidden={
          hasProposals
            ? HIDDEN_EMPTY
            : HIDDEN_PROPOSALS
        }
        items={items}
      />
      <Switch>
        <Route path={`${basePath}/proposals`}>
          <Proposals
            isMember={isMember}
            members={members}
            prime={prime}
            proposalHashes={proposalHashes}
            type={type}
          />
        </Route>
        <Route path={basePath}>
          <Overview
            isMember={isMember}
            members={members}
            prime={prime}
            proposalHashes={proposalHashes}
            type={type}
          />
        </Route>
      </Switch>
    </main>
  );
}

export default React.memo(TechCommApp);
