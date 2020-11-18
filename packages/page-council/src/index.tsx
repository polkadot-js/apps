// Copyright 2017-2020 @polkadot/app-democracy authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Option } from '@polkadot/types';
import { AccountId } from '@polkadot/types/interfaces';
import { DeriveCollectiveProposal } from '@polkadot/api-derive/types';

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

interface Props {
  basePath: string;
  className?: string;
}

const transformPrime = {
  transform: (result: Option<AccountId>): AccountId | null => result.unwrapOr(null)
};

function CouncilTabs ({ basePath }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const numMotions = useCounter();
  const items = useMemo(() => [
    {
      isRoot: true,
      name: 'overview',
      text: t<string>('Council overview')
    },
    {
      count: numMotions,
      name: 'motions',
      text: t<string>('Motions')
    }
  ], [numMotions, t]);

  return (
    <Tabs
      basePath={basePath}
      items={items}
    />
  );
}

function CouncilApp ({ basePath }: Props): React.ReactElement<Props> {
  const { api } = useApi();
  const { pathname } = useLocation();
  const prime = useCall<AccountId | null>(api.query.council.prime, undefined, transformPrime) || null;
  const motions = useCall<DeriveCollectiveProposal[]>(api.derive.council.proposals);

  return (
    <div>
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
    </div>
  );
}

export const Component = React.memo(styled(CouncilApp)`
  .council--hidden {
    display: none;
  }
`);
export const TabsComponent = React.memo(CouncilTabs);
