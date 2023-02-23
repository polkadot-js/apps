// Copyright 2017-2023 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { EndpointOption } from './types';

import { POLKADOT_GENESIS } from '../api/constants';
import { chainsAcalaSVG, chainsBitgreenPNG, chainsComposableFinancePNG, chainsEquilibriumSVG, chainsFrequencySVG, chainsGeminisPNG, chainsOakPNG, chainsOrigintrailPNG, chainsPendulumSVG, chainsPolkadotCircleSVG, chainsSnakenetSVG, chainsTotemSVG, chainsWatrPNG } from '../ui/logos/chains';
import { nodesAjunaPNG, nodesAresOdysseySVG, nodesAstarPNG, nodesAventusSVG, nodesBifrostSVG, nodesBridgeHubSVG, nodesCentrifugePNG, nodesCloverSVG, nodesCoinversationPNG, nodesCrustParachainSVG, nodesDarwiniaSVG, nodesEfinitySVG, nodesHashedPNG, nodesIntegriteeSVG, nodesInterlaySVG, nodesKiltPNG, nodesKylinPNG, nodesLitentryPNG, nodesMantaPNG, nodesMoonbeamSVG, nodesNodleSVG, nodesOmnibtcSVG, nodesParallelSVG, nodesPhalaSVG, nodesPolkadexSVG, nodesStatemineSVG, nodesSubdaoPNG, nodesSubgameSVG, nodesUniqueSVG } from '../ui/logos/nodes';
import { getTeleports } from './util';

