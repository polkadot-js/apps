// Copyright 2017-2022 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { TFunction } from 'i18next';
import type { EndpointOption } from './types';

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
      Parity: 'wss://westend-rpc.polkadot.io',
      OnFinality: 'wss://westend.api.onfinality.io/public-ws',
      Pinknode: 'wss://rpc.pinknode.io/westend/explorer',
      'light client': 'light://substrate-connect/westend'
      // 'NodeFactory(Vedran)': 'wss://westend.vedran.nodefactory.io/ws', // https://github.com/polkadot-js/apps/issues/5580
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
          Parity: 'wss://westmint-rpc.polkadot.io'
        },
        teleport: [-1]
      },
      // (3) parachains with id, see Rococo (info here maps to the actual "named icon")
      //
      // NOTE: Added alphabetical based on chain name
      {
        info: 'basilisk',
        isUnreachable: true, // https://github.com/polkadot-js/apps/issues/6422
        paraId: 2097,
        text: t('rpc.westend.basilisk', 'Basilisk Egg', { ns: 'apps-config' }),
        providers: {
          HydraDX: 'wss://rpc-01.basilisk-testnet.hydradx.io'
        }
      },
      {
        info: 'charcoal',
        paraId: 2086,
        text: t('rpc.westend.charcoal', 'Charcoal', { ns: 'apps-config' }),
        providers: {
          Centrifuge: 'wss://fullnode-collator.charcoal.centrifuge.io'
        }
      },
      {
        info: 'encointer',
        paraId: 1001,
        text: t('rpc.westend.encointer', 'Encointer Network', { ns: 'apps-config' }),
        providers: {
          'Encointer Association': 'wss://api.westend.encointer.org'
        }
      },
      {
        info: 'integritee',
        paraId: 2081,
        text: t('rpc.westend.integritee', 'Integritee Network', { ns: 'apps-config' }),
        providers: {
          Integritee: 'wss://teerw1.integritee.network'
        }
      },
      {
        info: 'interlay',
        isUnreachable: true, // https://github.com/polkadot-js/apps/issues/6261
        paraId: 2094,
        text: t('rpc.westend.interbtc', 'Interlay', { ns: 'apps-config' }),
        providers: {
          Interlay: 'wss://api-westend.interlay.io/parachain'
        }
      },
      {
        info: 'moonshadow',
        isUnreachable: true, // https://github.com/polkadot-js/apps/issues/6181
        paraId: 2002,
        text: t('rpc.westend.moonshadow', 'Moonshadow', { ns: 'apps-config' }),
        providers: {
          PureStake: 'wss://wss.moonshadow.testnet.moonbeam.network'
        }
      },
      {
        info: 'pangoro',
        isUnreachable: true, // https://github.com/polkadot-js/apps/issues/6530
        homepage: 'https://darwinia.network/',
        paraId: 2102,
        text: t('rpc.westend.pangoro', 'Pangoro', { ns: 'apps-config' }),
        providers: {
          Darwinia: 'wss://pangoro-parachain-rpc.darwinia.network'
        }
      },
      {
        info: 'westendPichiu',
        homepage: 'https://kylin.network/',
        paraId: 2112,
        text: t('westend.kylin-node.co.uk', 'Pichiu', { ns: 'apps-config' }),
        providers: {
          'Kylin Network': 'wss://westend.kylin-node.co.uk'
        }
      },
      {
        info: 'westendStandard',
        paraId: 2094,
        text: t('rpc.westend.standard', 'Standard ', { ns: 'apps-config' }),
        providers: {
          'Standard Protocol': 'wss://rpc.westend.standard.tech'
        }
      },
      {
        info: 'karura',
        isUnreachable: true, // https://github.com/polkadot-js/apps/issues/5830
        paraId: 2005,
        text: t('rpc.westend.wendala', 'Wendala', { ns: 'apps-config' }),
        providers: {
          'Acala Foundation': 'wss://karura-westend-rpc.aca-staging.network'
        }
      },
      {
        info: 'whala',
        isUnreachable: true, // https://github.com/polkadot-js/apps/issues/6181
        paraId: 2013,
        text: t('rpc.westend.whala', 'Whala', { ns: 'apps-config' }),
        providers: {
          Phala: 'wss://whala.phala.network/ws'
        }
      },
      {
        info: 'kilt',
        homepage: 'https://www.kilt.io/',
        paraId: 2085,
        text: t('rpc.westend.kilt', 'WILT', { ns: 'apps-config' }),
        providers: {
          'KILT Protocol': 'wss://westend.kilt.io:9977'
        }
      }
    ]
  };
}
