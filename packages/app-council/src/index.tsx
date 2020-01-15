// Copyright 2017-2020 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DerivedCollectiveProposals } from '@polkadot/api-derive/types';
import { AppProps, BareProps } from '@polkadot/react-components/types';
import { AccountId, Balance } from '@polkadot/types/interfaces';

import React, { useEffect, useState } from 'react';
import { Route, Switch } from 'react-router';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { Proposals, Tabs } from '@polkadot/react-components';
import { useAccounts, useApi, useCall } from '@polkadot/react-hooks';

import useCounter from './useCounter';
import Overview from './Overview';
import { useTranslation } from './translate';

export { useCounter };

interface Props extends AppProps, BareProps {}

function CouncilApp ({ basePath, className }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const { allAccounts } = useAccounts();
  const { pathname } = useLocation();
  const numMotions = useCounter();
  const members = useCall<[AccountId, Balance][]>(api.query.electionsPhragmen?.members || api.query.elections.members);
  const proposals = useCall<DerivedCollectiveProposals>(api.derive.council.proposals);

  const [isMember, setIsMember] = useState(false);
  useEffect((): void => {
    if (allAccounts && members) {
      setIsMember(
        members
          .map(([accountId]): string => accountId.toString())
          .some((accountId): boolean => allAccounts.includes(accountId))
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
              text: t('Council overview')
            },
            {
              name: 'candidates',
              text: t('Candidates')
            },
            {
              name: 'motions',
              text: t('Motions ({{count}})', { replace: { count: numMotions } })
            }
          ]}
        />
      </header>
      <Switch>
        <Route path={`${basePath}/motions`}>
          <Proposals
            collective='council'
            isMember={isMember}
            memberCount={members?.length || 0}
            proposals={proposals}
          />
        </Route>
      </Switch>
      <Overview className={[basePath, `${basePath}/candidates`].includes(pathname) ? '' : 'council--hidden'} />
    </main>
  );
}

export default styled(CouncilApp)`
  .council--hidden {
    display: none;
  }
`;
