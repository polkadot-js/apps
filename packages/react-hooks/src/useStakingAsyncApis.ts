// Copyright 2017-2025 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useEffect, useMemo, useState } from 'react';

import { ApiPromise, WsProvider } from '@polkadot/api';
import { createWsEndpoints } from '@polkadot/apps-config';
import { createNamedHook, useApi } from '@polkadot/react-hooks';

export const getApi = async (url: string[]|string) => {
  const api = await ApiPromise.create({
    provider: new WsProvider(url)
  });

  await api.isReadyOrError;

  return api;
};

const allEndPoints = createWsEndpoints((k, v) => v?.toString() || k);

function useStakingAsyncApisImpl () {
  const { api, apiEndpoint, isApiReady } = useApi(); // <- check readiness
  const [ahApi, setAhApi] = useState<ApiPromise>();
  const [rcApi, setRcApi] = useState<ApiPromise>();

  const isRelayChain = useMemo(() => {
    if (!isApiReady) {
      return false;
    }

    return !!api.tx.stakingAhClient;
  }, [isApiReady, api]);

  const isStakingAsyncPage = useMemo(() => {
    if (!isApiReady) {
      return false;
    }

    return !!((api.tx.stakingAhClient) || (api.tx.staking && api.tx.stakingRcClient));
  }, [isApiReady, api]);

  const rcEndPoints = useMemo(() => {
    if (!isApiReady) {
      return [];
    }

    return (isRelayChain
      ? apiEndpoint?.providers
      : apiEndpoint?.valueRelay) || [];
  }, [isApiReady, apiEndpoint, isRelayChain]);

  const ahEndPoints: string[] = useMemo(() => {
    if (!isApiReady) {
      return [];
    }

    if (isRelayChain) {
      return allEndPoints.find(({ genesisHashRelay, paraId }) =>
        paraId === 1000 && genesisHashRelay === api.genesisHash.toHex()
      )?.providers || [];
    }

    return apiEndpoint?.providers || [];
  }, [isApiReady, api, apiEndpoint, isRelayChain]);

  useEffect(() => {
    if (!isApiReady) {
      return;
    }

    if (isRelayChain) {
      const ahUrl = ahEndPoints.at(Math.floor(Math.random() * ahEndPoints.length));

      !!ahUrl && getApi(ahUrl).then(setAhApi).catch(console.error);
    } else {
      const rcUrl = rcEndPoints.at(Math.floor(Math.random() * rcEndPoints.length));

      !!rcUrl && getApi(rcUrl).then(setRcApi).catch(console.error);
    }
  }, [ahEndPoints, isApiReady, isRelayChain, rcEndPoints]);

  return {
    ahApi,
    ahEndPoints,
    isRelayChain,
    isStakingAsyncPage,
    rcApi,
    rcEndPoints
  };
}

export const useStakingAsyncApis = createNamedHook('useStakingAsyncApis', useStakingAsyncApisImpl);
