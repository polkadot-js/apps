// Copyright 2017-2020 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DerivedCollectiveProposals } from '@polkadot/api-derive/types';
import { AppProps, BareProps } from '@polkadot/react-components/types';

import React, { useMemo } from 'react';
import { Route, Switch } from 'react-router';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { Tabs } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';

import useCounter from './useCounter';
import Overview from './Overview';
import Motions from './Motions';
import { useTranslation } from './translate';

export { useCounter };

interface Props extends AppProps, BareProps {}

function CouncilApp ({ basePath, className }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const { pathname } = useLocation();
  const numMotions = useCounter();
  const motions = useCall<DerivedCollectiveProposals>(api.derive.council.proposals, []);
  const items = useMemo(() => [
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
  ], [numMotions, t]);

  return (
    <main className={className}>
      <header>
        <Tabs
          basePath={basePath}
          items={items}
        />
      </header>
      <Switch>
        <Route path={`${basePath}/motions`}>
          <Motions motions={motions} />
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
