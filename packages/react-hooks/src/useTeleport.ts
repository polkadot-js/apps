// Copyright 2017-2022 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { LinkOption } from '@polkadot/apps-config/endpoints/types';
import type { ParaId } from '@polkadot/types/interfaces';

import { useEffect, useState } from 'react';

import { createWsEndpoints } from '@polkadot/apps-config';
import { isNumber } from '@polkadot/util';

import { createNamedHook } from './createNamedHook';
import { useApi } from './useApi';
import { useCall } from './useCall';

interface Teleport {
  allowTeleport: boolean;
  destinations: LinkOption[];
  isParaTeleport?: boolean;
  isRelayTeleport?: boolean;
  oneWay: number[]
}

interface ExtLinkOption extends LinkOption {
  teleport: number[];
}

const DEFAULT_STATE: Teleport = {
  allowTeleport: false,
  destinations: [],
  oneWay: []
};

const endpoints = createWsEndpoints((k: string, v?: string) => v || k).filter((v): v is ExtLinkOption => !!v.teleport);

function extractRelayDestinations (relayGenesis: string, filter: (l: ExtLinkOption) => boolean): ExtLinkOption[] {
  return endpoints
    .filter((l) =>
      (
        l.genesisHashRelay === relayGenesis ||
        l.genesisHash === relayGenesis
      ) && filter(l)
    )
    .reduce((result: ExtLinkOption[], curr): ExtLinkOption[] => {
      const isExisting = result.some(({ genesisHash, paraId }) =>
        paraId === curr.paraId ||
        (genesisHash && genesisHash === curr.genesisHash)
      );

      if (!isExisting) {
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

function useTeleportImpl (): Teleport {
  const { api, apiUrl, isApiReady } = useApi();
  const paraId = useCall<ParaId>(isApiReady && api.query.parachainInfo?.parachainId);
  const [state, setState] = useState<Teleport>(() => ({ ...DEFAULT_STATE }));

  useEffect((): void => {
    if (isApiReady) {
      const relayGenesis = api.genesisHash.toHex();
      const endpoint = endpoints.find(({ genesisHash }) => genesisHash === relayGenesis);

      if (endpoint) {
        const destinations = extractRelayDestinations(relayGenesis, ({ paraId }) =>
          isNumber(paraId) &&
          endpoint.teleport.includes(paraId)
        );
        const oneWay = extractRelayDestinations(relayGenesis, ({ paraId, teleport }) =>
          isNumber(paraId) &&
          !teleport.includes(-1)
        ).map(({ paraId }) => paraId || -1);

        setState({
          allowTeleport: destinations.length !== 0,
          destinations,
          isRelayTeleport: true,
          oneWay
        });
      }
    }
  }, [api, isApiReady]);

  useEffect((): void => {
    if (paraId) {
      const endpoint = endpoints.find(({ value }) => value === apiUrl);

      if (endpoint && endpoint.genesisHashRelay) {
        const destinations = extractRelayDestinations(endpoint.genesisHashRelay, ({ paraId }) =>
          endpoint.teleport.includes(isNumber(paraId) ? paraId : -1)
        );
        const oneWay = extractRelayDestinations(endpoint.genesisHashRelay, ({ paraId, teleport }) =>
          !teleport.includes(isNumber(paraId) ? paraId : -1)
        ).map(({ paraId }) => paraId || -1);

        setState({
          allowTeleport: destinations.length !== 0,
          destinations,
          isParaTeleport: true,
          oneWay
        });
      }
    }
  }, [apiUrl, paraId]);

  return state;
}

export const useTeleport = createNamedHook('useTeleport', useTeleportImpl);
