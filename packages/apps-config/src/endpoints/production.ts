// Copyright 2017-2023 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { EndpointOption } from './types';

import { chains3dpassPNG, chainsAlephSVG, chainsBittensorPNG, chainsCreditcoinPNG, chainsDebioSVG, chainsEquilibriumSVG, chainsGenshiroSVG, chainsLogionPNG, chainsMyriadPNG, chainsSpannerPNG } from '../ui/logos/chains';
import { nodesAresOdysseySVG, nodesAutomataPNG, nodesCentrifugePNG, nodesChainxSVG, nodesCompetitorsClubPNG, nodesCrabSVG, nodesCrownSterlingPNG, nodesCrustSVG, nodesDarwiniaSVG, nodesDatahighwayPNG, nodesDockPNG, nodesEdgewareWhitePNG, nodesEfinitySVG, nodesHanyonycashPNG, nodesHumanodePNG, nodesJoystreamSVG, nodesKulupuSVG, nodesKusariSVG, nodesMathSVG, nodesMinixPNG, nodesNftmartPNG, nodesNodleSVG, nodesPolkadexSVG, nodesPolymeshSVG, nodesRiochainSVG, nodesRobonomicsSVG, nodesSherpaxPNG, nodesSoraSubstrateSVG, nodesStafiPNG, nodesSubgameSVG, nodesSubsocialSVG, nodesSwapdexSVG, nodesTernoaSVG, nodesThebifrostPNG, nodesUniartsPNG, nodesUnitnetworkPNG } from '../ui/logos/nodes';

export * from './productionRelayKusama';
export * from './productionRelayPolkadot';

