// Copyright 2017-2025 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { EndpointOption } from './types.js';

import { WESTEND_GENESIS } from '../api/constants.js';
import { chainsKaruraSVG, chainsPeoplePolkadotSVG, chainsStandardPNG } from '../ui/logos/chains/index.js';
import { nodesAssetHubSVG, nodesBridgeHubSVG, nodesCentrifugePNG, nodesIntegriteeSVG, nodesInterlaySVG, nodesKhalaSVG, nodesKylinPNG, nodesMoonshadowPNG, nodesWestendColourSVG } from '../ui/logos/nodes/index.js';
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
    info: 'westendPenpal',
    isPeopleForIdentity: true,
    paraId: 2042,
    providers: {
      Parity: 'wss://westend-penpal-rpc.polkadot.io'
    },
    relayName: 'westend',
    text: 'Penpal',
    ui: {
      color: '#964b00'
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
  }
];

export const testParasWestendCommon: EndpointOption[] = [
  {
    info: 'WestendAssetHub',
    isPeopleForIdentity: true,
    paraId: 1000,
    providers: {
      Dwellir: 'wss://asset-hub-westend-rpc.n.dwellir.com',
      'Dwellir Tunisia': 'wss://westmint-rpc-tn.dwellir.com',
      // OnFinality: 'wss://westmint.api.onfinality.io/public-ws', // https://github.com/polkadot-js/apps/issues/9955
      Parity: 'wss://westend-asset-hub-rpc.polkadot.io',
      'Permanence DAO EU': 'wss://asset-hub-westend.rpc.permanence.io'
      // Stakeworld: 'wss://wnd-rpc.stakeworld.io/assethub'
    },
    relayName: 'westend',
    teleport: [-1, 1002, 1001, 1005, 1004],
    text: 'AssetHub',
    ui: {
      color: '#77bb77',
      logo: nodesAssetHubSVG
    }
  },
  {
    info: 'westendBridgeHub',
    isPeopleForIdentity: true,
    paraId: 1002,
    providers: {
      Dwellir: 'wss://bridge-hub-westend-rpc.n.dwellir.com',
      'Dwellir Tunisia': 'wss://westend-bridge-hub-rpc-tn.dwellir.com',
      // OnFinality: 'wss://bridgehub-westend.api.onfinality.io/public-ws', // https://github.com/polkadot-js/apps/issues/9960
      Parity: 'wss://westend-bridge-hub-rpc.polkadot.io'
    },
    relayName: 'westend',
    teleport: [-1, 1000],
    text: 'BridgeHub',
    ui: {
      logo: nodesBridgeHubSVG
    }
  },
  {
    info: 'westendCollectives',
    isPeopleForIdentity: true,
    paraId: 1001,
    providers: {
      Dwellir: 'wss://collectives-westend-rpc.n.dwellir.com',
      'Dwellir Tunisia': 'wss://westend-collectives-rpc-tn.dwellir.com',
      Parity: 'wss://westend-collectives-rpc.polkadot.io'
    },
    relayName: 'westend',
    teleport: [-1, 1000],
    text: 'Collectives',
    ui: {
      color: '#e6777a',
      logo: 'fa;people-group'
    }
  },
  {
    info: 'westendCoretime',
    isPeopleForIdentity: true,
    paraId: 1005,
    providers: {
      Dwellir: 'wss://coretime-westend-rpc.n.dwellir.com',
      Parity: 'wss://westend-coretime-rpc.polkadot.io'
    },
    relayName: 'westend',
    teleport: [-1, 1000],
    text: 'Coretime',
    ui: {
      color: '#f19135'
    }
  },
  {
    info: 'westendPeople',
    isPeople: true,
    isPeopleForIdentity: false,
    paraId: 1004,
    providers: {
      Dwellir: 'wss://people-westend-rpc.n.dwellir.com',
      Parity: 'wss://westend-people-rpc.polkadot.io'
    },
    relayName: 'westend',
    teleport: [-1, 1000],
    text: 'People',
    ui: {
      color: '#ec03fc',
      logo: chainsPeoplePolkadotSVG
    }
  }
];

export const testRelayWestend: EndpointOption = {
  dnslink: 'westend',
  genesisHash: WESTEND_GENESIS,
  info: 'westend',
  isPeopleForIdentity: true,
  isRelay: true,
  linked: [
    ...testParasWestendCommon,
    ...testParasWestend
  ],
  providers: {
    Dwellir: 'wss://westend-rpc.n.dwellir.com',
    'Dwellir Tunisia': 'wss://westend-rpc-tn.dwellir.com',
    // LuckyFriday: 'wss://rpc-westend.luckyfriday.io', // https://github.com/polkadot-js/apps/issues/10728
    OnFinality: 'wss://westend.api.onfinality.io/public-ws',
    Parity: 'wss://westend-rpc.polkadot.io',
    RadiumBlock: 'wss://westend.public.curie.radiumblock.co/ws',
    // Stakeworld: 'wss://wnd-rpc.stakeworld.io',
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
