// Copyright 2017-2021 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { LinkOption } from '@polkadot/apps-config/endpoints/types';
import type { ParaId } from '@polkadot/types/interfaces';

import { useEffect, useState } from 'react';

import { createWsEndpoints } from '@polkadot/apps-config';

import { useApi } from './useApi';
import { useCall } from './useCall';

interface Teleport {
  allowTeleport: boolean;
  destinations: LinkOption[];
  isParachain: boolean;
  paraId?: ParaId;
}

const endpoints = createWsEndpoints((k: string, v: string | undefined) => v || k).filter(({ allowTeleport }) => allowTeleport);

function extractRelayDestinations (relayGenesis: string, chainParaId?: ParaId): LinkOption[] {
  return endpoints
    .filter(({ genesisHashRelay, paraId }) =>
      genesisHashRelay === relayGenesis &&
      (!chainParaId || !chainParaId.eq(paraId))
    )
    .reduce((result: LinkOption[], curr): LinkOption[] => {
      if (!result.some(({ paraId }) => paraId === curr.paraId)) {
        result.push(curr);
      }

      return result;
    }, []);
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
        // FIXME allow from para to other or to relay (needs fix in the modal)
        allowTeleport: false, // !!endpoint,
        destinations: endpoint && endpoint.genesisHashRelay
          ? extractRelayDestinations(endpoint.genesisHashRelay, chainParaId)
          : [],
        isParachain: true,
        paraId: chainParaId
      }));
    }
  }, [apiUrl, chainParaId]);

  console.log('useTeleport', JSON.stringify(state));

  return state;
}
