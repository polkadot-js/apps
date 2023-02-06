// Copyright 2017-2023 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { EndpointOption } from './types';

import { WESTEND_GENESIS } from '../api/constants';
import { chainsInterlaySVG, chainsKaruraSVG, chainsStandardPNG } from '../ui/logos/chains';
import { nodesBridgeHubBlackSVG, nodesCentrifugePNG, nodesIntegriteeSVG, nodesKiltPNG, nodesKylinPNG, nodesMoonshadowPNG, nodesPangoroSVG, nodesStatemineSVG, nodesWestendColourSVG, nodesWhalaSVG } from '../ui/logos/nodes';
import { getTeleports } from './util';

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
      logo: chainsInterlaySVG
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
    homepage: 'https://darwinia.network/',
    info: 'pangoro',
    paraId: 2102,
    providers: {
      // Darwinia: 'wss://pangoro-parachain-rpc.darwinia.network' // https://github.com/polkadot-js/apps/issues/6530
    },
    text: 'Pangoro',
    ui: {
      color: '#4B30DD',
      logo: nodesPangoroSVG
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
      logo: nodesWhalaSVG
    }
  },
  {
    homepage: 'https://www.kilt.io/',
    info: 'kilt',
    paraId: 2085,
    providers: {
      'KILT Protocol': 'wss://westend.kilt.io:9977'
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
    info: 'westmint',
    paraId: 1000,
    providers: {
      Dwellir: 'wss://westmint-rpc.dwellir.com',
      'Dwellir Tunisia': 'wss://westmint-rpc-tn.dwellir.com',
      Parity: 'wss://westmint-rpc.polkadot.io'
    },
    teleport: [-1],
    text: 'Westmint',
    ui: {
      color: '#77bb77',
      logo: nodesStatemineSVG
    }
  },
  {
    info: 'westendCollectives',
    paraId: 1001,
    providers: {
      Parity: 'wss://westend-collectives-rpc.polkadot.io'
    },
    teleport: [-1],
    text: 'Collectives',
    ui: {
      color: '#e6777a',
      logo: 'fa;people-group'
    }
  },
  {
    info: 'westendBridgeHub',
    paraId: 1002,
    providers: {
      Parity: 'wss://westend-bridge-hub-rpc.polkadot.io'
    },
    text: 'BridgeHub',
    ui: {
      logo: nodesBridgeHubBlackSVG
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
    'Dotters Net': 'wss://rpc.dotters.network/westend',
    Dwellir: 'wss://westend-rpc.dwellir.com',
    'Dwellir Tunisia': 'wss://westend-rpc-tn.dwellir.com',
    'IBP Network': 'wss://rpc.ibp.network/westend',
    OnFinality: 'wss://westend.api.onfinality.io/public-ws',
    Parity: 'wss://westend-rpc.polkadot.io',
    Pinknode: 'wss://rpc.pinknode.io/westend/explorer',
    'light client': 'light://substrate-connect/westend'
  },
  teleport: getTeleports(testParasWestendCommon),
  text: 'Westend',
  ui: {
    color: '#da68a7',
    logo: nodesWestendColourSVG
  }
};
