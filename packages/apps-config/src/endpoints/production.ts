// Copyright 2017-2025 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { EndpointOption } from './types.js';

import { chains3dpassSVG, chainsAlephSVG, chainsAnalogSVG, chainsBittensorPNG, chainsChainflipPNG, chainsCommuneaiPNG, chainsCreditcoinPNG, chainsDebioSVG, chainsFragnovaPNG, chainsJurPNG, chainsLiberlandPNG, chainsLogionPNG, chainsMyriadPNG, chainsSpannerPNG, chainsTanglePNG, chainsTorusPNG, chainsVaraPNG, chainsVtbPNG } from '../ui/logos/chains/index.js';
import { nodesAresOdysseySVG, nodesAutonomysPNG, nodesCentrifugePNG, nodesCereSVG, nodesChainxSVG, nodesCompetitorsClubPNG, nodesCrownSterlingPNG, nodesCrustSVG, nodesDatahighwayPNG, nodesDockPNG, nodesEdgewareWhitePNG, nodesEfinitySVG, nodesElysiumPNG, nodesHanyonycashPNG, nodesHumanodePNG, nodesInnovatorPNG, nodesJoystreamSVG, nodesKulupuSVG, nodesKusariSVG, nodesMathSVG, nodesMinixPNG, nodesNftmartPNG, nodesNodleSVG, nodesPolkadexSVG, nodesPolymeshSVG, nodesRiochainSVG, nodesRobonomicsSVG, nodesSherpaxPNG, nodesSoraSubstrateSVG, nodesStafiPNG, nodesSubgameSVG, nodesSubsocialSVG, nodesSwapdexSVG, nodesTanssiSVG, nodesTernoaSVG, nodesThebifrostPNG, nodesTscsPNG, nodesUniartsPNG, nodesUnitnetworkPNG } from '../ui/logos/nodes/index.js';

export * from './productionRelayKusama.js';
export * from './productionRelayPolkadot.js';

