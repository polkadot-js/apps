// Copyright 2017-2021 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { TFunction } from 'i18next';
import type { EndpointOption } from './types';

import { EndpointType } from '../../../../../ui/packages/ui-settings/src/types';
import { WESTEND_GENESIS } from '../api/constants';

/* eslint-disable sort-keys */

// The available endpoints that will show in the dropdown. For the most part (with the exception of
// Polkadot) we try to keep this to live chains only, with RPCs hosted by the community/chain vendor
//   info: The chain logo name as defined in ../ui/logos/index.ts in namedLogos (this also needs to align with @polkadot/networks)
//   text: The text to display on the dropdown
//   value: The actual hosted secure websocket endpoint

// Based on history, this will expand so keep it as a singular chunk
export function createWestend (t: TFunction): EndpointOption {
  return {
    dnslink: 'westend',
    genesisHash: WESTEND_GENESIS,
    info: 'westend',
    text: t('rpc.westend', 'Westend', { ns: 'apps-config' }),
    providers: {
      Parity: { type: 'json-rpc' as EndpointType, param: 'wss://westend-rpc.polkadot.io' },
      // 'NodeFactory(Vedran)': 'wss://westend.vedran.nodefactory.io/ws', // https://github.com/polkadot-js/apps/issues/5580
      'Patract Elara': { type: 'json-rpc' as EndpointType, param: 'wss://westend.elara.patract.io' },
      OnFinality: { type: 'json-rpc' as EndpointType, param: 'wss://westend.api.onfinality.io/public-ws' },
      Pinknode: { type: 'json-rpc' as EndpointType, param: 'wss://rpc.pinknode.io/westend/explorer' },
      'light client': { type: 'substrate-connect' as EndpointType, param: 'westend-substrate-connect' }
    },
    teleport: [1000],
    linked: [
      // (1) system parachains (none available yet)
      // ...
      // (2) common good, leave as second group
      {
        info: 'westmint',
        paraId: 1000,
        text: t('rpc.westend.shell', 'Westmint', { ns: 'apps-config' }),
        providers: {
          Parity: { type: 'json-rpc' as EndpointType, param: 'wss://westend-shell-rpc.parity.io' },
          'Patract Elara': { type: 'json-rpc' as EndpointType, param: 'wss://westmint.westend.elara.patract.io' }
        }
      },
      // (3) parachains with id, see Rococo (info here maps to the actual "named icon")
      //
      // NOTE: Added alphabetical based on chain name
      {
        info: 'basilisk',
        paraId: 2012,
        text: t('rpc.westend.basilisk', 'Basilisk Egg', { ns: 'apps-config' }),
        providers: {
          HydraDX: { type: 'json-rpc' as EndpointType, param: 'wss://rpc-01.basilisk-testnet.hydradx.io' }
        }
      },
      {
        info: 'charcoal',
        paraId: 2010,
        text: t('rpc.westend.charcoal', 'Charcoal', { ns: 'apps-config' }),
        providers: {
          Centrifuge: { type: 'json-rpc' as EndpointType, param: 'wss://fullnode-collator.charcoal.centrifuge.io' }
        }
      },
      {
        info: 'moonshadow',
        paraId: 2002,
        text: t('rpc.westend.moonshadow', 'Moonshadow', { ns: 'apps-config' }),
        providers: {
          Purestake: { type: 'json-rpc' as EndpointType, param: 'wss://wss.moonshadow.testnet.moonbeam.network' }
        }
      },
      {
        info: 'shibuya',
        isUnreachable: true, // https://github.com/polkadot-js/apps/issues/5489
        paraId: 2007,
        text: t('rpc.westend.shibuya', 'Shibuya', { ns: 'apps-config' }),
        providers: {
          StakeTechnologies: { type: 'json-rpc' as EndpointType, param: 'wss://rpc.shibuya.plasmnet.io' }
        }
      },
      {
        info: 'karura',
        paraId: 2005,
        text: t('rpc.westend.wendala', 'Wendala', { ns: 'apps-config' }),
        providers: {
          'Acala Foundation': { type: 'json-rpc' as EndpointType, param: 'wss://karura-westend-rpc.aca-staging.network' }
        }
      },
      {
        info: 'whala',
        paraId: 2013,
        text: t('rpc.westend.whala', 'Whala', { ns: 'apps-config' }),
        providers: {
          Phala: { type: 'json-rpc' as EndpointType, param: 'wss://whala.phala.network/ws' }
        }
      },
      {
        info: 'kilt',
        homepage: 'https://www.kilt.io/',
        paraId: 2009,
        text: t('rpc.westend.kilt', 'WILT', { ns: 'apps-config' }),
        providers: {
          'KILT Protocol': { type: 'json-rpc' as EndpointType, param: 'wss://westend.kilt.io:9977' }
        }
      }
    ]
  };
}
