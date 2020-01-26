// Copyright 2017-2020 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DerivedCollectiveProposals } from '@polkadot/api-derive/types';
import { AppProps, BareProps } from '@polkadot/react-components/types';

import React from 'react';
import { Route, Switch } from 'react-router';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { Proposals, Tabs } from '@polkadot/react-components';
import { useApi, useCall, useMembers } from '@polkadot/react-hooks';

import useCounter from './useCounter';
import Overview from './Overview';
import { useTranslation } from './translate';

export { useCounter };

interface Props extends AppProps, BareProps {}

function CouncilApp ({ basePath, className }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const { pathname } = useLocation();
  const { isMember, members } = useMembers('council');
  const numMotions = useCounter();
  const proposals = useCall<DerivedCollectiveProposals>(api.derive.council.proposals);

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
            header={t('council motions')}
            isMember={isMember}
            members={members}
            placeholder={t('no council motions')}
            proposals={proposals}
            proposePrompt={t('Submit a new council motion')}
            thresholdHelp={(t('The minimum number of council votes required to approve this motion.'))}
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