// The available endpoints that will show in the dropdown. For the most part (with the exception of
// Polkadot) we try to keep this to live chains only, with RPCs hosted by the community/chain vendor
//   info: The chain logo name as defined in ../ui/logos/index.ts in namedLogos (this also needs to align with @polkadot/networks)
//   text: The text to display on the dropdown
//   providers: The actual hosted secure websocket endpoint
//
// IMPORTANT: Alphabetical based on text
export const prodChains: Omit<EndpointOption, 'teleport'>[] = [
  {
    info: '3dpass',
    providers: {
      '3dpass': 'wss://rpc.3dpass.org'
    },
    text: '3DPass',
    ui: {
      color: '#323232',
      logo: chains3dpassSVG
    }
  },
  {
    info: 'aleph',
    providers: {
      'Aleph Zero Foundation': 'wss://ws.azero.dev',
      OnFinality: 'wss://aleph-zero.api.onfinality.io/public-ws'
    },
    text: 'Aleph Zero',
    ui: {
      color: '#00CCAB',
      logo: chainsAlephSVG
    }
  },
  {
    homepage: 'https://analog.one',
    info: 'analog-timechain',
    providers: {
      'Analog One': 'wss://rpc.timechain.analog.one'
    },
    text: 'Analog Timechain',
    ui: {
      color: '#5d3ef8',
      identityIcon: 'beachball',
      logo: chainsAnalogSVG
    }
  },
  {
    info: 'Ares Odyssey',
    providers: {
      // 'Ares Protocol': 'wss://odyssey.aresprotocol.io' // https://github.com/polkadot-js/apps/issues/10411
    },
    text: 'Ares Odyssey',
    ui: {
      color: '#1295F0',
      logo: nodesAresOdysseySVG
    }
  },
  {
    info: 'autonomys-mainnet',
    providers: {
      Foundation: 'wss://rpc.mainnet.subspace.foundation/ws',
      Labs: 'wss://rpc-0.mainnet.autonomys.xyz/ws'
    },
    text: 'Autonomys',
    ui: {
      color: '#5870B3',
      logo: nodesAutonomysPNG
    }
  },
  {
    info: 'autonomys-mainnet-evm',
    providers: {
      Labs: 'wss://auto-evm.mainnet.autonomys.xyz/ws'
    },
    text: 'Autonomys EVM',
    ui: {
      color: '#5870B3',
      logo: nodesAutonomysPNG
    }
  },
  {
    info: 'thebifrost-mainnet',
    providers: {
      'Pilab #1': 'wss://public-01.mainnet.bifrostnetwork.com/wss',
      'Pilab #2': 'wss://public-02.mainnet.bifrostnetwork.com/wss'
    },
    text: 'Bifrost Mainnet',
    ui: {
      color: '#FF474C',
      logo: nodesThebifrostPNG
    }
  },
  {
    info: 'bittensor',
    providers: {
      'Latent Holdings (Lite)': 'wss://lite.sub.latent.to:443',
      'OnFinality (Archive)': 'wss://bittensor-finney.api.onfinality.io/public-ws',
      'Opentensor Fdn (Archive)': 'wss://entrypoint-finney.opentensor.ai:443'
    },
    text: 'Bittensor',
    ui: {
      color: '#252525',
      logo: chainsBittensorPNG
    }
  },
  {
    info: 'creditcoin-classic',
    providers: {
      'Creditcoin Foundation': 'wss://mainnet.creditcoin.network/ws'
    },
    text: 'CC Enterprise',
    ui: {
      color: '#2D353F',
      logo: chainsCreditcoinPNG
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
    info: 'cere',
    providers: {
      'Cere Network': 'wss://archive.mainnet.cere.network/ws'
      // 'Republic Crypto | Runtime': 'wss://mainnet.cere-archive.republiccrypto-runtime.com:444' // https://github.com/polkadot-js/apps/issues/9828
    },
    text: 'Cere Network',
    ui: {
      color: '#B7AEFF',
      logo: nodesCereSVG
    }
  },
  {
    info: 'chainflip',
    providers: {
      chainflip: 'wss://mainnet-archive.chainflip.io'
    },
    text: 'Chainflip',
    ui: {
      color: '#111111',
      logo: chainsChainflipPNG
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
    info: 'communeai',
    providers: {
      Bitconnect: 'wss://commune-api-node-1.communeai.net'
      // OnFinality: 'wss://commune.api.onfinality.io/public-ws'
    },
    text: 'Commune AI',
    ui: {
      color: '#060606',
      logo: chainsCommuneaiPNG
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
      'Creditcoin Foundation': 'wss://mainnet3.creditcoin.network'
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
      // 'Crown Sterling': 'wss://blockchain.crownsterling.io' https://github.com/polkadot-js/apps/issues/10289
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
      'Crust Network APP': 'wss://rpc.crustnetwork.app',
      'Crust Network CC': 'wss://rpc.crustnetwork.cc',
      'Crust Network XYZ': 'wss://rpc.crustnetwork.xyz',
      OnFinality: 'wss://crust.api.onfinality.io/public-ws'
    },
    text: 'Crust Network',
    ui: {
      color: '#ff8812',
      logo: nodesCrustSVG
    }
  },
  {
    info: 'debio',
    providers: {
      // DeBio: 'wss://ws-rpc.debio.network', // https://github.com/polkadot-js/apps/issues/10118
      // Octopus: 'wss://gateway.mainnet.octopus.network/debionetwork/ae48005a0c7ecb4053394559a7f4069e' // https://github.com/polkadot-js/apps/issues/11234
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
      // 'Dock Association': 'wss://mainnet-node.dock.io' // https://github.com/polkadot-js/apps/issues/11460
    },
    text: 'Dock',
    ui: {
      logo: nodesDockPNG
    }
  },
  {
    info: 'edgeware',
    providers: {
      // 'Commonwealth Labs': 'wss://mainnet2.edgewa.re', // https://github.com/polkadot-js/apps/issues/10373
      'JelliedOwl Bangalore': 'wss://edgeware-rpc3.jelliedowl.net'
      // OnFinality: 'wss://edgeware.api.onfinality.io/public-ws' // https://github.com/polkadot-js/apps/issues/9795
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
    info: 'elysium',
    providers: {
      Elysium: 'wss://ws.elysiumchain.tech'
    },
    text: 'Elysium',
    ui: {
      color: '#140533',
      logo: nodesElysiumPNG
    }
  },
  {
    info: 'fragnova',
    providers: {
      // 'Fragnova Network': 'wss://ws.fragnova.network' // https://github.com/polkadot-js/apps/issues/10172
    },
    text: 'Fragnova', // The text to display on the dropdown
    ui: {
      color: '#6b35a8',
      logo: chainsFragnovaPNG
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
    info: 'innovatorchain',
    providers: {
      // Innovator: 'wss://rpc.innovatorchain.com' // https://github.com/polkadot-js/apps/issues/10373
    },
    text: 'Innovator Chain',
    ui: {
      color: '#0067F4',
      logo: nodesInnovatorPNG
    }
  },
  {
    info: 'joystream',
    providers: {
      Joyutils: 'wss://rpc.joyutils.org',
      Jsgenesis: 'wss://rpc.joystream.org'
    },
    text: 'Joystream',
    ui: {
      color: '#4038FF',
      logo: nodesJoystreamSVG
    }
  },
  {
    info: 'jur',
    providers: {
      // 'Iceberg Nodes': 'wss://jur-mainnet-archive-rpc-1.icebergnodes.io' // https://github.com/polkadot-js/apps/issues/10289
      // 'Simply Staking': 'wss://jur-archive-mainnet-1.simplystaking.xyz/VX68C07AR4K2/ws' // https://github.com/polkadot-js/apps/issues/10172
    },
    text: 'Jur',
    ui: {
      color: '#203050',
      logo: chainsJurPNG
    }
  },
  {
    info: 'kulupu',
    providers: {
      // Kulupu: 'wss://rpc.kulupu.corepaper.org/ws' https://github.com/polkadot-js/apps/issues/11157
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
      // Swapdex: 'wss://ws.kusari.network' // https://github.com/polkadot-js/apps/issues/9712
    },
    text: 'Kusari',
    ui: {
      color: '#b8860b',
      logo: nodesKusariSVG
    }
  },
  {
    info: 'Liberland',
    providers: {
      Dwellir: 'wss://liberland-rpc.n.dwellir.com',
      'Liberland Government': 'wss://mainnet.liberland.org'
    },
    text: 'Liberland mainnet',
    ui: {
      color: 'rgb(13, 52, 93)',
      logo: chainsLiberlandPNG
    }
  },
  {
    info: 'logion',
    providers: {
      // 'Logion 1': 'wss://rpc01.logion.network' // https://github.com/polkadot-js/apps/issues/10667
    },
    text: 'Logion Solochain (Archive)',
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
      // Myriad: 'wss://ws-rpc.myriad.social', // https://github.com/polkadot-js/apps/issues/10172
      // Octopus: 'wss://gateway.mainnet.octopus.network/myriad/a4cb0a6e30ff5233a3567eb4e8cb71e0' // https://github.com/polkadot-js/apps/issues/11263
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
      // Neatcoin: 'wss://rpc.neatcoin.org/ws' https://github.com/polkadot-js/apps/issues/11157
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
      PolkadexSup: 'wss://so.polkadex.ee',
      RadiumBlock: 'wss://polkadex.public.curie.radiumblock.co/ws'
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
      Polymesh: 'wss://mainnet-rpc.polymesh.network'
    },
    text: 'Polymesh Mainnet',
    ui: {
      color: 'linear-gradient(197deg, #FF2E72, #4A125E)',
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
      // ChainX: 'wss://mainnet.sherpax.io' // https://github.com/polkadot-js/apps/issues/9712
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
    providers: {
      // 'Stafi Foundation': 'wss://mainnet-rpc.stafi.io' // Cannot find type ChainId
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
      // Swapdex: 'wss://ws.swapdex.network' // https://github.com/polkadot-js/apps/issues/10030
    },
    text: 'Swapdex',
    ui: {
      color: '#E94082',
      logo: nodesSwapdexSVG
    }
  },
  {
    info: 'tangle',
    providers: {
      Dwellir: 'wss://tangle-mainnet-rpc.n.dwellir.com',
      Webb: 'wss://rpc.tangle.tools'
    },
    text: 'Tangle',
    ui: {
      color: '#7578fb',
      logo: chainsTanglePNG
    }
  },
  {
    info: 'tanssi',
    providers: {
      'Tanssi Foundation': 'wss://services.tanssi-mainnet.network/tanssi'
    },
    text: 'Tanssi',
    ui: {
      color: '#149b9bff',
      logo: nodesTanssiSVG
    }
  },
  {
    info: 'ternoa',
    providers: {
      CapsuleCorp: 'wss://mainnet.ternoa.network' // https://github.com/polkadot-js/apps/issues/10172
    },
    text: 'Ternoa',
    ui: {
      color: '#d622ff',
      logo: nodesTernoaSVG
    }
  },
  {
    info: 'torus',
    providers: {
      mainnet: 'wss://api.torus.network'
    },
    text: 'Torus',
    ui: {
      color: '#070A0E',
      logo: chainsTorusPNG
    }
  },
  {
    info: 'tscs-mainnet',
    providers: {
      SuperEX: 'wss://testnetrpc.scschain.com'
    },
    text: 'TSCS Network',
    ui: {
      color: '#FFAB75',
      logo: nodesTscsPNG
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
      // UnitNetwork: 'wss://www.unitnode3.info:443' // Duplicated in Rococo
    },
    text: 'UnitNetwork',
    ui: {
      color: '#a351ef',
      logo: nodesUnitnetworkPNG
    }
  },
  {
    info: 'vara',
    isPeopleForIdentity: false,
    providers: {
      // Blast: 'wss://vara-mainnet.public.blastapi.io', // https://github.com/polkadot-js/apps/issues/11577
      Gear: 'wss://rpc.vara.network'
      // 'P2P.org': 'wss://vara.substrate-rpc.p2p.org/' // https://github.com/polkadot-js/apps/issues/11337
    },
    text: 'Vara',
    ui: {
      color: '#00a87a',
      logo: chainsVaraPNG
    }
  },
  {
    info: 'vtb',
    providers: {
      'VTB Community': 'wss://substratenode.vtbcfoundation.org/explorer'
    },
    text: 'VTB',
    ui: {
      color: '#1d79bb',
      logo: chainsVtbPNG
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