// The available endpoints that will show in the dropdown. For the most part (with the exception of
// Polkadot) we try to keep this to live chains only, with RPCs hosted by the community/chain vendor
//   info: The chain logo name as defined in ../ui/logos/index.ts in namedLogos (this also needs to align with @polkadot/networks)
//   text: The text to display on the dropdown
//   providers: The actual hosted secure websocket endpoint
//
// IMPORTANT: Alphabetical based on text
export const prodParasPolkadot: EndpointOption[] = [
  {
    homepage: 'https://acala.network/',
    info: 'acala',
    paraId: 2000,
    providers: {
      'Acala Foundation 0': 'wss://acala-rpc-0.aca-api.network',
      'Acala Foundation 1': 'wss://acala-rpc-1.aca-api.network',
      // 'Acala Foundation 2': 'wss://acala-rpc-2.aca-api.network/ws', // https://github.com/polkadot-js/apps/issues/6965
      'Acala Foundation 3': 'wss://acala-rpc-3.aca-api.network/ws',
      Dwellir: 'wss://acala-rpc.dwellir.com',
      // 'Automata 1RPC': 'wss://1rpc.io/aca' // https://github.com/polkadot-js/apps/issues/8648
      OnFinality: 'wss://acala-polkadot.api.onfinality.io/public-ws',
      'Polkawallet 0': 'wss://acala.polkawallet.io'
    },
    text: 'Acala',
    ui: {
      color: '#645AFF',
      logo: chainsAcalaSVG
    }
  },
  {
    homepage: 'https://ajuna.io',
    info: 'ajuna',
    paraId: 2051,
    providers: {
      AjunaNetwork: 'wss://rpc-parachain.ajuna.network',
      RadiumBlock: 'wss://ajuna.public.curie.radiumblock.co/ws'
    },
    text: 'Ajuna Network',
    ui: {
      color: '#161212',
      logo: nodesAjunaPNG
    }
  },
  {
    homepage: 'https://www.aresprotocol.io/',
    info: 'odyssey',
    paraId: 2028,
    providers: {
      AresProtocol: 'wss://wss.odyssey.aresprotocol.io'
    },
    text: 'Ares Odyssey',
    ui: {
      color: '#1295F0',
      logo: nodesAresOdysseySVG
    }
  },
  {
    homepage: 'https://astar.network',
    info: 'astar',
    paraId: 2006,
    providers: {
      Astar: 'wss://rpc.astar.network',
      'Automata 1RPC': 'wss://1rpc.io/astr',
      Blast: 'wss://astar.public.blastapi.io',
      Dwellir: 'wss://astar-rpc.dwellir.com',
      OnFinality: 'wss://astar.api.onfinality.io/public-ws',
      RadiumBlock: 'wss://astar.public.curie.radiumblock.co/ws',
      'light client': 'light://substrate-connect/polkadot/astar'
    },
    text: 'Astar',
    ui: {
      color: '#1b6dc1d9',
      logo: nodesAstarPNG
    }
  },
  {
    homepage: 'https://www.aventus.io/',
    info: 'aventus',
    paraId: 2056,
    providers: {},
    text: 'Aventus',
    ui: {
      logo: nodesAventusSVG
    }
  },
  {
    homepage: 'https://crowdloan.bifrost.app',
    info: 'bifrost',
    paraId: 2030,
    providers: {
      Liebi: 'wss://hk.p.bifrost-rpc.liebi.com/ws'
      // This is a possible false positive since OnFinality does not allow connections
      // from non polkadot.js.org urls - however until resolved, this needs to be disabled
      // since we cannot manually check the urls twice daily when they are reported
      // OnFinality: 'wss://bifrost-polkadot.api.onfinality.io/public-ws' // https://github.com/polkadot-js/apps/issues/8973
    },
    text: 'Bifrost',
    ui: {
      color: '#5a25f0',
      logo: nodesBifrostSVG
    }
  },
  {
    homepage: 'https://www.bitgreen.org',
    info: 'bitgreen',
    paraId: 2048,
    providers: {
      Bitgreen: 'wss://mainnet.bitgreen.org'
    },
    text: 'Bitgreen',
    ui: {
      color: '#224851',
      logo: chainsBitgreenPNG
    }
  },
  {
    homepage: 'https://centrifuge.io',
    info: 'centrifuge',
    paraId: 2031,
    providers: {
      Centrifuge: 'wss://fullnode.parachain.centrifuge.io',
      OnFinality: 'wss://centrifuge-parachain.api.onfinality.io/public-ws'
    },
    text: 'Centrifuge',
    ui: {
      color: '#fcc367',
      logo: nodesCentrifugePNG
    }
  },
  {
    homepage: 'https://clover.finance',
    info: 'clover',
    paraId: 2002,
    providers: {
      Clover: 'wss://rpc-para.clover.finance'
      // This is a possible false positive since OnFinality does not allow connections
      // from non polkadot.js.org urls - however until resolved, this needs to be disabled
      // since we cannot manually check the urls twice daily when they are reported
      // OnFinality: 'wss://clover.api.onfinality.io/public-ws' // https://github.com/polkadot-js/apps/issues/8973
    },
    text: 'Clover',
    ui: {
      color: 'linear-gradient(to right, #52ad75, #7cc773)',
      logo: nodesCloverSVG
    }
  },
  {
    homepage: 'http://www.coinversation.io/',
    info: 'coinversation',
    paraId: 2027,
    providers: {
      // Coinversation: 'wss://rpc.coinversation.io/' // https://github.com/polkadot-js/apps/issues/6635
    },
    text: 'Coinversation',
    ui: {
      color: '#e6017a',
      logo: nodesCoinversationPNG
    }
  },
  {
    homepage: 'https://composable.finance/',
    info: 'composableFinance',
    paraId: 2019,
    providers: {
      Composable: 'wss://rpc.composable.finance'
      // This is a possible false positive since OnFinality does not allow connections
      // from non polkadot.js.org urls - however until resolved, this needs to be disabled
      // since we cannot manually check the urls twice daily when they are reported
      // OnFinality: 'wss://composable.api.onfinality.io/public-ws' // https://github.com/polkadot-js/apps/issues/8973
    },
    text: 'Composable Finance',
    ui: {
      color: '#C90E8A',
      logo: chainsComposableFinancePNG
    }
  },
  {
    homepage: 'https://crust.network',
    info: 'crustParachain',
    paraId: 2008,
    providers: {
      Crust: 'wss://crust-parachain.crustapps.net'
    },
    text: 'Crust',
    ui: {
      logo: nodesCrustParachainSVG
    }
  },
  {
    homepage: 'https://darwinia.network/',
    info: 'darwinia',
    paraId: 2046,
    providers: {
      'Darwinia Network': 'wss://parachain-rpc.darwinia.network'
    },
    text: 'Darwinia',
    ui: {
      color: '#FF0083',
      logo: nodesDarwiniaSVG
    }
  },
  {
    homepage: 'https://darwinia.network/',
    info: 'darwinia',
    paraId: 2003,
    providers: {
      // 'Darwinia Network': 'wss://parachain-rpc.darwinia.network' // https://github.com/polkadot-js/apps/issues/6530
    },
    text: 'Darwinia Backup',
    ui: {
      color: '#FF0083',
      logo: nodesDarwiniaSVG
    }
  },
  {
    homepage: 'https://efinity.io',
    info: 'efinity',
    paraId: 2021,
    providers: {
      Dwellir: 'wss://efinity-rpc.dwellir.com',
      Efinity: 'wss://rpc.efinity.io'
      // This is a possible false positive since OnFinality does not allow connections
      // from non polkadot.js.org urls - however until resolved, this needs to be disabled
      // since we cannot manually check the urls twice daily when they are reported
      // OnFinality: 'wss://efinity.api.onfinality.io/public-ws' // https://github.com/polkadot-js/apps/issues/8973
    },
    text: 'Efinity',
    ui: {
      color: '#496ddb',
      logo: nodesEfinitySVG
    }
  },
  {
    homepage: 'https://equilibrium.io/',
    info: 'equilibrium',
    paraId: 2011,
    providers: {
      Dwellir: 'wss://equilibrium-rpc.dwellir.com',
      Equilibrium: 'wss://node.pol.equilibrium.io/'
    },
    text: 'Equilibrium',
    ui: {
      color: '#1792ff',
      logo: chainsEquilibriumSVG
    }
  },
  {
    homepage: 'https://frequency.xyz',
    info: 'frequency',
    paraId: 2091,
    providers: {
      'Frequency 0': 'wss://0.rpc.frequency.xyz',
      'Frequency 1': 'wss://1.rpc.frequency.xyz'
    },
    text: 'Frequency',
    ui: {
      color: '#4b64ff',
      logo: chainsFrequencySVG
    }
  },
  {
    homepage: 'https://geminis.network/',
    info: 'geminis',
    isUnreachable: true,
    paraId: 2038,
    providers: {
      Geminis: 'wss://rpc.geminis.network'
    },
    text: 'Geminis',
    ui: {
      logo: chainsGeminisPNG
    }
  },
  {
    homepage: 'https://hashed.network/',
    info: 'hashed',
    paraId: 2093,
    providers: {
      'Hashed Systems': 'wss://c1.hashed.network'
    },
    text: 'Hashed Network',
    ui: {
      color: '#9199A9',
      logo: nodesHashedPNG
    }
  },
  {
    homepage: 'https://hydradx.io/',
    info: 'hydra',
    paraId: 2034,
    providers: {
      Dwellir: 'wss://hydradx-rpc.dwellir.com',
      'Galactic Council': 'wss://rpc.hydradx.cloud',
      ZeePrime: 'wss://rpc-lb.data6.zp-labs.net:8443/hydradx/ws/?token=2ZGuGivPJJAxXiT1hR1Yg2MXGjMrhEBYFjgbdPi'
      // This is a possible false positive since OnFinality does not allow connections
      // from non polkadot.js.org urls - however until resolved, this needs to be disabled
      // since we cannot manually check the urls twice daily when they are reported
      // OnFinality: 'wss://hydradx.api.onfinality.io/public-ws' // https://github.com/polkadot-js/apps/issues/8973
    },
    text: 'HydraDX',
    ui: {
      color: '#f653a2',
      logo: chainsSnakenetSVG
    }
  },
  {
    homepage: 'https://integritee.network',
    info: 'integritee',
    paraId: 2039,
    providers: {
      Integritee: 'wss://polkadot.api.integritee.network'
    },
    text: 'Integritee Shell',
    ui: {
      color: '#658ea9',
      logo: nodesIntegriteeSVG
    }
  },
  {
    homepage: 'https://interlay.io/',
    info: 'interlay',
    paraId: 2032,
    providers: {
      'Kintsugi Labs': 'wss://api.interlay.io/parachain',
      OnFinality: 'wss://interlay.api.onfinality.io/public-ws'
    },
    text: 'Interlay',
    ui: {
      color: '#3E96FF',
      logo: nodesInterlaySVG
    }
  },
  {
    homepage: 'https://totemaccounting.com/',
    info: 'kapex',
    paraId: 2007,
    providers: {
      Totem: 'wss://k-ui.kapex.network'
    },
    text: 'Kapex',
    ui: {
      color: 'linear-gradient(158deg, rgba(226,157,0,1) 0%, rgba(234,55,203,1) 100%)',
      logo: chainsTotemSVG
    }
  },
  {
    homepage: 'https://www.kilt.io/',
    info: 'kilt',
    paraId: 2086,
    providers: {
      Dwellir: 'wss://kilt-rpc.dwellir.com',
      'KILT Protocol': 'wss://spiritnet.kilt.io/',
      OnFinality: 'wss://spiritnet.api.onfinality.io/public-ws'
    },
    text: 'KILT Spiritnet',
    ui: {
      color: '#8c145a',
      logo: nodesKiltPNG
    }
  },
  {
    homepage: 'https://kylin.network/',
    info: 'kylin',
    paraId: 2052,
    providers: {
      'Kylin Network': 'wss://polkadot.kylin-node.co.uk'
    },
    text: 'Kylin',
    ui: {
      color: '#ed007e',
      logo: nodesKylinPNG
    }
  },
  {
    homepage: 'https://crowdloan.litentry.com',
    info: 'litentry',
    paraId: 2013,
    providers: {
      Dwellir: 'wss://litentry-rpc.dwellir.com',
      Litentry: 'wss://rpc.litentry-parachain.litentry.io'
    },
    text: 'Litentry',
    ui: {
      color: 'linear-gradient(45deg, #5cc27c 0%, #6de98f 100%)',
      logo: nodesLitentryPNG
    }
  },
  {
    homepage: 'https://manta.network',
    info: 'manta',
    isUnreachable: true, // https://github.com/polkadot-js/apps/issues/7018
    paraId: 2015,
    providers: {
      // 'Manta Kuhlii': 'wss://kuhlii.manta.systems', // https://github.com/polkadot-js/apps/issues/6930
      // 'Manta Munkiana': 'wss://munkiana.manta.systems', // https://github.com/polkadot-js/apps/issues/6871
      // 'Manta Pectinata': 'wss://pectinata.manta.systems' // https://github.com/polkadot-js/apps/issues/7018
    },
    text: 'Manta',
    ui: {
      color: '#2070a6',
      logo: nodesMantaPNG
    }
  },
  {
    homepage: 'https://moonbeam.network/networks/moonbeam/',
    info: 'moonbeam',
    paraId: 2004,
    providers: {
      'Automata 1RPC': 'wss://1rpc.io/glmr',
      Blast: 'wss://moonbeam.public.blastapi.io',
      'Moonbeam Foundation': 'wss://wss.api.moonbeam.network',
      OnFinality: 'wss://moonbeam.api.onfinality.io/public-ws',
      UnitedBloc: 'wss://moonbeam.unitedbloc.com:3001'
    },
    text: 'Moonbeam',
    ui: {
      color: '#53cbc9',
      logo: nodesMoonbeamSVG
    }
  },
  {
    homepage: 'https://nodle.com',
    info: 'nodle',
    paraId: 2026,
    providers: {
      Dwellir: 'wss://eden-rpc.dwellir.com',
      OnFinality: 'wss://nodle-parachain.api.onfinality.io/public-ws'
    },
    text: 'Nodle',
    ui: {
      color: '#1ab394',
      logo: nodesNodleSVG
    }
  },
  {
    homepage: 'https://oak.tech',
    info: 'oak',
    isUnreachable: true,
    paraId: 2090,
    providers: {
      OAK: 'wss://rpc.oak.tech'
    },
    text: 'OAK Network',
    ui: {
      color: '#A8278C',
      logo: chainsOakPNG
    }
  },
  {
    homepage: 'https://www.omnibtc.finance',
    info: 'omnibtc',
    isUnreachable: true,
    paraId: 2053,
    providers: {
      OmniBTC: 'wss://psc-parachain.coming.chat'
    },
    text: 'OmniBTC',
    ui: {
      color: '#6759E9',
      logo: nodesOmnibtcSVG
    }
  },
  {
    homepage: 'https://parachain.origintrail.io',
    info: 'origintrail-parachain',
    paraId: 2043,
    providers: {
      TraceLabs: 'wss://parachain-rpc.origin-trail.network'
    },
    text: 'OriginTrail',
    ui: {
      color: '#FB5DEB',
      logo: chainsOrigintrailPNG
    }
  },
  {
    homepage: 'https://parallel.fi',
    info: 'parallel',
    paraId: 2012,
    providers: {
      // This is a possible false positive since OnFinality does not allow connections
      // from non polkadot.js.org urls - however until resolved, this needs to be disabled
      // since we cannot manually check the urls twice daily when they are reported
      // OnFinality: 'wss://parallel.api.onfinality.io/public-ws', // https://github.com/polkadot-js/apps/issues/8973
      Parallel: 'wss://rpc.parallel.fi'
    },
    text: 'Parallel',
    ui: {
      color: '#ef18ac',
      logo: nodesParallelSVG
    }
  },
  {
    homepage: 'https://pendulumchain.org/',
    info: 'pendulum',
    paraId: 2094,
    providers: {
      PendulumChain: 'wss://rpc-pendulum.prd.pendulumchain.tech'
    },
    text: 'Pendulum',
    ui: {
      color: '#49E2FD',
      logo: chainsPendulumSVG
    }
  },
  {
    homepage: 'https://phala.network',
    info: 'phala',
    paraId: 2035,
    providers: {
      OnFinality: 'wss://phala.api.onfinality.io/public-ws',
      Phala: 'wss://api.phala.network/ws'
    },
    text: 'Phala Network',
    ui: {
      color: '#c6fa4c',
      logo: nodesPhalaSVG
    }
  },
  {
    // https://github.com/polkadot-js/apps/issues/7620
    homepage: 'https://polkadex.trade/',
    info: 'polkadex',
    isUnreachable: true,
    paraId: 2040,
    providers: {
      // 'Polkadex Team': 'wss://mainnet.polkadex.trade/', // https://github.com/polkadot-js/apps/issues/7620
      // OnFinality: 'wss://polkadex.api.onfinality.io/public-ws' // https://github.com/polkadot-js/apps/issues/7620
    },
    text: 'Polkadex',
    ui: {
      color: '#7C30DD',
      logo: nodesPolkadexSVG
    }
  },
  {
    homepage: 'https://subdao.network/',
    info: 'subdao',
    isUnreachable: true,
    paraId: 2018,
    providers: {
      SubDAO: 'wss://parachain-rpc.subdao.org'
    },
    text: 'SubDAO',
    ui: {
      color: 'linear-gradient(50deg, #F20092 0%, #FF4D5D 100%)',
      logo: nodesSubdaoPNG
    }
  },
  {
    homepage: 'http://subgame.org/',
    info: 'subgame',
    paraId: 2017,
    providers: {
      // SubGame: 'wss://gamma.subgame.org/' // https://github.com/polkadot-js/apps/pull/6761
    },
    text: 'SubGame Gamma',
    ui: {
      color: '#EB027D',
      logo: nodesSubgameSVG
    }
  },
  {
    homepage: 'https://unique.network/',
    info: 'unique',
    paraId: 2037,
    providers: {
      // This is a possible false positive since OnFinality does not allow connections
      // from non polkadot.js.org urls - however until resolved, this needs to be disabled
      // since we cannot manually check the urls twice daily when they are reported
      // OnFinality: 'wss://unique.api.onfinality.io/public-ws', // https://github.com/polkadot-js/apps/issues/8973
      'Unique America': 'wss://us-ws.unique.network/',
      'Unique Asia': 'wss://asia-ws.unique.network/',
      'Unique Europe': 'wss://eu-ws.unique.network/'
    },
    text: 'Unique Network',
    ui: {
      color: '#40BCFF',
      logo: nodesUniqueSVG
    }
  },
  {
    homepage: 'https://www.watr.org/',
    info: 'watr',
    paraId: 2058,
    providers: {
      Watr: 'wss://rpc.watr.org',
    },
    text: 'Watr Network',
    ui: {
      color: '#373b39',
      logo: chainsWatrPNG
    }
  }
];

