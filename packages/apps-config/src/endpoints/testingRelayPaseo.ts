// Copyright 2017-2024 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { EndpointOption } from './types.js';

import { chainsAmplitudeSVG, chainsCoretimeKusamaSVG, chainsFrequencyPaseoSVG, chainsHydrationPaseoSVG, chainsLaosSigmaPNG, chainsMyxcavPNG, chainsPaseoPNG, chainsPeoplePolkadotSVG, chainsPopNetworkSVG } from '@polkadot/apps-config/ui/logos/chains';
import { nodesAjunaPNG, nodesAssetHubSVG, nodesAventusSVG, nodesBajunPNG, nodesBifrostSVG, nodesBridgeHubSVG, nodesDarwiniaKoiSVG, nodesHyperbridgePNG, nodesIdealNetworkSVG, nodesIntegriteeSVG, nodesKiltPNG, nodesLitentryPaseoSVG, nodesMandalaPNG, nodesMusePNG, nodesMyriadPaseoSVG, nodesNodleSVG, nodesRegionxPNG, nodesRexSVG, nodesZeitgeistPNG } from '@polkadot/apps-config/ui/logos/nodes';

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
    info: 'paseoAmplitude',
    paraId: 2124,
    providers: {
      PendulumChain: 'wss://rpc-foucoco.pendulumchain.tech'
    },
    text: 'Amplitude testnet (Foucoco)',
    ui: {
      color: '#5DEFA7',
      logo: chainsAmplitudeSVG
    }
  },
  {
    homepage: 'https://www.aventus.io/',
    info: 'paseoAventus',
    paraId: 2056,
    providers: {
      Aventus: 'wss://public-rpc.testnet.aventus.network'
    },
    text: 'Aventus',
    ui: {
      color: '#E6E6FA',
      logo: nodesAventusSVG
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
    homepage: 'https://hydration.net',
    info: 'rococoHydraDX',
    paraId: 2034,
    providers: {
      // 'Galactic Council': 'wss://paseo-rpc.play.hydration.cloud' https://github.com/polkadot-js/apps/issues/10997
    },
    text: 'Hydration (Paseo)',
    ui: {
      color: '#b3d7fa',
      logo: chainsHydrationPaseoSVG
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
      logo: nodesHyperbridgePNG
    }
  },
  {
    homepage: 'https://idealabs.network/',
    info: 'Ideal Network',
    paraId: 4502,
    providers: {
      // 'IDN Node': 'wss://idn0-testnet.idealabs.network' https://github.com/polkadot-js/apps/issues/10966
    },
    text: 'Ideal Network',
    ui: {
      color: 'rgb(17, 35, 77)',
      logo: nodesIdealNetworkSVG
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
    info: 'laos-sigma',
    paraId: 4006,
    providers: {
      'freeverse.io': 'wss://rpc.laossigma.laosfoundation.io'
    },
    text: 'Laos Sigma',
    ui: {
      color: '#363435',
      logo: chainsLaosSigmaPNG
    }
  },
  {
    homepage: 'https://www.litentry.com/',
    info: 'paseoLitentry',
    paraId: 2106,
    providers: {
      Litentry: 'wss://rpc.paseo-parachain.litentry.io'
    },
    text: 'Litentry',
    ui: {
      color: '#ECDA38',
      logo: nodesLitentryPaseoSVG
    }
  },
  {
    info: 'muse',
    paraId: 3369,
    providers: {
      Parity: 'wss://paseo-muse-rpc.polkadot.io'
    },
    text: 'Muse network',
    ui: {
      color: '#110ff9',
      logo: nodesMusePNG
    }
  },
  {
    homepage: 'https://myriad.social',
    info: 'Myriad Social',
    paraId: 4005,
    providers: {
      myriadPaseo: 'wss://ws-rpc.paseo.myriad.social'
    },
    text: 'Myriad Social Testnet',
    ui: {
      color: '#d5e3e4',
      logo: nodesMyriadPaseoSVG
    }
  },
  {
    homepage: 'https://mandalachain.io',
    info: 'Niskala',
    paraId: 4022,
    providers: {
      'Baliola 1': 'wss://mlg1.mandalachain.io',
      'Baliola 2': 'wss://mlg2.mandalachain.io'
    },
    text: 'Niskala',
    ui: {
      color: '#0036ac',
      logo: nodesMandalaPNG
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
    info: 'paseoEwx',
    paraId: 3345,
    providers: {
      'Energy Web': 'wss://public-rpc.testnet.energywebx.com/'
    },
    text: 'PEX',
    ui: {
      color: '#452E66',
      logo: nodesRexSVG
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
      color: 'linear-gradient(to right, rgb(230, 0, 122), rgb(83, 15, 160))',
      logo: chainsPopNetworkSVG
    }
  },
  {
    info: 'regionxCocos',
    paraId: 4509,
    providers: {
      RegionX: 'wss://regionx-paseo.regionx.tech'
    },
    text: 'RegionX(Paseo)',
    ui: {
      color: '#0CC184',
      logo: nodesRegionxPNG
    }
  },
  {
    homepage: 'https://xcavate.io/',
    info: 'Xcavate',
    paraId: 4003,
    providers: {
      Xcavate: 'wss://rpc-paseo.xcavate.io:443'
    },
    text: 'Xcavate',
    ui: {
      color: '#FF0083',
      logo: chainsMyxcavPNG
    }
  },
  {
    homepage: 'zeitgeist.pm',
    info: 'ZeitgeistBatteryStation',
    paraId: 2101,
    providers: {
      Zeitgeist: 'wss://bsr.zeitgeist.pm'
    },
    text: 'Zeitgeist Battery Station',
    ui: {
      color: 'linear-gradient(180deg, rgba(32,90,172,1) 0%, rgba(26,72,138,1) 50%, rgba(13,36,69,1) 100%)',
      logo: nodesZeitgeistPNG
    }
  }
];

export const testParasPaseoCommon: EndpointOption[] = [
  {
    info: 'PaseoAssetHub',
    isPeopleForIdentity: true,
    paraId: 1000,
    providers: {
      Dwellir: 'wss://asset-hub-paseo-rpc.dwellir.com',
      IBP1: 'wss://sys.ibp.network/asset-hub-paseo',
      IBP2: 'wss://asset-hub-paseo.dotters.network',
      StakeWorld: 'wss://pas-rpc.stakeworld.io/assethub',
      TurboFlakes: 'wss://sys.turboflakes.io/asset-hub-paseo'
    },
    relayName: 'paseo',
    teleport: [-1],
    text: 'AssetHub',
    ui: {
      color: '#77bb77',
      logo: nodesAssetHubSVG
    }
  },
  {
    info: 'BridgeHub',
    isPeopleForIdentity: true,
    paraId: 1002,
    providers: {
      // IBP1: 'wss://sys.ibp.network/bridge-hub-paseo', https://github.com/polkadot-js/apps/issues/10966
      IBP2: 'wss://bridge-hub-paseo.dotters.network'
    },
    relayName: 'paseo',
    teleport: [-1],
    text: 'BridgeHub',
    ui: {
      color: '#AAADD7',
      logo: nodesBridgeHubSVG
    }
  },
  {
    info: 'Coretime',
    isPeopleForIdentity: true,
    paraId: 1005,
    providers: {
      IBP2: 'wss://coretime-paseo.dotters.network',
      ParaNodes: 'wss://paseo-coretime.paranodes.io'
    },
    relayName: 'paseo',
    teleport: [-1],
    text: 'Coretime',
    ui: {
      color: '#113911',
      logo: chainsCoretimeKusamaSVG
    }
  },
  {
    info: 'PaseoPeopleChain',
    isPeople: true,
    isPeopleForIdentity: false,
    paraId: 1004,
    providers: {
      Amforc: 'wss://people-paseo.rpc.amforc.com',
      IBP2: 'wss://people-paseo.dotters.network'
    },
    relayName: 'paseo',
    teleport: [-1],
    text: 'People',
    ui: {
      color: '#e84366',
      logo: chainsPeoplePolkadotSVG
    }
  }
];

export const testRelayPaseo: EndpointOption = {
  dnslink: 'paseo',
  genesisHash: PASEO_GENESIS,
  info: 'paseo',
  isPeopleForIdentity: true,
  isRelay: true,
  linked: [
    ...testParasPaseoCommon,
    ...testParasPaseo
  ],
  providers: {
    Amforc: 'wss://paseo.rpc.amforc.com',
    Dwellir: 'wss://paseo-rpc.dwellir.com',
    IBP1: 'wss://rpc.ibp.network/paseo',
    IBP2: 'wss://paseo.dotters.network',
    StakeWorld: 'wss://pas-rpc.stakeworld.io'
    // Zondax: 'wss://api2.zondax.ch/pas/node/rpc' https://github.com/polkadot-js/apps/issues/10957
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
