// Copyright 2017-2025 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { PropsWithChildren } from 'react';
import type { StakingAsyncApis } from './types.js';

import React, { useEffect, useMemo, useState } from 'react';

import { ApiPromise, WsProvider } from '@polkadot/api';
import { createWsEndpoints } from '@polkadot/apps-config';
import { useApi } from '@polkadot/react-hooks';

const allEndPoints = createWsEndpoints((k, v) => v?.toString() || k);

export const getApi = async (url: string[]|string) => {
  const api = await ApiPromise.create({
    provider: new WsProvider(url)
  });

  await api.isReadyOrError;

  return api;
};

const EMPTY_STATE: StakingAsyncApis = {
  ahEndPoints: [],
  isRelayChain: false,
  isStakingAsync: false,
  rcEndPoints: []
};

export const StakingAsyncApisCtx = React.createContext<StakingAsyncApis>(EMPTY_STATE);

export const StakingAsyncApisCtxRoot = ({ children }: PropsWithChildren) => {
  const { api, isApiReady } = useApi();

  return isApiReady &&
    !!((api.tx.stakingAhClient) || (api.tx.staking && api.tx.stakingRcClient))
    ? <StakingAsyncProvider>{children}</StakingAsyncProvider>
    : <>{children}</>;
};

export const StakingAsyncProvider = ({ children }: PropsWithChildren) => {
  const { api, apiEndpoint } = useApi();
  const [ahApi, setAhApi] = useState<ApiPromise>();
  const [rcApi, setRcApi] = useState<ApiPromise>();

  const isRelayChain = useMemo(() => {
    return !!api.tx.stakingAhClient;
  }, [api]);

  const isStakingAsync = useMemo(() => {
    return !!((api.tx.stakingAhClient) || (api.tx.staking && api.tx.stakingRcClient));
  }, [api]);

  const rcEndPoints = useMemo(() => {
    return (isRelayChain
      ? apiEndpoint?.providers
      : apiEndpoint?.valueRelay)?.filter((e) => e.startsWith('wss://')) || [];
  }, [apiEndpoint, isRelayChain]);

  const ahEndPoints: string[] = useMemo(() => {
    if (isRelayChain) {
      return allEndPoints.find(({ genesisHashRelay, paraId }) =>
        paraId === 1000 && genesisHashRelay === api.genesisHash.toHex()
      )?.providers || [];
    }

    return apiEndpoint?.providers?.filter((e) => e.startsWith('wss://')) || [];
  }, [api, apiEndpoint, isRelayChain]);

  useEffect(() => {
    if (isRelayChain) {
      const ahUrl = ahEndPoints.at(Math.floor(Math.random() * ahEndPoints.length));

      setRcApi(api);

      !!ahUrl && getApi(ahUrl).then(setAhApi).catch(console.error);
    } else {
      const rcUrl = rcEndPoints.at(Math.floor(Math.random() * rcEndPoints.length));

      setAhApi(api);

      !!rcUrl && getApi(rcUrl).then(setRcApi).catch(console.error);
    }
  }, [ahEndPoints, api, isRelayChain, rcEndPoints]);

  const state = useMemo(() => ({
    ahApi,
    ahEndPoints,
    isRelayChain,
    isStakingAsync,
    rcApi,
    rcEndPoints
  }), [ahApi, ahEndPoints, isRelayChain, isStakingAsync, rcApi, rcEndPoints]);

  return <StakingAsyncApisCtx.Provider value={state}>
    {children}
  </StakingAsyncApisCtx.Provider>;
};
