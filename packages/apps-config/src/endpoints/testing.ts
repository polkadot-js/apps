// Copyright 2017-2025 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { EndpointOption } from './types.js';

import { ZKVERIFY_VOLTA_GENESIS } from '../api/constants.js';
import { chains3dpassSVG, chainsAcalaSVG, chainsAlephSVG, chainsAllfeatSVG, chainsAnalogSVG, chainsArgonSVG, chainsBrainstormPNG, chainsChainflipPNG, chainsCreditcoinTestPNG, chainsDebioSVG, chainsEquilibriumSVG, chainsFerrumPNG, chainsFragnovaPNG, chainsJurPNG, chainsKintsugiPNG, chainsLiberlandPNG, chainsLogionPNG, chainsMyriadPNG, chainsQfNetworkPNG, chainsShidenPNG, chainsSkyekiwiPNG, chainsTanglePNG, chainsVaraTestnetPNG } from '../ui/logos/chains/index.js';
import { nodesArcticPNG, nodesAresGladiosSVG, nodesAutonomysPNG, nodesBifrostSVG, nodesBitcountryPNG, nodesCereSVG, nodesCessPNG, nodesCloverSVG, nodesCrustMaxwellSVG, nodesCurioSVG, nodesDancelightSVG, nodesDatahighwayPNG, nodesDockPNG, nodesDolphinSVG, nodesDotmogSVG, nodesEdgewareWhitePNG, nodesEncointerBlueSVG, nodesFantourPNG, nodesGalitalLogoPNG, nodesGamepowerSVG, nodesGeekSVG, nodesInterlaySVG, nodesIpsePNG, nodesJazPNG, nodesJupiterSVG, nodesKarmachainSVG, nodesKhalaSVG, nodesKlugPNG, nodesKylinPNG, nodesLaminarCircleSVG, nodesMantaPNG, nodesMathSVG, nodesMinixPNG, nodesMoonbaseAlphaSVG, nodesMybankPNG, nodesNftmartPNG, nodesNodleSVG, nodesOpalLogoPNG, nodesOpportunityPNG, nodesPhalaSVG, nodesPhoenixPNG, nodesPhykenNetworkPNG, nodesPichiuPNG, nodesPolkadexSVG, nodesPolkafoundrySVG, nodesPolymeshSVG, nodesPontemSVG, nodesPrismPNG, nodesRealisPNG, nodesRiochainSVG, nodesSherpaxPNG, nodesSoonsocialPNG, nodesSoraSubstrateSVG, nodesSubdaoPNG, nodesSubgameSVG, nodesSubspacePNG, nodesSubstrateHexagonSVG, nodesTernoaSVG, nodesThebifrostPNG, nodesUniartsPNG, nodesUniqueSVG, nodesUnitnetworkPNG, nodesVFlowPNG, nodesWeb3gamesSVG, nodesZCloakSVG, nodesZeroSVG, nodesZkVerifyPNG } from '../ui/logos/nodes/index.js';

export * from './testingRelayPaseo.js';
export * from './testingRelayWestend.js';

export const testZkVerifyParas: Omit<EndpointOption, 'teleport'>[] = [
  {
    info: 'VFlow',
    paraId: 1,
    providers: {
      zkVerify: 'wss://vflow-volta-rpc.zkverify.io'
    },
    relayName: 'zkVerify-testnet',
    text: 'VFlow Volta Testnet',
    ui: {
      color: '#628eff',
      logo: nodesVFlowPNG
    }
  }
];