export const prodParasPolkadotCommon: EndpointOption[] = [
  {
    info: 'statemint',
    paraId: 1000,
    providers: {
      Dwellir: 'wss://statemint-rpc.dwellir.com',
      'Dwellir Tunisia': 'wss://statemint-rpc-tn.dwellir.com',
      OnFinality: 'wss://statemint.api.onfinality.io/public-ws',
      Parity: 'wss://statemint-rpc.polkadot.io',
      RadiumBlock: 'wss://statemint.public.curie.radiumblock.co/ws'
    },
    teleport: [-1],
    text: 'Statemint',
    ui: {
      color: '#86e62a',
      logo: nodesStatemineSVG
    }
  },
  {
    info: 'polkadotCollectives',
    paraId: 1001,
    providers: {
      OnFinality: 'wss://collectives.api.onfinality.io/public-ws',
      Parity: 'wss://polkadot-collectives-rpc.polkadot.io'
    },
    teleport: [-1],
    text: 'Collectives',
    ui: {
      color: '#e6777a',
      logo: 'fa;people-group'
    }
  },
  {
    info: 'polkadotBridgeHub',
    paraId: 1002,
    providers: {
      Parity: 'wss://polkadot-bridge-hub-rpc.polkadot.io'
    },
    text: 'BridgeHub',
    ui: {
      logo: nodesBridgeHubSVG
    }
  }
];

