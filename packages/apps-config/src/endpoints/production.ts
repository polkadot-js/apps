// Copyright 2017-2023 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { EndpointOption } from './types';

import { chains3dpassPNG, chainsAlephSVG, chainsBittensorPNG, chainsCompetitorsClubPNG, chainsCreditcoinPNG, chainsCrownSterlingPNG, chainsDebioSVG, chainsEfinitySVG, chainsEquilibriumSVG, chainsGenshiroSVG, chainsLogionPNG, chainsMyriadSVG, chainsSpannerPNG } from '../ui/logos/chains';
import { nodesAresOdysseySVG, nodesAutomataPNG, nodesBifrostSVG, nodesCentrifugePNG, nodesChainxSVG, nodesCrabSVG, nodesCrustSVG, nodesDarwiniaSVG, nodesDockMainnetPNG, nodesEdgewareWhitePNG, nodesHanonycashSVG, nodesJoystreamSVG, nodesKulupuSVG, nodesKusariSVG, nodesMathSVG, nodesMinixPNG, nodesNftmartPNG, nodesNodleSVG, nodesPolkadexSVG, nodesPolymeshSVG, nodesRiochainSVG, nodesRobonomicsSVG, nodesSherpaxPNG, nodesSoraSubstrateSVG, nodesStafiPNG, nodesSubgameSVG, nodesSubsocialSVG, nodesSwapdexSVG, nodesTernoaSVG, nodesUniartsPNG, nodesUnitnetworkPNG, nodesWestlakePNG } from '../ui/logos/nodes';

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
    uiColor: '#323232',
    uiLogo: chains3dpassPNG
  },
  {
    info: 'aleph',
    providers: {
      'Aleph Zero Foundation': 'wss://ws.azero.dev'
    },
    text: 'Aleph Zero',
    uiColor: '#00CCAB',
    uiLogo: chainsAlephSVG
  },
  {
    info: 'Ares Odyssey',
    providers: {
      'Ares Protocol': 'wss://odyssey.aresprotocol.io'
    },
    text: 'Ares Odyssey',
    uiColor: '#1295F0',
    uiLogo: nodesAresOdysseySVG
  },
  {
    info: 'automata',
    providers: {
      'Automata Network': 'wss://api.ata.network',
      OnFinality: 'wss://automata.api.onfinality.io/public-ws'
    },
    text: 'Automata',
    uiColor: '#EC7032',
    uiLogo: nodesAutomataPNG
  },
  {
    info: 'bittensor',
    providers: {
      'Opentensor Fdn (Archive)': 'wss://archivelb.nakamoto.opentensor.ai:9943'
    },
    text: 'Bittensor',
    uiColor: '#252525',
    uiLogo: chainsBittensorPNG
  },
  {
    info: 'centrifuge',
    providers: {
      // Centrifuge: 'wss://fullnode.centrifuge.io' // https://github.com/polkadot-js/apps/issues/8012
    },
    text: 'Centrifuge Standalone [Archived]',
    uiColor: '#fcc367',
    uiLogo: nodesCentrifugePNG
  },
  {
    info: 'chainx',
    providers: {
      ChainX: 'wss://mainnet.chainx.org/ws'
    },
    text: 'ChainX',
    uiColor: '#F6C94A',
    uiLogo: nodesChainxSVG
  },
  {
    info: 'competitors-club',
    providers: {
      // 'Competitors Club': 'wss://node0.competitors.club/wss' // https://github.com/polkadot-js/apps/issues/8263
    },
    text: 'Competitors Club',
    uiColor: '#213830',
    uiLogo: chainsCompetitorsClubPNG
  },
  {
    info: 'creditcoin',
    providers: {
      'Creditcoin Foundation': 'wss://rpc.mainnet.creditcoin.network/ws'
    },
    text: 'Creditcoin',
    uiColor: '#2D353F',
    uiLogo: chainsCreditcoinPNG
  },
  {
    info: 'crown-sterling',
    providers: {
      'Crown Sterling': 'wss://blockchain.crownsterling.io'
    },
    text: 'Crown Sterling',
    uiColor: '#13264b',
    uiLogo: chainsCrownSterlingPNG
  },
  {
    info: 'crust',
    providers: {
      'Crust Network': 'wss://rpc.crust.network',
      OnFinality: 'wss://crust.api.onfinality.io/public-ws'
    },
    text: 'Crust Network',
    uiColor: '#ff8812',
    uiLogo: nodesCrustSVG
  },
  {
    info: 'darwinia',
    providers: {
      'Darwinia Network': 'wss://rpc.darwinia.network',
      Dwellir: 'wss://darwinia-rpc.dwellir.com'
    },
    text: 'Darwinia',
    uiColor: '#FF0083',
    uiLogo: nodesDarwiniaSVG
  },
  {
    info: 'crab',
    providers: {
      'Darwinia Network': 'wss://crab-rpc.darwinia.network',
      Dwellir: 'wss://darwiniacrab-rpc.dwellir.com',
      OnFinality: 'wss://darwinia-crab.api.onfinality.io/public-ws'
    },
    text: 'Darwinia Crab',
    uiColor: '#512DBC',
    uiLogo: nodesCrabSVG
  },
  {
    info: 'debio',
    providers: {
      DeBio: 'wss://ws-rpc.debio.network'
    },
    text: 'DeBio',
    uiColor: '#FF56E0',
    uiLogo: chainsDebioSVG
  },
  {
    info: 'dock-pos-mainnet',
    providers: {
      'Dock Association': 'wss://mainnet-node.dock.io'
    },
    text: 'Dock',
    uiLogo: nodesDockMainnetPNG
  },
  {
    info: 'edgeware',
    providers: {
      'Commonwealth Labs': 'wss://mainnet2.edgewa.re',
      JelliedOwl: 'wss://edgeware.jelliedowl.net'
      // OnFinality: 'wss://edgeware.api.onfinality.io/public-ws', // https://github.com/polkadot-js/apps/issues/8768
    },
    text: 'Edgeware',
    uiColor: '#111111',
    uiLogo: nodesEdgewareWhitePNG
  },
  {
    info: 'efinity',
    providers: {
      // Efinity: 'wss://rpc.efinity.io' // https://github.com/polkadot-js/apps/pull/6761
    },
    text: 'Efinity',
    uiColor: '#496ddb',
    uiLogo: chainsEfinitySVG
  },
  {
    info: 'equilibrium',
    providers: {
      // Equilibrium: 'wss://node.equilibrium.io' // https://github.com/polkadot-js/apps/issues/7219
    },
    text: 'Equilibrium',
    uiColor: '#1792ff',
    uiLogo: chainsEquilibriumSVG
  },
  {
    info: 'genshiro',
    providers: {
      Equilibrium: 'wss://node.genshiro.io'
    },
    text: 'Genshiro',
    uiColor: '#e8662d',
    uiLogo: chainsGenshiroSVG
  },
  {
    info: 'hanonycash',
    providers: {
      // Hanonycash: 'wss://rpc.hanonycash.com' // https://github.com/polkadot-js/apps/runs/2755409009?check_suite_focus=true
    },
    text: 'Hanonycash',
    uiColor: '#0099CC',
    uiLogo: nodesHanonycashSVG
  },
  {
    info: 'joystream',
    providers: {
      Jsgenesis: 'wss://rpc.joystream.org'
    },
    text: 'Joystream',
    uiColor: '#4038FF',
    uiLogo: nodesJoystreamSVG
  },
  {
    info: 'kulupu',
    providers: {
      Kulupu: 'wss://rpc.kulupu.corepaper.org/ws'
    },
    text: 'Kulupu',
    uiColor: '#003366',
    uiLogo: nodesKulupuSVG
  },
  {
    info: 'kusari',
    providers: {
      Swapdex: 'wss://ws.kusari.network'
    },
    text: 'Kusari',
    uiColor: '#b8860b',
    uiLogo: nodesKusariSVG
  },
  {
    info: 'logion',
    providers: {
      Logion: 'wss://rpc01.logion.network'
    },
    text: 'logion Standalone',
    uiColor: 'rgb(21, 38, 101)',
    uiLogo: chainsLogionPNG
  },
  {
    info: 'mathchain',
    providers: {
      //  MathWallet: 'wss://mathchain-asia.maiziqianbao.net/ws', // https://github.com/polkadot-js/apps/issues/8525
      // 'MathWallet Backup': 'wss://mathchain-us.maiziqianbao.net/ws' // https://github.com/polkadot-js/apps/issues/8525
    },
    text: 'MathChain',
    uiColor: '#000000',
    uiLogo: nodesMathSVG
  },
  {
    info: 'minix',
    providers: {
      // ChainX: 'wss://minichain-mainnet.coming.chat/ws' // https://github.com/polkadot-js/apps/issues/7182
    },
    text: 'MiniX',
    uiColor: '#5152f7',
    uiLogo: nodesMinixPNG
  },
  {
    info: 'myriad',
    providers: {
      Myriad: 'wss://ws-rpc.myriad.social'
    },
    text: 'Myriad',
    uiColor: '#7342CC',
    uiLogo: chainsMyriadSVG
  },
  {
    info: 'neatcoin',
    providers: {
      Neatcoin: 'wss://rpc.neatcoin.org/ws'
    },
    text: 'Neatcoin'
  },
  {
    info: 'nftmart',
    providers: {
      NFTMart: 'wss://mainnet.nftmart.io/rpc/ws'
    },
    text: 'NFTMart',
    uiLogo: nodesNftmartPNG
  },
  {
    info: 'nodle',
    providers: {
      // Nodle: 'wss://main3.nodleprotocol.io', // https://github.com/polkadot-js/apps/issues/7652
      // OnFinality: 'wss://nodle.api.onfinality.io/public-ws' // https://github.com/polkadot-js/apps/issues/8013
    },
    text: 'Nodle',
    uiColor: '#1ab394',
    uiLogo: nodesNodleSVG
  },
  {
    info: 'polkadex',
    providers: {
      OnFinality: 'wss://polkadex.api.onfinality.io/public-ws',
      'Polkadex Team': 'wss://mainnet.polkadex.trade'
    },
    text: 'Polkadex',
    uiColor: '#7C30DD',
    uiLogo: nodesPolkadexSVG
  },
  {
    info: 'polymesh',
    providers: {
      Polymath: 'wss://mainnet-rpc.polymesh.network'
    },
    text: 'Polymesh Mainnet',
    uiColor: '#1348e4',
    uiLogo: nodesPolymeshSVG
  },
  {
    info: 'riochain',
    providers: {
      RioChain: 'wss://node.v1.riochain.io'
    },
    text: 'RioChain',
    uiColor: 'rgb(77, 135, 246)',
    uiLogo: nodesRiochainSVG
  },
  {
    info: 'robonomics',
    providers: {
      // Airalab: 'wss://kusama.rpc.robonomics.network/' // https://github.com/polkadot-js/apps/pull/6761
    },
    text: 'Robonomics',
    uiColor: '#2949d3',
    uiLogo: nodesRobonomicsSVG
  },
  {
    info: 'sherpax',
    providers: {
      ChainX: 'wss://mainnet.sherpax.io'
    },
    text: 'SherpaX',
    uiColor: '#6bbee8',
    uiLogo: nodesSherpaxPNG
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
    uiColor: '#2D2926',
    uiLogo: nodesSoraSubstrateSVG
  },
  {
    info: 'spanner',
    providers: {
      // Spanner: 'wss://wss.spannerprotocol.com' // https://github.com/polkadot-js/apps/issues/6547
    },
    text: 'Spanner',
    uiColor: '#EC3D3D',
    uiLogo: chainsSpannerPNG
  },
  {
    info: 'stafi',
    isDisabled: true, // Cannot find type ChainId
    providers: {
      'Stafi Foundation': 'wss://mainnet-rpc.stafi.io'
    },
    text: 'Stafi',
    uiColor: '#00F3AB',
    uiLogo: nodesStafiPNG
  },
  {
    info: 'subgame',
    providers: {
      SubGame: 'wss://mainnet.subgame.org/'
    },
    text: 'SubGame',
    uiColor: '#EB027D',
    uiLogo: nodesSubgameSVG
  },
  {
    info: 'subsocial',
    providers: {
      // DappForce: 'wss://rpc.subsocial.network' // https://github.com/polkadot-js/apps/issues/8046
    },
    text: 'Subsocial',
    uiColor: '#b9018c',
    uiLogo: nodesSubsocialSVG
  },
  {
    info: 'swapdex',
    providers: {
      Swapdex: 'wss://ws.swapdex.network'
    },
    text: 'Swapdex',
    uiColor: '#E94082',
    uiLogo: nodesSwapdexSVG
  },
  {
    info: 'ternoa',
    providers: {
      CapsuleCorp: 'wss://mainnet.ternoa.network'
    },
    text: 'Ternoa',
    uiColor: '#d622ff',
    uiLogo: nodesTernoaSVG
  },
  {
    info: 'thebifrost-mainnet',
    providers: {
      'Pilab #1': 'wss://public-01.mainnet.thebifrost.io/wss',
      'Pilab #2': 'wss://public-02.mainnet.thebifrost.io/wss'
    },
    text: 'The Bifrost Mainnet',
    uiColor: '#5a25f0',
    uiLogo: nodesBifrostSVG
  },
  {
    info: 'uniarts',
    providers: {
      UniArts: 'wss://mainnet.uniarts.vip:9443'
    },
    text: 'UniArts',
    uiColor: 'linear-gradient(150deg, #333ef7 0%, #55adff 100%)',
    uiLogo: nodesUniartsPNG
  },
  {
    info: 'unitnetwork',
    providers: {
      // UnitNetwork: 'wss://www.unitnode3.info:443'
    },
    text: 'UnitNetwork',
    uiColor: '#a351ef',
    uiLogo: nodesUnitnetworkPNG
  },
  {
    info: 'westlake',
    providers: {
      // DataHighway: 'wss://westlake.datahighway.com' // https://github.com/polkadot-js/apps/issues/7293
    },
    text: 'Westlake',
    uiColor: 'linear-gradient(-90deg, #9400D3 0%, #5A5CA9 50%, #00BFFF 100%)',
    uiLogo: nodesWestlakePNG
  }
];
