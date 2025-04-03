// Copyright 2017-2025 @polkadot/app-staking-next authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AppProps as Props } from '@polkadot/react-components/types';

import React from 'react';
import { Route, Routes } from 'react-router';

import { styled, Tabs } from '@polkadot/react-components';
import { useAccounts } from '@polkadot/react-hooks';

const HIDDEN_ACC = ['actions', 'payout'];

function StakingApp ({ basePath, className = '' }: Props): React.ReactElement<Props> {
  const { areAccountsLoaded, hasAccounts } = useAccounts();

  return (
    <StyledMain className={`${className} staking--App`}>
      <Tabs
        basePath={basePath}
        hidden={
          areAccountsLoaded && !hasAccounts
            ? HIDDEN_ACC
            : undefined
        }
        items={[]}
      >
        <Routes>
          <Route path={basePath}>
            <Route
              element={
                <p>Staking Next Page</p>
                // <Bags ownStashes={ownStashes} />
              }
              index
              // path='bags'
            />
          </Route>

        </Routes>
      </Tabs>

    </StyledMain>);
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
