// Copyright 2017-2019 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DerivedCollectiveProposals } from '@polkadot/api-derive/types';
import { AppProps, BareProps, I18nProps } from '@polkadot/react-components/types';

import React from 'react';
import { useLocation, Route, Switch } from 'react-router';
import styled from 'styled-components';
import { Proposals, Tabs } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';

import Overview from './Overview';
import translate from './translate';

export { default as useCounter } from './useCounter';

interface Props extends AppProps, BareProps, I18nProps {}

function CouncilApp ({ basePath, className, t }: Props): React.ReactElement<Props> {
  const { api } = useApi();
  const { pathname } = useLocation();
  const proposals = useCall<DerivedCollectiveProposals>(api.derive.council.proposals, []);

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
              text: t('Motions ({{count}})', { replace: { count: proposals?.length || 0 } })
            }
          ]}
        />
      </header>
      <Switch>
        <Route path={`${basePath}/motions`}>
          <Proposals
            collective='council'
            proposals={proposals}
          />
        </Route>
      </Switch>
      <Overview className={[basePath, `${basePath}/candidates`].includes(pathname) ? '' : 'council--hidden'} />
    </main>
  );
}

export default translate(
  styled(CouncilApp)`
    .council--hidden {
      display: none;
    }
  `
);
