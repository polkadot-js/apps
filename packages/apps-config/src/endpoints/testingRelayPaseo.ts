// Copyright 2017-2024 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { EndpointOption } from './types.js';

import { chainsFrequencyPaseoSVG, chainsLaosOmegaPNG, chainsPaseoPNG, chainsPopNetworkSVG } from '@polkadot/apps-config/ui/logos/chains';
import { nodesAjunaPNG, nodesAssetHubSVG, nodesBajunPNG, nodesBifrostSVG, nodesDarwiniaKoiSVG, nodesHyperbridgeSVG, nodesIntegriteeSVG, nodesKiltPNG, nodesNodleSVG } from '@polkadot/apps-config/ui/logos/nodes';

import { PASEO_GENESIS } from '../api/constants.js';
// import { testnetParachainSVG } from '../ui/logos/nodes/index.js';
import { getTeleports } from './util.js';

// The available endpoints that will show in the dropdown. For the most part (with the exception of
// Polkadot) we try to keep this to live chains only, with RPCs hosted by the community/chain vendor
//   info: The chain logo name as defined in ../ui/logos/index.ts in namedLogos (this also needs to align with @polkadot/networks)
//   text: The text to display on the dropdown
//   providers: The actual hosted secure websocket endpoint
//
// IMPORTANT: Alphabetical based on text
export const testParasPaseo: Omit<EndpointOption, 'teleport'>[] = [
  // {
  //   homepage: 'https://testPaseoParachainExample.com',
  //   info: 'paseoparachain',
  //   paraId: 2345,
  //   providers: {
  //     Acurast: 'wss://paseo-parachain-testnet-ws.prod.gke.papers.tech'
  //   },
  //   text: 'Testnet Parachain',
  //   ui: {
  //     color: '#000000',
  //     logo: testnetParachainSVG
  //   }
  // }
  {
    homepage: 'https://ajuna.io/',
    info: 'Ajuna(paseo)',
    paraId: 2051,
    providers: {
      BajunNetwork: 'wss://rpc-paseo.ajuna.network'
    },
    text: 'Ajuna Network (Paseo)',
    ui: {
      color: '#161212',
      logo: nodesAjunaPNG
    }
  },
  {
    homepage: 'https://ajuna.io/',
    info: 'Bajun(paseo)',
    paraId: 2119,
    providers: {
      BajunNetwork: 'wss://rpc-paseo.bajun.network'
    },
    text: 'Bajun Network (Paseo)',
    ui: {
      color: '#161212',
      logo: nodesBajunPNG
    }
  },
  {
    homepage: 'https://bifrost.finance',
    info: 'Bifrost(Paseo)',
    paraId: 2030,
    providers: {
      Liebi: 'wss://bifrost-rpc.paseo.liebi.com/ws'
    },
    text: 'Bifrost',
    ui: {
      color: '#5a25f0',
      logo: nodesBifrostSVG
    }
  },
  {
    homepage: 'https://darwinia.network/',
    info: 'Darwinia Koi',
    paraId: 2105,
    providers: {
      Darwinia: 'wss://koi-rpc.darwinia.network'
    },
    text: 'Darwinia Koi',
    ui: {
      color: '#FF0083',
      logo: nodesDarwiniaKoiSVG
    }
  },
  {
    homepage: 'https://www.frequency.xyz',
    info: 'Frequency',
    paraId: 4000,
    providers: {
      'Amplica Labs': 'wss://0.rpc.testnet.amplica.io'
    },
    text: 'Frequency',
    ui: {
      color: '#19455E',
      logo: chainsFrequencyPaseoSVG
    }
  },
  {
    homepage: 'https://hyperbridge.network',
    info: 'Hyperbridge',
    paraId: 4009,
    providers: {
      BlockOps: 'wss://hyperbridge-paseo-rpc.blockops.network'
    },
    text: 'Hyperbridge (Gargantua)',
    ui: {
      color: '#ED6FF1',
      logo: nodesHyperbridgeSVG
    }
  },
  {
    homepage: 'https://integritee.network',
    info: 'integritee',
    paraId: 2039,
    providers: {
      Integritee: 'wss://paseo.api.integritee.network'
    },
    text: 'Integritee Network (Paseo)',
    ui: {
      color: '#658ea9',
      logo: nodesIntegriteeSVG
    }
  },
  {
    info: 'kilt',
    paraId: 2086,
    providers: {
      BOTLabs: 'wss://peregrine.kilt.io/parachain-public-ws/'
    },
    text: 'KILT Peregrine',
    ui: {
      color: 'linear-gradient(45deg, #f05a27 0%, #8c145a 100%)',
      logo: nodesKiltPNG
    }
  },
  {
    homepage: 'https://laosnetwork.io/',
    info: 'laos-omega',
    paraId: 4006,
    providers: {
      'freeverse.io': 'wss://rpc.laosomega.laosfoundation.io'
    },
    text: 'Laos Omega',
    ui: {
      color: '#f7f4e7',
      logo: chainsLaosOmegaPNG
    }
  },
  {
    homepage: 'https://www.nodle.com/',
    info: 'NodleParadis',
    paraId: 2026,
    providers: {
      OnFinality: 'wss://node-6957502816543653888.lh.onfinality.io/ws?apikey=09b04494-3139-4b57-a5d1-e1c4c18748ce'
    },
    text: 'Nodle',
    ui: {
      color: '#1ab394',
      logo: nodesNodleSVG
    }
  },
  {
    homepage: 'https://popnetwork.xyz/',
    info: 'Pop Network',
    paraId: 4001,
    providers: {
      'R0GUE-RPC1': 'wss://rpc1.paseo.popnetwork.xyz',
      'R0GUE-RPC2': 'wss://rpc2.paseo.popnetwork.xyz',
      'R0GUE-RPC3': 'wss://rpc3.paseo.popnetwork.xyz'
    },
    text: 'Pop Network',
    ui: {
      color: '#1C0533',
      logo: chainsPopNetworkSVG
    }
  }
];

export const testParasPaseoCommon: EndpointOption[] = [
  {
    info: 'PaseoAssetHub',
    paraId: 1000,
    providers: {
      Dwellir: 'wss://asset-hub-paseo-rpc.dwellir.com',
      IBP1: 'wss://sys.ibp.network/asset-hub-paseo',
      IBP2: 'wss://sys.dotters.network/asset-hub-paseo',
      StakeWorld: 'wss://pas-rpc.stakeworld.io/assethub'
    },
    teleport: [-1],
    text: 'AssetHub',
    ui: {
      color: '#77bb77',
      logo: nodesAssetHubSVG
    }
  }
];

export const testRelayPaseo: EndpointOption = {
  dnslink: 'paseo',
  genesisHash: PASEO_GENESIS,
  info: 'paseo',
  isPeopleForIdentity: false,
  isRelay: true,
  linked: [
    ...testParasPaseoCommon,
    ...testParasPaseo
  ],
  providers: {
    Amforc: 'wss://paseo.rpc.amforc.com',
    Dwellir: 'wss://paseo-rpc.dwellir.com',
    IBP1: 'wss://rpc.ibp.network/paseo',
    IBP2: 'wss://rpc.dotters.network/paseo',
    StakeWorld: 'wss://pas-rpc.stakeworld.io',
    Zondax: 'wss://api.zondax.ch/pas/node/rpc'
    // 'light client': 'light://substrate-connect/paseo'
  },
  teleport: getTeleports(testParasPaseoCommon),
  text: 'Paseo',
  ui: {
    color: '#38393F',
    identityIcon: 'polkadot',
    logo: chainsPaseoPNG
  }
};
