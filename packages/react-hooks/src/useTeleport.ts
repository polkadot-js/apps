// Copyright 2017-2021 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { LinkOption } from '@polkadot/apps-config/endpoints/types';
import type { ParaId } from '@polkadot/types/interfaces';

import { useEffect, useState } from 'react';

import { createWsEndpoints } from '@polkadot/apps-config';
import { isNumber } from '@polkadot/util';

import { useApi } from './useApi';
import { useCall } from './useCall';

interface Teleport {
  allowTeleport: boolean;
  destinations: LinkOption[];
  isParachain: boolean;
  paraId?: ParaId;
}

interface ExtLinkOption extends LinkOption {
  teleport: number[];
}

const DEFAULT_STATE: Teleport = {
  allowTeleport: false,
  destinations: [],
  isParachain: false
};

const endpoints = createWsEndpoints((k: string, v: string | undefined) => v || k).filter((v): v is ExtLinkOption =>
  !!v.teleport &&
  !!v.teleport.length
);

function extractRelayDestinations (relayGenesis: string, filter: (l: ExtLinkOption) => boolean): ExtLinkOption[] {
  return endpoints
    .filter((l) =>
      (
        l.genesisHashRelay === relayGenesis ||
        l.genesisHash === relayGenesis
      ) && filter(l)
    )
    .reduce((result: ExtLinkOption[], curr): ExtLinkOption[] => {
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
  const [state, setState] = useState<Teleport>(() => ({ ...DEFAULT_STATE }));

  useEffect((): void => {
    if (isApiReady) {
      const relayGenesis = api.genesisHash.toHex();
      const endpoint = endpoints.find(({ value }) =>
        value === apiUrl
      );

      if (endpoint) {
        const destinations = extractRelayDestinations(relayGenesis, ({ paraId }) =>
          isNumber(paraId) &&
          endpoint.teleport.includes(paraId)
        );

        setState((prev) => ({
          ...prev,
          allowTeleport: destinations.length !== 0,
          destinations
        }));
      }
    }
  }, [api, apiUrl, isApiReady]);

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
          ? extractRelayDestinations(endpoint.genesisHashRelay, ({ paraId }) =>
            endpoint.teleport.includes(isNumber(paraId) ? paraId : -1)
          )
          : [],
        isParachain: true,
        paraId: chainParaId
      }));
    }
  }, [apiUrl, chainParaId]);

  return state;
}
