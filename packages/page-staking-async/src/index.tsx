// Copyright 2017-2025 @polkadot/app-staking-async authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { AppProps as Props } from '@polkadot/react-components/types';

import React, { useEffect, useMemo, useState } from 'react';

import { createWsEndpoints } from '@polkadot/apps-config';
import { styled } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';

import StakingRelayApp from './Relay/index.js';
import StakingSystemApp from './System/index.js';
import { getApi } from './utils.js';

const allEndPoints = createWsEndpoints((k, v) => v?.toString() || k);

function StakingApp ({ basePath, className = '', onStatusChange }: Props): React.ReactElement<Props> {
  const { api, apiEndpoint } = useApi();

  const [ahApi, setAhApi] = useState<ApiPromise>();
  const [rcApi, setRcApi] = useState<ApiPromise>();

  const isRelayChain = useMemo(() => !!api.tx.stakingAhClient, [api.tx.stakingAhClient]);

  const rcEndPoints = useMemo(() => {
    return (isRelayChain
      ? apiEndpoint?.providers
      : apiEndpoint?.valueRelay) || [];
  }, [apiEndpoint?.providers, apiEndpoint?.valueRelay, isRelayChain]);

  const ahEndPoints: string[] = useMemo(() => {
    if (isRelayChain) {
      return allEndPoints.find(({ genesisHashRelay, paraId }) =>
        paraId === 1000 && genesisHashRelay === api.genesisHash.toHex()
      )?.providers || [];
    }

    return apiEndpoint?.providers || [];
  }, [api.genesisHash, apiEndpoint?.providers, isRelayChain]);

  useEffect(() => {
    if (isRelayChain) {
      // Pick random endpoint
      const ahUrl = ahEndPoints.at(Math.floor(Math.random() * ahEndPoints.length));

      !!ahUrl && getApi(ahUrl).then((ahApi) => setAhApi(ahApi)).catch(console.log);
    } else {
      // Pick random endpoint
      const rcUrl = rcEndPoints.at(Math.floor(Math.random() * rcEndPoints.length));

      !!rcUrl && getApi(rcUrl).then((rcApi) => setRcApi(rcApi)).catch(console.log);
    }
  }, [ahEndPoints, isRelayChain, rcEndPoints]);

  return (
    <StyledMain className={`${className} staking--App`}>
      {isRelayChain
        ? (
          <StakingRelayApp
            ahApi={ahApi}
            ahEndPoints={ahEndPoints}
            basePath={basePath}
            isRelayChain={isRelayChain}
            onStatusChange={onStatusChange}
            rcApi={rcApi}
            rcEndPoints={rcEndPoints}
          />
        )
        : (
          <StakingSystemApp
            ahApi={ahApi}
            ahEndPoints={ahEndPoints}
            basePath={basePath}
            isRelayChain={isRelayChain}
            onStatusChange={onStatusChange}
            rcApi={rcApi}
            rcEndPoints={rcEndPoints}
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
