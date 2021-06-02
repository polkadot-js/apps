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

function extractRelayDestinations (relayGenesis: string, filter: (l: LinkOption) => boolean): LinkOption[] {
  return endpoints
    .filter((l) =>
      (
        l.genesisHashRelay === relayGenesis ||
        l.genesisHash === relayGenesis
      ) && filter(l)
    )
    .reduce((result: LinkOption[], curr): LinkOption[] => {
      if (!result.some(({ genesisHash, paraId }) => paraId === curr.paraId || genesisHash === curr.genesisHash)) {
        result.push(curr);
      }

      return result;
    }, [])
    .sort((a, b) =>
      a.isRelay === b.isRelay
        ? 0
        : a.isRelay
          ? -1
          : 1
    );
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
      const relayGenesis = api.genesisHash.toHex();
      const destinations = extractRelayDestinations(relayGenesis, ({ genesisHash }) => relayGenesis !== genesisHash);

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
        // FIXME Cannot quite get this working...
        allowTeleport: false, // !!endpoint,
        destinations: endpoint && endpoint.genesisHashRelay
          // FIXME we probably just want to check for !chainParaId.eq(paraId) || !!genesisHash (would affect Teleport modal)
          ? extractRelayDestinations(endpoint.genesisHashRelay, ({ genesisHash }) => !!genesisHash)
          : [],
        isParachain: true,
        paraId: chainParaId
      }));
    }
  }, [apiUrl, chainParaId]);

  console.log('useTeleport', JSON.stringify(state));

  return state;
}
