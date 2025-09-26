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
  const { api, apiEndpoint } = useApi();

  const [ahApi, setAhApi] = useState<ApiPromise>();
  const [rcApi, setRcApi] = useState<ApiPromise>();

  const isRelayChain = useMemo(() => !!api.tx.stakingAhClient, [api.tx.stakingAhClient]);

  const isStakingAsyncPage = useMemo(() => {
    return !!((api.tx.stakingAhClient) || (api.tx.staking && api.tx.stakingRcClient));
  }, [api.tx.staking, api.tx.stakingAhClient, api.tx.stakingRcClient]);

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