// The available endpoints that will show in the dropdown. For the most part (with the exception of
// Polkadot) we try to keep this to live chains only, with RPCs hosted by the community/chain vendor
//   info: The chain logo name as defined in ../ui/logos/index.ts in namedLogos (this also needs to align with @polkadot/networks)
//   text: The text to display on the dropdown
//   providers: The actual hosted secure websocket endpoint
//
// IMPORTANT: Alphabetical based on text
export const testChains: Omit<EndpointOption, 'teleport'>[] = [
  {
    info: '3dpass-testnet',
    providers: {
      // '3dpass': 'wss://test-rpc.3dpass.org' // https://github.com/polkadot-js/apps/issues/9443
    },
    text: '3DPass Testnet',
    ui: {
      color: '#323232',
      logo: chains3dpassSVG
    }
  },
  {
    info: 'aleph-testnet',
    providers: {
      'Aleph Zero Foundation': 'wss://ws.test.azero.dev'
      // OnFinality: 'wss://aleph-zero.api.onfinality.io/public-ws'
    },
    text: 'Aleph Zero Testnet',
    ui: {
      color: '#00CCAB',
      logo: chainsAlephSVG
    }
  },
  {
    homepage: 'https://analog.one',
    info: 'analog-testnet',
    providers: {
      'Analog One': 'wss://rpc.testnet.analog.one'
    },
    text: 'Analog Testnet',
    ui: {
      color: '#5d3ef8',
      identityIcon: 'beachball',
      logo: chainsAnalogSVG
    }
  },
  {
    info: 'nodle',
    providers: {
      // Nodle: 'wss://arcadia1.nodleprotocol.io' // https://github.com/polkadot-js/apps/issues/7652
    },
    text: 'Arcadia',
    ui: {
      color: '#1ab394',
      logo: nodesNodleSVG
    }
  },
  {
    info: 'arctic',
    providers: {
      // Arctic: 'wss://arctic-rpc.icenetwork.io:9944' // https://github.com/polkadot-js/apps/issues/9405
    },
    text: 'Arctic',
    ui: {
      logo: nodesArcticPNG
    }
  },
  {
    info: 'Ares Gladios',
    providers: {
      // 'Ares Protocol': 'wss://gladios.aresprotocol.io' // https://github.com/polkadot-js/apps/issues/9106
    },
    text: 'Ares Gladios',
    ui: {
      color: '#1295F0',
      logo: nodesAresGladiosSVG
    }
  },
  {
    info: 'Argon',
    providers: {
      'Argon Foundation': 'wss://rpc.testnet.argonprotocol.org'
    },
    text: 'Argon Testnet',
    ui: {
      color: '#a428b3',
      logo: chainsArgonSVG
    }
  },
  {
    info: 'jaz',
    providers: {
      // Jaz: 'wss://ws0.jaz.network' // https://github.com/polkadot-js/apps/issues/9059
    },
    text: 'Artio Testnet',
    ui: {
      color: '#121212',
      logo: nodesJazPNG
    }
  },
  {
    info: 'autonomys-taurus-evm',
    providers: {
      Labs: 'wss://auto-evm.taurus.autonomys.xyz/ws'
    },
    text: 'Autonomys Taurus EVM',
    ui: {
      color: '#5870B3',
      logo: nodesAutonomysPNG
    }
  },
  {
    info: 'autonomys-taurus-testnet',
    providers: {
      'Labs 1': 'wss://rpc-0.taurus.subspace.network/ws',
      'Labs 2': 'wss://rpc-1.taurus.subspace.network/ws'
    },
    text: 'Autonomys Taurus Testnet',
    ui: {
      color: '#5870B3',
      logo: nodesAutonomysPNG
    }
  },
  {
    info: 'edgeware',
    providers: {
      // JelliedOwl: 'wss://beresheet.jelliedowl.net' // https://github.com/polkadot-js/apps/issues/11696
    },
    text: 'Beresheet (Edgeware)',
    ui: {
      logo: nodesEdgewareWhitePNG
    }
  },
  {
    info: 'bifrost',
    providers: {
      // Liebi: 'wss://bifrost-rpc.testnet.liebi.com/ws' // https://github.com/polkadot-js/apps/issues/8139
    },
    text: 'Bifrost Stage Network',
    ui: {
      logo: nodesBifrostSVG
    }
  },
  {
    info: 'thebifrost-testnet',
    providers: {
      'Pilab #1': 'wss://public-01.testnet.bifrostnetwork.com/wss',
      'Pilab #2': 'wss://public-02.testnet.bifrostnetwork.com/wss'
    },
    text: 'Bifrost Testnet',
    ui: {
      color: '#FF474C',
      logo: nodesThebifrostPNG
    }
  },
  {
    info: 'creditcoin-classic-testnet',
    providers: {
      'Creditcoin Foundation': 'wss://rpc.testnet.creditcoin.network/ws'
    },
    text: 'CC Enterprise Testnet',
    ui: {
      color: '#9cffaa',
      logo: chainsCreditcoinTestPNG
    }
  },
  {
    info: 'cere',
    providers: {
      // 'Cere Network': 'wss://archive.testnet.cere.network/ws' // https://github.com/polkadot-js/apps/issues/9712
      // 'Republic Crypto | Runtime': 'wss://testnet.cere-archive.republiccrypto-runtime.com:444' // https://github.com/polkadot-js/apps/issues/9712
    },
    text: 'Cere Network Testnet',
    ui: {
      color: '#B7AEFF',
      logo: nodesCereSVG
    }
  },
  {
    info: 'cess-testnet',
    providers: {
      // CESS: 'wss://testnet-rpc0.cess.cloud/ws/' // https://github.com/polkadot-js/apps/issues/10184
    },
    text: 'CESS Testnet',
    ui: {
      color: '#2269a9',
      logo: nodesCessPNG
    }
  },
  {
    info: 'chainflip',
    providers: {
      chainflip: 'wss://archive.perseverance.chainflip.io'
    },
    text: 'Chainflip Testnet',
    ui: {
      color: '#111111',
      logo: chainsChainflipPNG
    }
  },
  {
    info: 'clover',
    providers: {
      // Clover: 'wss://api.clover.finance/' // Cannot construct unknown type BridgeNetworks
    },
    text: 'Clover',
    ui: {
      color: 'linear-gradient(to right, #52ad75, #7cc773)',
      logo: nodesCloverSVG
    }
  },
  {
    info: 'creditcoin-testnet',
    providers: {
      'Creditcoin Foundation': 'wss://rpc.cc3-testnet.creditcoin.network/ws'
    },
    text: 'Creditcoin Testnet',
    ui: {
      color: '#9cffaa',
      logo: chainsCreditcoinTestPNG
    }
  },
  {
    info: 'Crust Maxwell',
    providers: {
      // 'Crust Network': 'wss://api.crust.network/', // https://github.com/polkadot-js/apps/issues/8060
      // 'DCloud Foundation': 'wss://api.decloudf.com/' // https://github.com/polkadot-js/apps/issues/8060
    },
    text: 'Crust Maxwell',
    ui: {
      color: '#2E333B',
      logo: nodesCrustMaxwellSVG
    }
  },
  {
    info: 'Curio',
    providers: {
    },
    text: 'Curio',
    ui: {
      color: 'rgb(96, 98, 246)',
      logo: nodesCurioSVG
    }
  },
  {
    info: 'Dancelight',
    providers: {
      'Tanssi Foundation': 'wss://services.tanssi-testnet.network/dancelight'
    },
    text: 'Dancelight',
    ui: {
      color: '#000000',
      logo: nodesDancelightSVG
    }
  },
  {
    info: 'datahighway',
    isDisabled: true,
    providers: {
      // MXC: 'wss://spreehafen.datahighway.com' // https://github.com/polkadot-js/apps/issues/9601
    },
    text: 'Spreehafen',
    ui: {
      logo: nodesDatahighwayPNG
    }
  },
  {
    info: 'debio-testnet',
    providers: {
      // DeBio: 'wss://ws-rpc.testnet.debio.network', // https://github.com/polkadot-js/apps/issues/10172
      // Octopus: 'wss://gateway.testnet.octopus.network/debionetwork/554976cbb180f676f188abe14d63ca24' // https://github.com/polkadot-js/apps/issues/10667
    },
    text: 'DeBio Testnet',
    ui: {
      color: '#FF56E0',
      logo: chainsDebioSVG
    }
  },
  {
    info: 'dock-testnet',
    providers: {
      // 'Dock Association': 'wss://knox-1.dock.io' // https://github.com/polkadot-js/apps/issues/6831
    },
    text: 'Dock',
    ui: {
      logo: nodesDockPNG
    }
  },
  {
    info: 'dolphin',
    providers: {
      // 'Dolphin Testnet': 'wss://trillian.dolphin.red' // https://github.com/polkadot-js/apps/issues/7439
    },
    text: 'Dolphin Testnet',
    ui: {
      color: '#000000',
      logo: nodesDolphinSVG
    }
  },
  {
    info: 'dotmog',
    providers: {
      // DOTMog: 'wss://mogiway-01.dotmog.com' // https://github.com/polkadot-js/apps/issues/8895
    },
    text: 'DOTMog',
    ui: {
      color: '#020609',
      logo: nodesDotmogSVG
    }
  },
  {
    info: 'encointer',
    providers: {
      // 'Encointer Association': 'wss://gesell.encointer.org' // https://github.com/polkadot-js/apps/issues/11186
    },
    text: 'Encointer Gesell',
    ui: {
      color: '#0000cc',
      logo: nodesEncointerBlueSVG
    }
  },
  {
    info: 'equilibrium',
    providers: {
      // Equilibrium: 'wss://testnet.equilibrium.io' // https://github.com/polkadot-js/apps/issues/6250
    },
    text: 'Equilibrium',
    ui: {
      color: '#1792ff',
      logo: chainsEquilibriumSVG
    }
  },
  {
    info: 'fantour',
    providers: {
      // FantourDev: 'wss://test-ws.fantour.io' // https://github.com/polkadot-js/apps/issues/6519
    },
    text: 'Fantour',
    ui: {
      color: '#5a189a',
      logo: nodesFantourPNG
    }
  },
  {
    info: 'ferrum',
    providers: {
      // FerrumNetwork: 'wss://testnet.dev.svcs.ferrumnetwork.io' // https://github.com/polkadot-js/apps/issues/9748
    },
    text: 'Ferrum Testnet',
    ui: {
      color: '#b37700',
      logo: chainsFerrumPNG
    }
  },
  {
    info: 'substrate',
    providers: {
      // Parity: 'wss://substrate-rpc.parity.io' // https://github.com/polkadot-js/apps/issues/5571
    },
    text: 'Flaming Fir',
    ui: {
      logo: nodesSubstrateHexagonSVG
    }
  },
  {
    info: 'fragnova',
    providers: {
      // 'Fragnova Network': 'wss://ws-test.fragnova.network' // https://github.com/polkadot-js/apps/issues/9490
    },
    text: 'Fragnova Testnet',
    ui: {
      color: '#6b35a8',
      logo: chainsFragnovaPNG
    }
  },
  {
    info: 'Galital',
    providers: {
      // StarkleyTech: 'wss://galital-rpc-testnet.starkleytech.com' // https://github.com/polkadot-js/apps/issues/6721
    },
    text: 'Galital PC2',
    ui: {
      color: '#00063F',
      logo: nodesGalitalLogoPNG
    }
  },
  {
    info: 'galois',
    providers: {
      // MathWallet: 'wss://galois-hk.maiziqianbao.net/ws', // https://github.com/polkadot-js/apps/issues/9059
      // 'MathWallet Backup': 'wss://galois.maiziqianbao.net/ws' // https://github.com/polkadot-js/apps/issues/9109
    },
    text: 'Galois',
    ui: {
      color: '#000000',
      logo: nodesMathSVG
    }
  },
  {
    info: 'gamepower',
    providers: {
      // GamePower: 'wss://gamepower.io' // https://github.com/polkadot-js/apps/issues/7223
    },
    text: 'GamePower',
    ui: {
      color: '#5d21a5',
      logo: nodesGamepowerSVG
    }
  },
  {
    info: 'geek',
    providers: {
      // 'Geek Team': 'wss://testnet.geekcash.org' // https://github.com/polkadot-js/apps/issues/8361
    },
    text: 'GeekCash',
    ui: {
      color: '#4f46e5',
      logo: nodesGeekSVG
    }
  },
  {
    info: 'halongbay',
    providers: {
      // Halongbay: 'wss://halongbay.polkafoundry.com' // https://github.com/polkadot-js/apps/issues/6871
    },
    text: 'Halongbay Testnet',
    ui: {
      color: '#ff527c',
      logo: nodesPolkafoundrySVG
    }
  },
  {
    info: 'interlay-testnet',
    providers: {
      // Interlay: 'wss://api-testnet.interlay.io/parachain/' https://github.com/polkadot-js/apps/issues/11157
    },
    text: 'Interlay Testnet',
    ui: {
      logo: nodesInterlaySVG
    }
  },
  {
    info: 'brainstorm',
    providers: {
      // 'InvArch Team': 'wss://brainstorm.invarch.network/' // https://github.com/polkadot-js/apps/issues/8020
    },
    text: 'InvArch Brainstorm Testnet',
    ui: {
      color: '#161616',
      logo: chainsBrainstormPNG
    }
  },
  {
    info: 'ipse',
    isDisabled: true, // https://github.com/polkadot-js/apps/issues/6242
    providers: {
      'IPSE China': 'wss://testnet-china.ipse.io',
      'IPSE Europe': 'wss://testnet-europe.ipse.io',
      'IPSE USA': 'wss://testnet-usa.ipse.io'
    },
    text: 'IPSE',
    ui: {
      color: '#08a1e8',
      logo: nodesIpsePNG
    }
  },
  {
    info: 'jupiter',
    providers: {
      // Patract: 'wss://ws.jupiter-poa.patract.cn' // https://github.com/polkadot-js/apps/issues/7765
    },
    text: 'Jupiter',
    ui: {
      color: '#7143ff',
      logo: nodesJupiterSVG
    }
  },
  {
    info: 'jur',
    providers: {
      // Jur: 'wss://testnet.jur.io' // https://github.com/polkadot-js/apps/issues/11186
    },
    text: 'Jur Testnet',
    ui: {
      color: '#203050',
      logo: chainsJurPNG
    }
  },
  {
    info: 'karmachain',
    providers: {
      // Karmachain: 'wss://api3.karmaco.in' // https://github.com/polkadot-js/apps/issues/10091
    },
    text: 'Karmachain Testnet',
    ui: {
      color: '#44259D',
      logo: nodesKarmachainSVG
    }
  },
  {
    info: 'khala',
    providers: {
      // 'Phala Network': 'wss://pc-test-3.phala.network/khala/ws' // https://github.com/polkadot-js/apps/issues/6930
    },
    text: 'Khala (Para 3)',
    ui: {
      color: '#03f3f3',
      logo: nodesKhalaSVG
    }
  },
  {
    info: 'kintsugi-testnet',
    providers: {
      // Interlay: 'wss://api-dev-kintsugi.interlay.io/parachain' // https://github.com/polkadot-js/apps/issues/11620
    },
    text: 'Kintsugi Testnet',
    ui: {
      color: '#1a0a2d',
      logo: chainsKintsugiPNG
    }
  },
  {
    info: 'klugdossier',
    providers: {
      // 'Klug Dossier': 'wss://klugdossier.net/' // https://github.com/polkadot-js/apps/issues/8081
    },
    text: 'Klug Dossier',
    ui: {
      color: '#663399',
      logo: nodesKlugPNG
    }
  },
  {
    info: 'kylin',
    providers: {
      // 'Kylin Network': 'wss://testnet.kylin-node.co.uk' // https://github.com/polkadot-js/apps/issues/6635
    },
    text: 'Kylin Testnet',
    ui: {
      logo: nodesKylinPNG
    }
  },
  {
    info: 'Liberland',
    providers: {
      'Liberland Government': 'wss://testchain.liberland.org'
    },
    text: 'Liberland testnet',
    ui: {
      color: 'rgb(231, 196, 36)',
      logo: chainsLiberlandPNG
    }
  },
  {
    info: 'logion',
    providers: {
      Logion: 'wss://test-para-rpc01.logion.network'
    },
    text: 'Logion Testnet',
    ui: {
      color: 'rgb(21, 38, 101)',
      logo: chainsLogionPNG
    }
  },
  {
    info: 'acala',
    providers: {
      // Acala: 'wss://mandala.polkawallet.io' // https://github.com/polkadot-js/apps/issues/9005
      // OnFinality: 'wss://acala-mandala.api.onfinality.io/public-ws' // https://github.com/polkadot-js/apps/issues/8105
    },
    text: 'Mandala',
    ui: {
      logo: chainsAcalaSVG
    }
  },
  {
    info: 'manta',
    providers: {
      // 'Manta Testnet': 'wss://ws.f1.testnet.manta.network' // https://github.com/polkadot-js/apps/issues/6384
    },
    text: 'Manta Testnet',
    ui: {
      color: '#2070a6',
      logo: nodesMantaPNG
    }
  },
  {
    info: 'melodie',
    providers: {
      'Allfeat labs': 'wss://melodie-rpc.allfeat.io'
    },
    text: 'Melodie | Allfeat Testnet',
    ui: {
      color: '#ff4a5f',
      logo: chainsAllfeatSVG
    }
  },
  {
    info: 'minix',
    providers: {
      // Chainx: 'wss://minichain.coming.chat/ws' // https://github.com/polkadot-js/apps/issues/8132
    },
    text: 'MiniX Testnet',
    ui: {
      color: '#5152f7',
      logo: nodesMinixPNG
    }
  },
  {
    info: 'moonbaseAlpha',
    providers: {
      // Blast: 'wss://moonbase-alpha.public.blastapi.io', // https://github.com/polkadot-js/apps/issues/11608
      Dwellir: 'wss://moonbase-rpc.n.dwellir.com',
      'Moonbeam Foundation': 'wss://wss.api.moonbase.moonbeam.network',
      OnFinality: 'wss://moonbeam-alpha.api.onfinality.io/public-ws',
      RadiumBlock: 'wss://moonbase.public.curie.radiumblock.co/ws',
      UnitedBloc: 'wss://moonbase.unitedbloc.com'
    },
    text: 'Moonbase Alpha',
    ui: {
      color: '#2B1D3C',
      logo: nodesMoonbaseAlphaSVG
    }
  },
  {
    info: 'mybank',
    providers: {
      // MYBANK: 'wss://mybank.network/substrate' // https://github.com/polkadot-js/apps/issues/5845
    },
    text: 'mybank.network',
    ui: {
      color: '#282736',
      logo: nodesMybankPNG
    }
  },
  {
    info: 'myriad-tesnet',
    providers: {
      // Myriad: 'wss://ws-rpc.testnet.myriad.social', // https://github.com/polkadot-js/apps/issues/10172
      // Octopus: 'wss://gateway.testnet.octopus.network/myriad/8f543a1c219f14d83c0faedefdd5be6e' // https://github.com/polkadot-js/apps/issues/10667
    },
    text: 'Myriad Testnet',
    ui: {
      color: '#7342CC',
      logo: chainsMyriadPNG
    }
  },
  {
    info: 'nftmart',
    providers: {
      // NFTMartDev: 'wss://dev-ws.nftmart.io', // https://github.com/polkadot-js/apps/issues/9059
      // NFTMartStaging: 'wss://staging-ws.nftmart.io' // https://github.com/polkadot-js/apps/issues/9059
    },
    text: 'NFTMart',
    ui: {
      color: '#307182',
      logo: nodesNftmartPNG
    }
  },
  {
    info: 'opal',
    providers: {
      // 'Geo Load Balancer': 'wss://ws-opal.unique.network', // https://github.com/polkadot-js/apps/issues/11791
      // 'Unique America': 'wss://us-ws-opal.unique.network', // https://github.com/polkadot-js/apps/issues/11791
      // 'Unique Asia': 'wss://asia-ws-opal.unique.network', // https://github.com/polkadot-js/apps/issues/11791
      // 'Unique Europe': 'wss://eu-ws-opal.unique.network' // https://github.com/polkadot-js/apps/issues/11791
    },
    text: 'OPAL by UNIQUE',
    ui: {
      color: '#3B9C9D',
      logo: nodesOpalLogoPNG
    }
  },
  {
    info: 'opportunity',
    providers: {
      // 'Standard Protocol': 'wss://rpc.opportunity.standard.tech' // https://github.com/polkadot-js/apps/issues/7982
    },
    text: 'Opportunity',
    ui: {
      color: '#6143bc',
      logo: nodesOpportunityPNG
    }
  },
  {
    info: 'phala',
    providers: {
      'Phala Network': 'wss://poc6.phala.network/ws'
    },
    text: 'Phala (PoC 6)',
    ui: {
      logo: nodesPhalaSVG
    }
  },
  {
    info: 'phoenix',
    providers: {
      // 'phoenix Protocol': 'wss://phoenix-ws.coinid.pro/' // https://github.com/polkadot-js/apps/issues/6181
    },
    text: 'Phoenix Mashnet',
    ui: {
      color: '#d42181',
      logo: nodesPhoenixPNG
    }
  },
  {
    info: 'Phyken Network',
    providers: {
      // 'Phyken Testnet': 'wss://rpc.testnet.metaquity.xyz' // https://github.com/polkadot-js/apps/issues/10453
    },
    text: 'Phyken Network Testnet',
    ui: {
      color: '#48B96C',
      logo: nodesPhykenNetworkPNG
    }
  },
  {
    info: 'pichiu',
    providers: {
      // 'Kylin Network': 'wss://westend.kylin-node.co.uk' // https://github.com/polkadot-js/apps/pull/6761
    },
    text: 'Pichiu Testnet',
    ui: {
      logo: nodesPichiuPNG
    }
  },
  {
    info: 'polkadex',
    providers: {
      // 'Polkadex Team': 'wss://blockchain.polkadex.trade' // https://github.com/polkadot-js/apps/issues/9150
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
      Polymesh: 'wss://testnet-rpc.polymesh.live'
    },
    text: 'Polymesh Testnet',
    ui: {
      color: '#43195B',
      logo: nodesPolymeshSVG
    }
  },
  {
    info: 'pontem',
    providers: {
      // Pontem: 'wss://testnet.pontem.network/ws', // https://github.com/polkadot-js/apps/issues/7652
    },
    text: 'Pontem',
    ui: {
      color: '#A92FAC',
      logo: nodesPontemSVG
    }
  },
  {
    info: 'prism',
    providers: {
      // Prism: 'wss://testnet.psm.link' // https://github.com/polkadot-js/apps/issues/7340
    },
    text: 'Prism',
    ui: {
      color: 'linear-gradient(45deg, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%)',
      logo: nodesPrismPNG
    }
  },
  {
    info: 'qf-testnet',
    providers: {
      'QF Network': 'wss://test.qfnetwork.xyz'
    },
    text: 'QF Network Testnet',
    ui: {
      color: '#2E2E5C',
      logo: chainsQfNetworkPNG
    }
  },
  {
    info: 'realis',
    providers: {
      // 'Realis.Network': 'wss://rpc.realis.network/' // https://github.com/polkadot-js/apps/issues/7982
    },
    text: 'Realis.Network',
    ui: {
      color: '#000000',
      logo: nodesRealisPNG
    }
  },
  {
    info: 'riochain',
    providers: {
      // 'RioChain Staging': 'wss://node.v1.staging.riochain.io' // https://github.com/polkadot-js/apps/issues/6181
    },
    text: 'RioChain',
    ui: {
      color: '#4d87f6',
      logo: nodesRiochainSVG
    }
  },
  {
    info: 'sherpax',
    providers: {
      // Chainx: 'wss://sherpax-testnet.chainx.org' // https://github.com/polkadot-js/apps/issues/9672
    },
    text: 'Sherpax Testnet',
    ui: {
      color: '#6bbee8',
      logo: nodesSherpaxPNG
    }
  },
  {
    info: 'shibuya',
    isPeople: true,
    providers: {
      Astar: 'wss://rpc.shibuya.astar.network',
      Dwellir: 'wss://shibuya-rpc.n.dwellir.com'
    },
    text: 'Shibuya',
    ui: {
      color: '#1b6dc1d9',
      logo: chainsShidenPNG
    }
  },
  {
    info: 'skyekiwi',
    providers: {
      // SkyeKiwi: 'wss://staging.rpc.skye.kiwi' // https://github.com/polkadot-js/apps/issues/10197
    },
    text: 'SkyeKiwi Testnet',
    ui: {
      color: '#6667ab',
      logo: chainsSkyekiwiPNG
    }
  },
  {
    info: 'sora-substrate',
    providers: {
      'Soramitsu #1': 'wss://ws.framenode-7.s4.stg1.sora2.soramitsu.co.jp',
      'Soramitsu #2': 'wss://ws.framenode-8.s5.stg1.sora2.soramitsu.co.jp'
    },
    text: 'SORA-staging',
    ui: {
      color: '#2D2926',
      logo: nodesSoraSubstrateSVG
    }
  },
  {
    info: 'subdao',
    providers: {
      // SubDAO: 'wss://alpha.subdao.org' // https://github.com/polkadot-js/apps/issues/7473
    },
    text: 'SubDAO Staging',
    ui: {
      color: 'linear-gradient(50deg, #F20092 0%, #FF4D5D 100%)',
      logo: nodesSubdaoPNG
    }
  },
  {
    info: 'subgame',
    providers: {
      // SubGame: 'wss://staging.subgame.org' // https://github.com/polkadot-js/apps/issues/7982
    },
    text: 'SubGame Staging',
    ui: {
      color: '#EB027D',
      logo: nodesSubgameSVG
    }
  },
  {
    info: 'subspace-farmnet',
    providers: {
      // 'Subspace Network': 'wss://farm-rpc.subspace.network/ws' // https://github.com/polkadot-js/apps/issues/8135
    },
    text: 'Subspace Farmnet',
    ui: {
      color: '#562b8e',
      logo: nodesSubspacePNG
    }
  },
  {
    info: 'subspace-gemini-1',
    providers: {
      // Europe: 'wss://eu.gemini-1b.subspace.network/ws' // https://github.com/polkadot-js/apps/issues/11393
    },
    text: 'Subspace Gemini 1',
    ui: {
      color: '#562b8e',
      logo: nodesSubspacePNG
    }
  },
  {
    info: 'subspace-gemini-2a',
    providers: {
      // Europe: 'wss://eu-0.gemini-2a.subspace.network/ws' // https://github.com/polkadot-js/apps/issues/11513
    },
    text: 'Subspace Gemini 2a',
    ui: {
      color: '#562b8e',
      logo: nodesSubspacePNG
    }
  },
  {
    info: 'subspace-gemini-3f',
    providers: {
      Europe: 'wss://rpc-1.gemini-3f.subspace.network/ws'
      // US: 'wss://rpc-0.gemini-3f.subspace.network/ws' // https://github.com/polkadot-js/apps/issues/10091
    },
    text: 'Subspace Gemini 3f',
    ui: {
      color: '#562b8e',
      logo: nodesSubspacePNG
    }
  },
  {
    info: 'subspace-gemini-3g',
    providers: {
      // Europe: 'wss://rpc-1.gemini-3g.subspace.network/ws', // https://github.com/polkadot-js/apps/issues/10912
      // US: 'wss://rpc-0.gemini-3g.subspace.network/ws' // https://github.com/polkadot-js/apps/issues/11263
    },
    text: 'Subspace Gemini 3g',
    ui: {
      color: '#562b8e',
      logo: nodesSubspacePNG
    }
  },
  {
    info: 'subspace-gemini-3g-nova',
    providers: {
      // Subspace: 'wss://nova.gemini-3g.subspace.network/ws' https://github.com/polkadot-js/apps/issues/10957
    },
    text: 'Subspace Gemini 3g Nova',
    ui: {
      color: '#562b8e',
      logo: nodesSubspacePNG
    }
  },
  {
    info: 'subspace-gemini-3h',
    providers: {
      // US: 'wss://rpc-0.gemini-3h.subspace.network/ws' // https://github.com/polkadot-js/apps/issues/11423
      // US2: 'wss://rpc-1.gemini-3h.subspace.network/ws' // https://github.com/polkadot-js/apps/issues/11098
    },
    text: 'Subspace Gemini 3h',
    ui: {
      color: '#562b8e',
      logo: nodesSubspacePNG
    }
  },
  {
    info: 'subspace-gemini-3h-nova',
    providers: {
      // EU1: 'wss://nova-0.gemini-3h.subspace.network/ws', // https://github.com/polkadot-js/apps/issues/11098
      // EU2: 'wss://nova-1.gemini-3h.subspace.network/ws' // https://github.com/polkadot-js/apps/issues/11098
    },
    text: 'Subspace Gemini 3h Nova',
    ui: {
      color: '#562b8e',
      logo: nodesSubspacePNG
    }
  },
  {
    info: 'subspace',
    providers: {
      // 'Subspace Network': 'wss://test-rpc.subspace.network' // https://github.com/polkadot-js/apps/issues/8598
    },
    text: 'Subspace Testnet',
    ui: {
      color: '#562b8e',
      logo: nodesSubspacePNG
    }
  },
  {
    info: 'tangle',
    providers: {
      // Webb: 'wss://testnet-rpc.tangle.tools' // https://github.com/polkadot-js/apps/issues/10555
    },
    text: 'Tangle',
    ui: {
      color: '#7578fb',
      logo: chainsTanglePNG
    }
  },
  {
    info: 'ternoa-alphanet',
    providers: {
      // CapsuleCorp: 'wss://alphanet.ternoa.com' // https://github.com/polkadot-js/apps/issues/11406
    },
    text: 'Ternoa Alphanet',
    ui: {
      logo: nodesTernoaSVG
    }
  },
  {
    info: 'ternoa-testnet',
    providers: {
      // CapsuleCorp: 'wss://testnet.ternoa.com/' // https://github.com/polkadot-js/apps/issues/9515
    },
    text: 'Ternoa Testnet',
    ui: {
      color: '#d622ff',
      logo: nodesTernoaSVG
    }
  },
  {
    info: 'bitcountry',
    providers: {
      // 'Metaverse Foundation': 'wss://tewai-rpc.bit.country' // https://github.com/polkadot-js/apps/issues/9059
    },
    text: 'Tewai',
    ui: {
      logo: nodesBitcountryPNG
    }
  },
  {
    info: 'laminar',
    providers: {
      // Laminar: 'wss://testnet-node-1.laminar-chain.laminar.one/ws' // https://github.com/polkadot-js/apps/issues/8060
    },
    text: 'Turbulence',
    ui: {
      color: '#004FFF',
      logo: nodesLaminarCircleSVG
    }
  },
  {
    info: 'uniarts',
    providers: {
      // UniArts: 'wss://testnet.uniarts.network' // https://github.com/polkadot-js/apps/issues/8541
    },
    text: 'UniArts',
    ui: {
      logo: nodesUniartsPNG
    }
  },
  {
    info: 'unique',
    providers: {
      // Unique: 'wss://testnet2.unique.network' // https://github.com/polkadot-js/apps/issues/7621
    },
    text: 'Unique',
    ui: {
      color: '#40BCFF',
      logo: nodesUniqueSVG
    }
  },
  {
    info: 'unitv',
    providers: {
      // 'Unit Network': 'wss://unitventures.io/' // https://github.com/polkadot-js/apps/issues/5684
    },
    text: 'Unit Network',
    ui: {
      color: '#1452F0',
      logo: nodesUnitnetworkPNG
    }
  },
  {
    info: 'vara-testnet',
    providers: {
      Gear: 'wss://testnet.vara.network'
    },
    text: 'Vara Testnet',
    ui: {
      color: '#202022',
      logo: chainsVaraTestnetPNG
    }
  },
  {
    info: 'vodka',
    providers: {
      // Vodka: 'wss://vodka.rpc.neatcoin.org/ws' // https://github.com/polkadot-js/apps/issues/8175
    },
    text: 'Vodka',
    ui: {}
  },
  {
    info: 'web3games',
    providers: {
      // 'Web3Games Foundation': 'wss://devnet.web3games.org' // https://github.com/polkadot-js/apps/issues/9947
    },
    text: 'Web3Games',
    ui: {
      color: '#000000',
      logo: nodesWeb3gamesSVG
    }
  },
  {
    info: 'xsocial',
    providers: {
      // DappForce: 'wss://xsocial.subsocial.network' // https://github.com/polkadot-js/apps/issues/10555
    },
    text: 'xSocial',
    ui: {
      logo: nodesSoonsocialPNG
    }
  },
  {
    info: 'zCloak',
    providers: {
      // 'zCloak Network': 'wss://test1.zcloak.network' // https://github.com/polkadot-js/apps/issues/7408
    },
    text: 'zCloak-network',
    ui: {
      color: 'linear-gradient(to right, #E89A76 0%, #C5B8CC 50%, #B0B4D7 100%)',
      logo: nodesZCloakSVG
    }
  },
  {
    homepage: 'https://zero.io',
    info: 'ZERO Alphaville',
    providers: {
      // GameDAO: 'wss://rpc.dev.gamedao.net' https://github.com/polkadot-js/apps/issues/11026
    },
    text: 'ZERO Alphaville',
    ui: {
      color: '#00ffcc',
      logo: nodesZeroSVG
    }
  },
  {
    genesisHash: ZKVERIFY_VOLTA_GENESIS,
    info: 'zkVerify-testnet',
    isRelay: true,
    linked: [
      ...testZkVerifyParas
    ],
    providers: {
      zkVerify: 'wss://zkverify-volta-rpc.zkverify.io'
    },
    text: 'zkVerify Volta Testnet',
    ui: {
      color: '#15AA6A',
      logo: nodesZkVerifyPNG
    }
  }
];