// The available endpoints that will show in the dropdown. For the most part (with the exception of
// Polkadot) we try to keep this to live chains only, with RPCs hosted by the community/chain vendor
//   info: The chain logo name as defined in ../ui/logos/index.ts in namedLogos (this also needs to align with @polkadot/networks)
//   text: The text to display on the dropdown
//   providers: The actual hosted secure websocket endpoint
//
// IMPORTANT: Alphabetical based on text
export const prodChains: EndpointOption[] = [
  {
    info: '3dpass',
    providers: {
      '3dpass': 'wss://rpc2.3dpass.org'
    },
    text: '3DPass',
    ui: {
      color: '#323232',
      logo: chains3dpassPNG
    }
  },
  {
    info: 'aleph',
    providers: {
      'Aleph Zero Foundation': 'wss://ws.azero.dev'
    },
    text: 'Aleph Zero',
    ui: {
      color: '#00CCAB',
      logo: chainsAlephSVG
    }
  },
  {
    info: 'Ares Odyssey',
    providers: {
      'Ares Protocol': 'wss://odyssey.aresprotocol.io'
    },
    text: 'Ares Odyssey',
    ui: {
      color: '#1295F0',
      logo: nodesAresOdysseySVG
    }
  },
  {
    info: 'automata',
    providers: {
      'Automata Network': 'wss://api.ata.network',
      OnFinality: 'wss://automata.api.onfinality.io/public-ws'
    },
    text: 'Automata',
    ui: {
      color: '#EC7032',
      logo: nodesAutomataPNG
    }
  },
  {
    info: 'bittensor',
    providers: {
      'Opentensor Fdn (Archive)': 'wss://archivelb.nakamoto.opentensor.ai:9943'
    },
    text: 'Bittensor',
    ui: {
      color: '#252525',
      logo: chainsBittensorPNG
    }
  },
  {
    info: 'centrifuge',
    providers: {
      // Centrifuge: 'wss://fullnode.centrifuge.io' // https://github.com/polkadot-js/apps/issues/8012
    },
    text: 'Centrifuge Standalone [Archived]',
    ui: {
      color: '#fcc367',
      logo: nodesCentrifugePNG
    }
  },
  {
    info: 'chainx',
    providers: {
      ChainX: 'wss://mainnet.chainx.org/ws'
    },
    text: 'ChainX',
    ui: {
      color: '#F6C94A',
      logo: nodesChainxSVG
    }
  },
  {
    info: 'competitors-club',
    providers: {
      // 'Competitors Club': 'wss://node0.competitors.club/wss' // https://github.com/polkadot-js/apps/issues/8263
    },
    text: 'Competitors Club',
    ui: {
      color: '#213830',
      logo: nodesCompetitorsClubPNG
    }
  },
  {
    info: 'creditcoin',
    providers: {
      'Creditcoin Foundation': 'wss://rpc.mainnet.creditcoin.network/ws'
    },
    text: 'Creditcoin',
    ui: {
      color: '#2D353F',
      logo: chainsCreditcoinPNG
    }
  },
  {
    info: 'crown-sterling',
    providers: {
      'Crown Sterling': 'wss://blockchain.crownsterling.io'
    },
    text: 'Crown Sterling',
    ui: {
      color: '#13264b',
      logo: nodesCrownSterlingPNG
    }
  },
  {
    info: 'crust',
    providers: {
      'Crust Network': 'wss://rpc.crust.network',
      OnFinality: 'wss://crust.api.onfinality.io/public-ws'
    },
    text: 'Crust Network',
    ui: {
      color: '#ff8812',
      logo: nodesCrustSVG
    }
  },
  {
    info: 'darwinia',
    providers: {
      'Darwinia Network': 'wss://rpc.darwinia.network',
      Dwellir: 'wss://darwinia-rpc.dwellir.com'
    },
    text: 'Darwinia',
    ui: {
      color: '#FF0083',
      logo: nodesDarwiniaSVG
    }
  },
  {
    info: 'crab',
    providers: {
      'Darwinia Network': 'wss://crab-rpc.darwinia.network',
      Dwellir: 'wss://darwiniacrab-rpc.dwellir.com',
      OnFinality: 'wss://darwinia-crab.api.onfinality.io/public-ws'
    },
    text: 'Darwinia Crab',
    ui: {
      color: '#512DBC',
      logo: nodesCrabSVG
    }
  },
  {
    info: 'debio',
    providers: {
      DeBio: 'wss://ws-rpc.debio.network'
    },
    text: 'DeBio',
    ui: {
      color: '#FF56E0',
      logo: chainsDebioSVG
    }
  },
  {
    info: 'dock-pos-mainnet',
    providers: {
      'Dock Association': 'wss://mainnet-node.dock.io'
    },
    text: 'Dock',
    ui: {
      logo: nodesDockPNG
    }
  },
  {
    info: 'edgeware',
    providers: {
      'Commonwealth Labs': 'wss://mainnet2.edgewa.re',
      JelliedOwl: 'wss://edgeware.jelliedowl.net'
      // OnFinality: 'wss://edgeware.api.onfinality.io/public-ws', // https://github.com/polkadot-js/apps/issues/8768
    },
    text: 'Edgeware',
    ui: {
      color: '#111111',
      logo: nodesEdgewareWhitePNG
    }
  },
  {
    info: 'efinity',
    providers: {
      // Efinity: 'wss://rpc.efinity.io' // https://github.com/polkadot-js/apps/pull/6761
    },
    text: 'Efinity',
    ui: {
      color: '#496ddb',
      logo: nodesEfinitySVG
    }
  },
  {
    info: 'equilibrium',
    providers: {
      // Equilibrium: 'wss://node.equilibrium.io' // https://github.com/polkadot-js/apps/issues/7219
    },
    text: 'Equilibrium',
    ui: {
      color: '#1792ff',
      logo: chainsEquilibriumSVG
    }
  },
  {
    info: 'genshiro',
    providers: {
      Equilibrium: 'wss://node.genshiro.io'
    },
    text: 'Genshiro',
    ui: {
      color: '#e8662d',
      logo: chainsGenshiroSVG
    }
  },
  {
    info: 'hanonycash',
    providers: {
      // Hanonycash: 'wss://rpc.hanonycash.com' // https://github.com/polkadot-js/apps/runs/2755409009?check_suite_focus=true
    },
    text: 'Hanonycash',
    ui: {
      color: '#0099CC',
      logo: nodesHanyonycashPNG
    }
  },
  {
    info: 'humanode',
    providers: {
      Humanode: 'wss://explorer-rpc-ws.mainnet.stages.humanode.io'
    },
    text: 'Humanode',
    ui: {
      logo: nodesHumanodePNG
    }
  },
  {
    info: 'joystream',
    providers: {
      Jsgenesis: 'wss://rpc.joystream.org'
    },
    text: 'Joystream',
    ui: {
      color: '#4038FF',
      logo: nodesJoystreamSVG
    }
  },
  {
    info: 'kulupu',
    providers: {
      Kulupu: 'wss://rpc.kulupu.corepaper.org/ws'
    },
    text: 'Kulupu',
    ui: {
      color: '#003366',
      logo: nodesKulupuSVG
    }
  },
  {
    info: 'kusari',
    providers: {
      Swapdex: 'wss://ws.kusari.network'
    },
    text: 'Kusari',
    ui: {
      color: '#b8860b',
      logo: nodesKusariSVG
    }
  },
  {
    info: 'logion',
    providers: {
      Logion: 'wss://rpc01.logion.network'
    },
    text: 'logion Standalone',
    ui: {
      color: 'rgb(21, 38, 101)',
      logo: chainsLogionPNG
    }
  },
  {
    info: 'mathchain',
    providers: {
      //  MathWallet: 'wss://mathchain-asia.maiziqianbao.net/ws', // https://github.com/polkadot-js/apps/issues/8525
      // 'MathWallet Backup': 'wss://mathchain-us.maiziqianbao.net/ws' // https://github.com/polkadot-js/apps/issues/8525
    },
    text: 'MathChain',
    ui: {
      color: '#000000',
      logo: nodesMathSVG
    }
  },
  {
    info: 'minix',
    providers: {
      // ChainX: 'wss://minichain-mainnet.coming.chat/ws' // https://github.com/polkadot-js/apps/issues/7182
    },
    text: 'MiniX',
    ui: {
      color: '#5152f7',
      logo: nodesMinixPNG
    }
  },
  {
    info: 'myriad',
    providers: {
      Myriad: 'wss://ws-rpc.myriad.social'
    },
    text: 'Myriad',
    ui: {
      color: '#7342CC',
      logo: chainsMyriadPNG
    }
  },
  {
    info: 'neatcoin',
    providers: {
      Neatcoin: 'wss://rpc.neatcoin.org/ws'
    },
    text: 'Neatcoin',
    ui: {}
  },
  {
    info: 'nftmart',
    providers: {
      NFTMart: 'wss://mainnet.nftmart.io/rpc/ws'
    },
    text: 'NFTMart',
    ui: {
      logo: nodesNftmartPNG
    }
  },
  {
    info: 'nodle',
    providers: {
      // Nodle: 'wss://main3.nodleprotocol.io', // https://github.com/polkadot-js/apps/issues/7652
      // OnFinality: 'wss://nodle.api.onfinality.io/public-ws' // https://github.com/polkadot-js/apps/issues/8013
    },
    text: 'Nodle',
    ui: {
      color: '#1ab394',
      logo: nodesNodleSVG
    }
  },
  {
    info: 'polkadex',
    providers: {
      OnFinality: 'wss://polkadex.api.onfinality.io/public-ws',
      'Polkadex Team': 'wss://mainnet.polkadex.trade'
    },
    text: 'Polkadex',
    ui: {
      color: '#7C30DD',
      logo: nodesPolkadexSVG
    }
  },
  {
    info: 'polymesh',
    providers: {
      Polymath: 'wss://mainnet-rpc.polymesh.network'
    },
    text: 'Polymesh Mainnet',
    ui: {
      color: '#1348e4',
      logo: nodesPolymeshSVG
    }
  },
  {
    info: 'riochain',
    providers: {
      // RioChain: 'wss://node.v1.riochain.io' // https://github.com/polkadot-js/apps/issues/9054
    },
    text: 'RioChain',
    ui: {
      color: 'rgb(77, 135, 246)',
      logo: nodesRiochainSVG
    }
  },
  {
    info: 'robonomics',
    providers: {
      // Airalab: 'wss://kusama.rpc.robonomics.network/' // https://github.com/polkadot-js/apps/pull/6761
    },
    text: 'Robonomics',
    ui: {
      color: '#2949d3',
      logo: nodesRobonomicsSVG
    }
  },
  {
    info: 'sherpax',
    providers: {
      ChainX: 'wss://mainnet.sherpax.io'
    },
    text: 'SherpaX',
    ui: {
      color: '#6bbee8',
      logo: nodesSherpaxPNG
    }
  },
  {
    info: 'sora-substrate',
    providers: {
      OnFinality: 'wss://sora.api.onfinality.io/public-ws',
      'SORA Parliament Ministry of Finance': 'wss://ws.mof.sora.org',
      'SORA Parliament Ministry of Finance #2': 'wss://mof2.sora.org',
      'SORA Parliament Ministry of Finance #3': 'wss://mof3.sora.org'
    },
    text: 'SORA',
    ui: {
      color: '#2D2926',
      logo: nodesSoraSubstrateSVG
    }
  },
  {
    info: 'spanner',
    providers: {
      // Spanner: 'wss://wss.spannerprotocol.com' // https://github.com/polkadot-js/apps/issues/6547
    },
    text: 'Spanner',
    ui: {
      color: '#EC3D3D',
      logo: chainsSpannerPNG
    }
  },
  {
    info: 'stafi',
    isDisabled: true, // Cannot find type ChainId
    providers: {
      'Stafi Foundation': 'wss://mainnet-rpc.stafi.io'
    },
    text: 'Stafi',
    ui: {
      color: '#00F3AB',
      logo: nodesStafiPNG
    }
  },
  {
    info: 'subgame',
    providers: {
      // SubGame: 'wss://mainnet.subgame.org/' // https://github.com/polkadot-js/apps/issues/9030
    },
    text: 'SubGame',
    ui: {
      color: '#EB027D',
      logo: nodesSubgameSVG
    }
  },
  {
    info: 'subsocial',
    providers: {
      // DappForce: 'wss://rpc.subsocial.network' // https://github.com/polkadot-js/apps/issues/8046
    },
    text: 'Subsocial',
    ui: {
      color: '#b9018c',
      logo: nodesSubsocialSVG
    }
  },
  {
    info: 'swapdex',
    providers: {
      Swapdex: 'wss://ws.swapdex.network'
    },
    text: 'Swapdex',
    ui: {
      color: '#E94082',
      logo: nodesSwapdexSVG
    }
  },
  {
    info: 'ternoa',
    providers: {
      CapsuleCorp: 'wss://mainnet.ternoa.network'
    },
    text: 'Ternoa',
    ui: {
      color: '#d622ff',
      logo: nodesTernoaSVG
    }
  },
  {
    info: 'thebifrost-mainnet',
    providers: {
      'Pilab #1': 'wss://public-01.mainnet.thebifrost.io/wss',
      'Pilab #2': 'wss://public-02.mainnet.thebifrost.io/wss'
    },
    text: 'The Bifrost Mainnet',
    ui: {
      color: '#5a25f0',
      logo: nodesThebifrostPNG
    }
  },
  {
    info: 'uniarts',
    providers: {
      // UniArts: 'wss://mainnet.uniarts.vip:9443' // https://github.com/polkadot-js/apps/issues/9059
    },
    text: 'UniArts',
    ui: {
      color: 'linear-gradient(150deg, #333ef7 0%, #55adff 100%)',
      logo: nodesUniartsPNG
    }
  },
  {
    info: 'unitnetwork',
    providers: {
      // UnitNetwork: 'wss://www.unitnode3.info:443'
    },
    text: 'UnitNetwork',
    ui: {
      color: '#a351ef',
      logo: nodesUnitnetworkPNG
    }
  },
  {
    info: 'westlake',
    providers: {
      // DataHighway: 'wss://westlake.datahighway.com' // https://github.com/polkadot-js/apps/issues/7293
    },
    text: 'Westlake',
    ui: {
      color: 'linear-gradient(-90deg, #9400D3 0%, #5A5CA9 50%, #00BFFF 100%)',
      logo: nodesDatahighwayPNG
    }
  }
];
