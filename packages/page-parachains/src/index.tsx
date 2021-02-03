// Copyright 2017-2021 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useMemo } from 'react';
import { Route, Switch } from 'react-router';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';

import { Tabs } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';

import useProposals from './Proposals/useProposals';
import Overview from './Overview';
import Proposals from './Proposals';
import { useTranslation } from './translate';

interface Props {
  basePath: string;
  className?: string;
}

function ParachainsApp ({ basePath, className }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const { pathname } = useLocation();
  const proposals = useProposals();

  const items = useMemo(() => [
    {
      isRoot: true,
      name: 'overview',
      text: t<string>('Parachains overview')
    },
    api.query.proposeParachain && {
      name: 'proposals',
      text: t<string>('Proposals')
    }
  ].filter((q): q is { name: string; text: string } => !!q), [api, t]);

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
          <Proposals proposals={proposals} />
        </Route>
      </Switch>
      <Overview
        className={basePath === pathname ? '' : 'parachains--hidden'}
        proposals={proposals}
      />
    </main>
  );
}

export default React.memo(styled(ParachainsApp)`
  .parachains--hidden {
    display: none;
  }

  a.chainAlign {
    display: inline-block;
    height: 24px;
    line-height: 24px;
    vertical-align: middle;
  }
`);
