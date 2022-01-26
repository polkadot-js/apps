// Copyright 2017-2022 @polkadot/app-democracy authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveCollectiveProposal } from '@polkadot/api-derive/types';
import type { AccountId } from '@polkadot/types/interfaces';

import React, { useMemo } from 'react';
import { Route, Switch } from 'react-router';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';

import { Tabs } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';

import Motions from './Motions';
import Overview from './Overview';
import { useTranslation } from './translate';
import useCounter from './useCounter';

export { useCounter };

interface Props {
  basePath: string;
  className?: string;
}

function CouncilApp ({ basePath, className }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const { pathname } = useLocation();
  const numMotions = useCounter();
  const prime = useCall<AccountId | null>(api.derive.council.prime);
  const motions = useCall<DeriveCollectiveProposal[]>(api.derive.council.proposals);

  const items = useMemo(() => [
    {
      isRoot: true,
      name: 'overview',
      text: t<string>('Overview')
    },
    {
      count: numMotions,
      name: 'motions',
      text: t<string>('Motions')
    }
  ], [numMotions, t]);

  return (
    <main className={className}>
      <Tabs
        basePath={basePath}
        items={items}
      />
      <Switch>
        <Route path={`${basePath}/motions`}>
          <Motions
            motions={motions}
            prime={prime}
          />
        </Route>
      </Switch>
      <Overview
        className={[basePath, `${basePath}/candidates`].includes(pathname) ? '' : 'council--hidden'}
        prime={prime}
      />
    </main>
  );
}

export default React.memo(styled(CouncilApp)`
  .council--hidden {
    display: none;
  }
`);
