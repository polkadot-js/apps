// Copyright 2017-2021 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { TFunction } from 'i18next';
import type { EndpointOption } from './types';

import { KUSAMA_GENESIS } from '../api/constants';

/* eslint-disable sort-keys */

// The available endpoints that will show in the dropdown. For the most part (with the exception of
// Polkadot) we try to keep this to live chains only, with RPCs hosted by the community/chain vendor
//   info: The chain logo name as defined in ../ui/logos/index.ts in namedLogos (this also needs to align with @polkadot/networks)
//   text: The text to display on the dropdown
//   value: The actual hosted secure websocket endpoint
export function createKusama (t: TFunction): EndpointOption {
  return {
    dnslink: 'kusama',
    genesisHash: KUSAMA_GENESIS,
    info: 'kusama',
    text: t('rpc.kusama.parity', 'Kusama', { ns: 'apps-config' }),
    providers: {
      Parity: 'wss://kusama-rpc.polkadot.io',
      OnFinality: 'wss://kusama.api.onfinality.io/public-ws',
      'Patract Elara': 'wss://kusama.elara.patract.io'
    },
    linked: [
      // parachains with id, see Rococo
      // alphabetical based on chain name
      {
        info: 'khala',
        paraId: 2004,
        text: t('rpc.kusama.khala', 'Khala Network', { ns: 'apps-config' }),
        providers: {
          Phala: 'wss://khala.phala.network/ws'
        }
      }
    ]
  };
}
