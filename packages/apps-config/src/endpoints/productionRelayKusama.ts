// Copyright 2017-2021 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { TFunction } from 'i18next';
import type { EndpointOption } from './types';

import { EndpointType } from '../../../../../ui/packages/ui-settings/src/types';
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
      Parity: { type: 'json-rpc' as EndpointType, param: 'wss://kusama-rpc.polkadot.io' },
      OnFinality: { type: 'json-rpc' as EndpointType, param: 'wss://kusama.api.onfinality.io/public-ws' },
      'Patract Elara': { type: 'json-rpc' as EndpointType, param: 'wss://kusama.elara.patract.io' },
      'light client': { type: 'substrate-connect' as EndpointType, param: 'kusama-substrate-connect' }
    },
    linked: [
      // (1) all system parachains (none available yet)
      // ...
      // (2) all common good parachains
      {
        info: 'shell',
        paraId: 1000,
        text: t('rpc.kusama.shell', 'Shell', { ns: 'apps-config' }),
        providers: {
          Parity: { type: 'json-rpc' as EndpointType, param: 'wss://kusama-shell-rpc.parity.io' }
        }
      },
      /// (3) parachains with id, see Rococo (info here maps to the actual "named icon")
      //
      // NOTE: Added alphabetical based on chain name
      {
        info: 'bifrost',
        paraId: 2001,
        text: t('rpc.kusama.bifrost', 'Bifrost', { ns: 'apps-config' }),
        providers: {
          Bifrost: { type: 'json-rpc' as EndpointType, param: 'wss://bifrost-rpc.liebi.com/ws' }
        }
      },
      {
        info: 'crab',
        paraId: 2006,
        text: t('rpc.kusama.crab', 'Darwinia Crab', { ns: 'apps-config' }),
        providers: {
          Crab: { type: 'json-rpc' as EndpointType, param: 'wss://crab-rpc.darwinia.network/' }
        }
      },
      {
        info: 'crust',
        paraId: 2012,
        text: t('rpc.kusama.shadow', 'Crust Shadow', { ns: 'apps-config' }),
        providers: {
          Crust: { type: 'json-rpc' as EndpointType, param: 'wss://shadow.crust.network/' }
        }
      },
      {
        info: 'khala',
        paraId: 2004,
        text: t('rpc.kusama.khala', 'Khala Network', { ns: 'apps-config' }),
        providers: {
          Phala: { type: 'json-rpc' as EndpointType, param: 'wss://khala.phala.network/ws' }
        }
      },
      {
        info: 'kilt',
        paraId: 2005,
        text: t('rpc.kusama.kilt', 'KILT Mainnet', { ns: 'apps-config' }),
        providers: {
          'KILT Protocol': { type: 'json-rpc' as EndpointType, param: 'wss://mainnet.kilt.io/' }
        }
      },
      {
        info: 'sherpax',
        paraId: 2013,
        text: t('rpc.kusama.sherpax', 'SherpaX', { ns: 'apps-config' }),
        providers: {
          ChainX: { type: 'json-rpc' as EndpointType, param: 'wss://sherpax.chainx.org' }
        }
      }
    ]
  };
}