export const prodRelayPolkadot: EndpointOption = {
  dnslink: 'polkadot',
  genesisHash: POLKADOT_GENESIS,
  info: 'polkadot',
  linked: [
    ...prodParasPolkadotCommon,
    ...prodParasPolkadot
  ],
  providers: {
    // 'Geometry Labs': 'wss://polkadot.geometry.io/websockets', // https://github.com/polkadot-js/apps/pull/6746
    'Automata 1RPC': 'wss://1rpc.io/dot',
    'Dotters Net': 'wss://rpc.dotters.network/polkadot',
    Dwellir: 'wss://polkadot-rpc.dwellir.com',
    'Dwellir Tunisia': 'wss://polkadot-rpc-tn.dwellir.com',
    'IBP Network': 'wss://rpc.ibp.network/polkadot',
    OnFinality: 'wss://polkadot.api.onfinality.io/public-ws',
    Parity: 'wss://rpc.polkadot.io',
    RadiumBlock: 'wss://polkadot.public.curie.radiumblock.co/ws',
    'light client': 'light://substrate-connect/polkadot'
  },
  teleport: getTeleports(prodParasPolkadotCommon),
  text: 'Polkadot',
  ui: {
    color: '#e6007a',
    logo: chainsPolkadotCircleSVG
  }
};
