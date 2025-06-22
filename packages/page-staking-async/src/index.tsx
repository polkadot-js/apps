// Copyright 2017-2025 @polkadot/app-staking-async authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AppProps as Props } from '@polkadot/react-components/types';

import React from 'react';

import { styled } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';

import StakingRelayApp from './Relay/index.js';
import StakingSystemApp from './System/index.js';

function StakingApp ({ basePath, className = '', onStatusChange }: Props): React.ReactElement<Props> {
  const { api } = useApi();

  return (
    <StyledMain className={`${className} staking--App`}>
      {api?.tx?.stakingAhClient
        ? (
          <StakingRelayApp
            basePath={basePath}
            onStatusChange={onStatusChange}
          />
        )
        : (
          <StakingSystemApp
            basePath={basePath}
            onStatusChange={onStatusChange}
          />
        )
      }
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
