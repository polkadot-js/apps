// Copyright 2017-2022 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { EndpointOption } from './types';

import { WESTEND_GENESIS } from '../api/constants';
import { getTeleports } from './util';

/* eslint-disable sort-keys */

// The available endpoints that will show in the dropdown. For the most part (with the exception of
// Polkadot) we try to keep this to live chains only, with RPCs hosted by the community/chain vendor
//   info: The chain logo name as defined in ../ui/logos/index.ts in namedLogos (this also needs to align with @polkadot/networks)
//   text: The text to display on the dropdown
//   providers: The actual hosted secure websocket endpoint
//
// IMPORTANT: Alphabetical based on text
export const testParasWestend: EndpointOption[] = [
  {
    info: 'charcoal',
    paraId: 2086,
    text: 'Charcoal',
    providers: {
      // Centrifuge: 'wss://fullnode-collator.charcoal.centrifuge.io' // https://github.com/polkadot-js/apps/issues/8219
    }
  },
  {
    info: 'integritee',
    paraId: 2081,
    text: 'Integritee Network',
    providers: {
      Integritee: 'wss://teerw1.integritee.network'
    }
  },
  {
    info: 'interlay',
    paraId: 2094,
    text: 'Interlay',
    providers: {
      // Interlay: 'wss://api-westend.interlay.io/parachain' // https://github.com/polkadot-js/apps/issues/6261
    }
  },
  {
    info: 'moonshadow',
    paraId: 2002,
    text: 'Moonshadow',
    providers: {
      // PureStake: 'wss://wss.moonshadow.testnet.moonbeam.network' // https://github.com/polkadot-js/apps/issues/6181
    }
  },
  {
    info: 'pangoro',
    homepage: 'https://darwinia.network/',
    paraId: 2102,
    text: 'Pangoro',
    providers: {
      // Darwinia: 'wss://pangoro-parachain-rpc.darwinia.network' // https://github.com/polkadot-js/apps/issues/6530
    }
  },
  {
    info: 'westendPichiu',
    homepage: 'https://kylin.network/',
    paraId: 2112,
    text: 'Pichiu',
    providers: {
      'Kylin Network': 'wss://westend.kylin-node.co.uk'
    }
  },
  {
    info: 'westendStandard',
    paraId: 2094,
    text: 'Standard ',
    providers: {
      // 'Standard Protocol': 'wss://rpc.westend.standard.tech' // https://github.com/polkadot-js/apps/issues/8525
    }
  },
  {
    info: 'karura',
    paraId: 2005,
    text: 'Wendala',
    providers: {
      // 'Acala Foundation': 'wss://karura-westend-rpc.aca-staging.network' // https://github.com/polkadot-js/apps/issues/5830
    }
  },
  {
    info: 'whala',
    paraId: 2013,
    text: 'Whala',
    providers: {
      // Phala: 'wss://whala.phala.network/ws' // https://github.com/polkadot-js/apps/issues/6181
    }
  },
  {
    info: 'kilt',
    homepage: 'https://www.kilt.io/',
    paraId: 2085,
    text: 'WILT',
    providers: {
      'KILT Protocol': 'wss://westend.kilt.io:9977'
    }
  }
];

export const testParasWestendCommon: EndpointOption[] = [
  {
    info: 'westmint',
    paraId: 1000,
    text: 'Westmint',
    providers: {
      Parity: 'wss://westmint-rpc.polkadot.io',
      Dwellir: 'wss://westmint-rpc.dwellir.com',
      'Dwellir Tunisia': 'wss://westmint-rpc-tn.dwellir.com'
    },
    teleport: [-1]
  },
  {
    info: 'westendCollectives',
    paraId: 1001,
    text: 'Collectives',
    providers: {
      Parity: 'wss://westend-collectives-rpc.polkadot.io'
    },
    teleport: [-1]
  }
];

export const testRelayWestend: EndpointOption = {
  dnslink: 'westend',
  genesisHash: WESTEND_GENESIS,
  info: 'westend',
  text: 'Westend',
  providers: {
    Parity: 'wss://westend-rpc.polkadot.io',
    OnFinality: 'wss://westend.api.onfinality.io/public-ws',
    Pinknode: 'wss://rpc.pinknode.io/westend/explorer',
    Dwellir: 'wss://westend-rpc.dwellir.com',
    'Dwellir Tunisia': 'wss://westend-rpc-tn.dwellir.com',
    'Dotters Net': 'wss://rpc.dotters.network/westend',
    // 'NodeFactory(Vedran)': 'wss://westend.vedran.nodefactory.io/ws', // https://github.com/polkadot-js/apps/issues/5580
    // NOTE: Keep this as the last entry, nothing after it
    'light client': 'light://substrate-connect/westend' // NOTE: Keep last
  },
  teleport: getTeleports(testParasWestendCommon),
  linked: [
    ...testParasWestendCommon,
    ...testParasWestend
  ]
};
