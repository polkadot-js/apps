// Copyright 2017-2021 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ParaId } from '@polkadot/types/interfaces';

import { useEffect, useState } from 'react';

import { createWsEndpoints } from '@polkadot/apps-config';
import { isNumber } from '@polkadot/util';

import { useApi } from './useApi';
import { useCall } from './useCall';

interface Teleport {
  allowTeleport: boolean;
  destinations: number[];
  isParachain: boolean;
  paraId?: ParaId;
}

const endpoints = createWsEndpoints((k: string, v: string | undefined) => v || k).filter(({ allowTeleport }) => allowTeleport);

function extractRelayDestinations (relayGenesis: string): number[] {
  return endpoints
    .filter(({ genesisHashRelay }) => genesisHashRelay === relayGenesis)
    .map(({ paraId }) => paraId)
    .filter((paraId): paraId is number => isNumber(paraId));
}

export function useTeleport (): Teleport {
  const { api, apiUrl, isApiReady } = useApi();
  const chainParaId = useCall<ParaId>(isApiReady && api.query.parachainInfo?.parachainId);
  const [state, setState] = useState<Teleport>(() => ({
    allowTeleport: false,
    destinations: [],
    isParachain: false
  }));

  useEffect((): void => {
    if (isApiReady) {
      const destinations = extractRelayDestinations(api.genesisHash.toHex());

      setState((prev) => ({
        ...prev,
        allowTeleport: destinations.length !== 0,
        destinations
      }));
    }
  }, [api, isApiReady]);

  useEffect((): void => {
    if (chainParaId) {
      const endpoint = endpoints.find(({ paraId, value }) =>
        chainParaId.eq(paraId) &&
        value === apiUrl
      );

      setState((prev) => ({
        ...prev,
        allowTeleport: !!endpoint,
        destinations: endpoint && endpoint.genesisHashRelay
          ? extractRelayDestinations(endpoint.genesisHashRelay).filter((paraId) => !chainParaId.eq(paraId))
          : [],
        isParachain: true,
        paraId: chainParaId
      }));
    }
  }, [apiUrl, chainParaId]);

  console.log('useTeleport', JSON.stringify(state));

  return state;
}
