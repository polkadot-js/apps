// Copyright 2017-2023 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { EndpointOption } from './types.js';

import { WESTEND_GENESIS } from '../api/constants.js';
import { chainsKaruraSVG, chainsStandardPNG } from '../ui/logos/chains/index.js';
import { nodesAssetHubSVG, nodesBridgeHubSVG, nodesCentrifugePNG, nodesIntegriteeSVG, nodesInterlaySVG, nodesKhalaSVG, nodesKiltPNG, nodesKylinPNG, nodesMoonshadowPNG, nodesWestendColourSVG } from '../ui/logos/nodes/index.js';
import { getTeleports } from './util.js';

// The available endpoints that will show in the dropdown. For the most part (with the exception of
// Polkadot) we try to keep this to live chains only, with RPCs hosted by the community/chain vendor
//   info: The chain logo name as defined in ../ui/logos/index.ts in namedLogos (this also needs to align with @polkadot/networks)
//   text: The text to display on the dropdown
//   providers: The actual hosted secure websocket endpoint
//
// IMPORTANT: Alphabetical based on text
export const testParasWestend: Omit<EndpointOption, 'teleport'>[] = [
  {
    info: 'charcoal',
    paraId: 2086,
    providers: {
      // Centrifuge: 'wss://fullnode-collator.charcoal.centrifuge.io' // https://github.com/polkadot-js/apps/issues/8219
    },
    text: 'Charcoal',
    ui: {
      logo: nodesCentrifugePNG
    }
  },
  {
    info: 'integritee',
    paraId: 2081,
    providers: {
      // Integritee: 'wss://teerw1.integritee.network' // https://github.com/polkadot-js/apps/issues/8937
    },
    text: 'Integritee Network',
    ui: {
      color: '#658ea9',
      logo: nodesIntegriteeSVG
    }
  },
  {
    info: 'interlay',
    paraId: 2094,
    providers: {
      // Interlay: 'wss://api-westend.interlay.io/parachain' // https://github.com/polkadot-js/apps/issues/6261
    },
    text: 'Interlay',
    ui: {
      logo: nodesInterlaySVG
    }
  },
  {
    info: 'moonshadow',
    paraId: 2002,
    providers: {
      // PureStake: 'wss://wss.moonshadow.testnet.moonbeam.network' // https://github.com/polkadot-js/apps/issues/6181
    },
    text: 'Moonshadow',
    ui: {
      color: '#53cbc9',
      logo: nodesMoonshadowPNG
    }
  },
  {
    homepage: 'https://kylin.network/',
    info: 'westendPichiu',
    paraId: 2112,
    providers: {
      // 'Kylin Network': 'wss://westend.kylin-node.co.uk' // https://github.com/polkadot-js/apps/issues/8710
    },
    text: 'Pichiu',
    ui: {
      logo: nodesKylinPNG
    }
  },
  {
    info: 'westendStandard',
    paraId: 2094,
    providers: {
      // 'Standard Protocol': 'wss://rpc.westend.standard.tech' // https://github.com/polkadot-js/apps/issues/8525
    },
    text: 'Standard',
    ui: {
      logo: chainsStandardPNG
    }
  },
  {
    info: 'karura',
    paraId: 2005,
    providers: {
      // 'Acala Foundation': 'wss://karura-westend-rpc.aca-staging.network' // https://github.com/polkadot-js/apps/issues/5830
    },
    text: 'Wendala',
    ui: {
      logo: chainsKaruraSVG
    }
  },
  {
    info: 'whala',
    paraId: 2013,
    providers: {
      // Phala: 'wss://whala.phala.network/ws' // https://github.com/polkadot-js/apps/issues/6181
    },
    text: 'Whala',
    ui: {
      color: '#03f3f3',
      logo: nodesKhalaSVG
    }
  },
  {
    homepage: 'https://www.kilt.io/',
    info: 'kilt',
    paraId: 2085,
    providers: {
      // 'KILT Protocol': 'wss://westend.kilt.io:9977' // https://github.com/polkadot-js/apps/issues/9059
    },
    text: 'WILT',
    ui: {
      color: '#8c145a',
      logo: nodesKiltPNG
    }
  }
];

export const testParasWestendCommon: EndpointOption[] = [
  {
    info: 'WestendAssetHub',
    paraId: 1000,
    providers: {
      Dwellir: 'wss://westmint-rpc.dwellir.com',
      'Dwellir Tunisia': 'wss://westmint-rpc-tn.dwellir.com',
      'IBP-GeoDNS1': 'wss://sys.ibp.network/westmint',
      'IBP-GeoDNS2': 'wss://sys.dotters.network/westmint',
      OnFinality: 'wss://westmint.api.onfinality.io/public-ws',
      Parity: 'wss://westend-asset-hub-rpc.polkadot.io',
      Stakeworld: 'wss://wnd-rpc.stakeworld.io/assethub'
    },
    teleport: [-1],
    text: 'AssetHub',
    ui: {
      color: '#77bb77',
      logo: nodesAssetHubSVG
    }
  },
  {
    info: 'westendBridgeHub',
    paraId: 1002,
    providers: {
      'IBP-GeoDNS1': 'wss://sys.ibp.network/bridgehub-westend',
      'IBP-GeoDNS2': 'wss://sys.dotters.network/bridgehub-westend',
      OnFinality: 'wss://bridgehub-westend.api.onfinality.io/public-ws',
      Parity: 'wss://westend-bridge-hub-rpc.polkadot.io'
    },
    text: 'BridgeHub',
    ui: {
      logo: nodesBridgeHubSVG
    }
  },
  {
    info: 'westendCollectives',
    paraId: 1001,
    providers: {
      'IBP-GeoDNS1': 'wss://sys.ibp.network/collectives-westend',
      'IBP-GeoDNS2': 'wss://sys.dotters.network/collectives-westend',
      Parity: 'wss://westend-collectives-rpc.polkadot.io'
    },
    teleport: [-1],
    text: 'Collectives',
    ui: {
      color: '#e6777a',
      logo: 'fa;people-group'
    }
  }
];

export const testRelayWestend: EndpointOption = {
  dnslink: 'westend',
  genesisHash: WESTEND_GENESIS,
  info: 'westend',
  linked: [
    ...testParasWestendCommon,
    ...testParasWestend
  ],
  providers: {
    // Blockops: 'wss://westend-rpc.blockops.network/ws', // https://github.com/polkadot-js/apps/issues/9840
    Dwellir: 'wss://westend-rpc.dwellir.com',
    'Dwellir Tunisia': 'wss://westend-rpc-tn.dwellir.com',
    'IBP-GeoDNS1': 'wss://rpc.ibp.network/westend',
    'IBP-GeoDNS2': 'wss://rpc.dotters.network/westend',
    LuckyFriday: 'wss://rpc-westend.luckyfriday.io',
    OnFinality: 'wss://westend.api.onfinality.io/public-ws',
    Parity: 'wss://westend-rpc.polkadot.io',
    RadiumBlock: 'wss://westend.public.curie.radiumblock.co/ws',
    Stakeworld: 'wss://wnd-rpc.stakeworld.io',
    'light client': 'light://substrate-connect/westend'
  },
  teleport: getTeleports(testParasWestendCommon),
  text: 'Westend',
  ui: {
    color: '#da68a7',
    identityIcon: 'polkadot',
    logo: nodesWestendColourSVG
  }
};
