// Copyright 2017-2025 @polkadot/app-staking-next authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AppProps as Props } from '@polkadot/react-components/types';

import React, { useMemo } from 'react';
import { Route, Routes } from 'react-router';

import { styled, Tabs } from '@polkadot/react-components';
import { useAccounts, useApi, useAvailableSlashes, useOwnStashInfos } from '@polkadot/react-hooks';
import { isFunction } from '@polkadot/util';

import { useTranslation } from './translate.js';

const HIDDEN_ACC = ['actions', 'payout'];

function StakingApp ({ basePath, className = '' }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const { areAccountsLoaded, hasAccounts } = useAccounts();
  const ownStashes = useOwnStashInfos();
  const slashes = useAvailableSlashes();

  const hasStashes = useMemo(
    () => hasAccounts && !!ownStashes && (ownStashes.length !== 0),
    [hasAccounts, ownStashes]
  );

  const items = useMemo(() => [
    {
      isRoot: true,
      name: 'overview',
      text: t('Overview')
    },
    {
      name: 'actions',
      text: t('Accounts')
    },
    hasStashes && isFunction(api.query.staking.activeEra) && {
      name: 'payout',
      text: t('Payouts')
    },
    isFunction(api.query.nominationPools?.minCreateBond) && {
      name: 'pools',
      text: t('Pools')
    },
    {
      alias: 'returns',
      name: 'targets',
      text: t('Targets')
    },
    hasStashes && isFunction((api.query.voterBagsList || api.query.bagsList || api.query.voterList)?.counterForListNodes) && {
      name: 'bags',
      text: t('Bags')
    },
    {
      count: slashes.reduce((count, [, unapplied]) => count + unapplied.length, 0),
      name: 'slashes',
      text: t('Slashes')
    },
    {
      hasParams: true,
      name: 'query',
      text: t('Validator stats')
    }
  ].filter((q): q is { name: string; text: string } => !!q), [api, hasStashes, slashes, t]);

  return (
    <StyledMain className={`${className} staking--App`}>
      <Tabs
        basePath={basePath}
        hidden={
          areAccountsLoaded && !hasAccounts
            ? HIDDEN_ACC
            : undefined
        }
        items={items}
      />
      <Routes>
        <Route path={basePath}>
          <Route
            element={<h1>Root Page</h1>}
            index
          />
        </Route>
      </Routes>
    </StyledMain>
  );
}

const StyledMain = styled.main`
  .staking--Chart {
    margin-top: 1.5rem;

    h1 {
      margin-bottom: 0.5rem;
    }

    .ui--Spinner {
      margin: 2.5rem auto;
    }
  }

  .staking--optionsBar {
    margin: 0.5rem 0 1rem;
    text-align: center;
    white-space: normal;

    .staking--buttonToggle {
      display: inline-block;
      margin-right: 1rem;
      margin-top: 0.5rem;
    }
  }

  .ui--Expander.stakeOver {
    .ui--Expander-summary {
      color: var(--color-error);
    }
  }
`;

export default React.memo(StakingApp);
