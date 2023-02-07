// Copyright 2017-2023 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { EndpointOption } from './types';

import { chains3dpassPNG, chainsAcalaSVG, chainsAlephSVG, chainsBrainstormPNG, chainsCreditcoinTestPNG, chainsDebioSVG, chainsEquilibriumSVG, chainsFerrumPNG, chainsKintsugiPNG, chainsLogionPNG, chainsMyriadPNG, chainsShidenPNG, chainsSkyekiwiPNG, chainsTanglePNG, chainsVaraSVG } from '../ui/logos/chains';
import { nodesAjunaPNG, nodesArcticPNG, nodesAresGladiosSVG, nodesAutomataPNG, nodesBifrostSVG, nodesBitcountryPNG, nodesCessPNG, nodesCloverSVG, nodesCrustMaxwellSVG, nodesDatahighwayPNG, nodesDockPNG, nodesDolphinSVG, nodesDotmogSVG, nodesEdgewareWhitePNG, nodesEncointerBlueSVG, nodesFantourPNG, nodesGalitalLogoPNG, nodesGamepowerSVG, nodesGeekSVG, nodesInterlaySVG, nodesIpsePNG, nodesJazPNG, nodesJupiterSVG, nodesKhalaSVG, nodesKiltPNG, nodesKlugPNG, nodesKylinPNG, nodesLaminarCircleSVG, nodesLitentryPNG, nodesMantaPNG, nodesMathSVG, nodesMinixPNG, nodesMoonbaseAlphaPNG, nodesMybankPNG, nodesNftmartPNG, nodesNodleSVG, nodesOpalLogoPNG, nodesOpportunityPNG, nodesPangolinSVG, nodesPangoroSVG, nodesPhalaSVG, nodesPhoenixPNG, nodesPichiuPNG, nodesPolkadexSVG, nodesPolkafoundrySVG, nodesPolymeshSVG, nodesPontemSVG, nodesPrismPNG, nodesRealisPNG, nodesRiochainSVG, nodesSherpaxPNG, nodesSoonsocialPNG, nodesSoraSubstrateSVG, nodesSubdaoPNG, nodesSubgameSVG, nodesSubspacePNG, nodesTernoaSVG, nodesUniartsPNG, nodesUniqueSVG, nodesUnitnetworkPNG, nodesWeb3gamesSVG, nodesZCloakSVG, nodesZeitgeistPNG } from '../ui/logos/nodes';

export * from './testingRelayRococo';
export * from './testingRelayWestend';

// The available endpoints that will show in the dropdown. For the most part (with the exception of
// Polkadot) we try to keep this to live chains only, with RPCs hosted by the community/chain vendor
//   info: The chain logo name as defined in ../ui/logos/index.ts in namedLogos (this also needs to align with @polkadot/networks)
//   text: The text to display on the dropdown
//   providers: The actual hosted secure websocket endpoint
//
// IMPORTANT: Alphabetical based on text
export const testChains: EndpointOption[] = [
  {
    info: '3dpass-testnet',
    providers: {
      '3dpass': 'wss://test-rpc.3dpass.org'
    },
    text: '3DPass Testnet',
    ui: {
      color: '#323232',
      logo: chains3dpassPNG
    }
  },
  {
    info: 'ajuna',
    providers: {
      'Ajuna Network': 'wss://rpc-test.ajuna.network'
    },
    text: 'Ajuna Testnet',
    ui: {
      color: '#161212',
      logo: nodesAjunaPNG
    }
  },
  {
    info: 'aleph',
    providers: {
      'Aleph Zero Foundation': 'wss://ws.test.azero.dev',
      Dwellir: 'wss://aleph-zero-testnet-rpc.dwellir.com'
    },
    text: 'Aleph Zero Testnet',
    ui: {
      color: '#00CCAB',
      logo: chainsAlephSVG
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
      Arctic: 'wss://arctic-rpc.icenetwork.io:9944'
    },
    text: 'Arctic',
    ui: {
      logo: nodesArcticPNG
    }
  },
  {
    info: 'Ares Gladios',
    providers: {
      'Ares Protocol': 'wss://gladios.aresprotocol.io'
    },
    text: 'Ares Gladios',
    ui: {
      color: '#1295F0',
      logo: nodesAresGladiosSVG
    }
  },
  {
    info: 'jaz',
    providers: {
      Jaz: 'wss://ws0.jaz.network'
    },
    text: 'Artio Testnet',
    ui: {
      color: '#121212',
      logo: nodesJazPNG
    }
  },
  {
    info: 'automata-contextfree',
    providers: {
      'Automata Network': 'wss://cf-api.ata.network',
      OnFinality: 'wss://contextfree.api.onfinality.io/public-ws'
    },
    text: 'Automata ContextFree',
    ui: {
      color: '#EC7032',
      logo: nodesAutomataPNG
    }
  },
  {
    info: 'edgeware',
    providers: {
      JelliedOwl: 'wss://beresheet.jelliedowl.net'
    },
    text: 'Beresheet',
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
    info: 'bitcountry',
    providers: {
      'Metaverse Foundation': 'wss://tewai-rpc.bit.country'
    },
    text: 'Bit.Country - Metaverse Network',
    ui: {
      logo: nodesBitcountryPNG
    }
  },
  {
    info: 'cess-testnet',
    providers: {
      CESS: 'wss://testnet-rpc0.cess.cloud/ws/'
    },
    text: 'CESS Testnet',
    ui: {
      color: '#2269a9',
      logo: nodesCessPNG
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
      'Creditcoin Foundation': 'wss://rpc.testnet.creditcoin.network/ws'
    },
    text: 'Creditcoin Testnet',
    ui: {
      color: '#00DF83',
      logo: chainsCreditcoinTestPNG
    }
  },
  {
    info: 'Crust Maxwell',
    providers: {
      // 'Crust Network': 'wss://api.crust.network/', // https://github.com/polkadot-js/apps/issues/8060
      // 'DCloud Foundation': 'wss://api.decloudf.com/' // https://github.com/polkadot-js/apps/issues/8060
      // Pinknode: 'wss://rpc.pinknode.io/maxwell/explorer' // https://github.com/polkadot-js/apps/issues/7058
    },
    text: 'Crust Maxwell',
    ui: {
      color: '#2E333B',
      logo: nodesCrustMaxwellSVG
    }
  },
  {
    info: 'datahighway',
    isDisabled: true,
    providers: {
      MXC: 'wss://spreehafen.datahighway.com'
    },
    text: 'Spreehafen',
    ui: {
      logo: nodesDatahighwayPNG
    }
  },
  {
    info: 'debio-testnet',
    providers: {
      DeBio: 'wss://ws-rpc.testnet.debio.network'
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
      'Encointer Association': 'wss://gesell.encointer.org'
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
      Ferrum: 'wss://testnet.dev.svcs.ferrumnetwork.io'
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
    ui: {}
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
      MathWallet: 'wss://galois-hk.maiziqianbao.net/ws',
      'MathWallet Backup': 'wss://galois.maiziqianbao.net/ws'
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
      Interlay: 'wss://api-testnet.interlay.io/parachain/'
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
    info: 'kilt',
    providers: {
      'KILT Protocol': 'wss://full-nodes.kilt.io:9944/'
    },
    text: 'KILT Mashnet',
    ui: {
      logo: nodesKiltPNG
    }
  },
  {
    info: 'kilt',
    providers: {
      'KILT Protocol': 'wss://peregrine.kilt.io/parachain-public-ws/'
    },
    text: 'KILT Peregrine',
    ui: {
      color: 'linear-gradient(45deg, #f05a27 0%, #8c145a 100%)',
      logo: nodesKiltPNG
    }
  },
  {
    info: 'kintsugi-testnet',
    providers: {
      Interlay: 'wss://api-dev-kintsugi.interlay.io/parachain'
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
    info: 'litentry',
    providers: {
      Litentry: 'wss://testnet.litentry.io'
    },
    text: 'Litentry Testnet',
    ui: {
      color: 'linear-gradient(45deg, #5cc27c 0%, #6de98f 100%)',
      logo: nodesLitentryPNG
    }
  },
  {
    info: 'logion',
    providers: {
      Logion: 'wss://chimay.logion.network'
    },
    text: 'logion Para Testnet',
    ui: {
      color: 'rgb(21, 38, 101)',
      logo: chainsLogionPNG
    }
  },
  {
    info: 'logion',
    providers: {
      Logion: 'wss://test-rpc01.logion.network'
    },
    text: 'logion Standalone Testnet',
    ui: {
      color: 'rgb(21, 38, 101)',
      logo: chainsLogionPNG
    }
  },
  {
    info: 'acala',
    providers: {
      Acala: 'wss://mandala.polkawallet.io'
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
      Blast: 'wss://moonbase-alpha.public.blastapi.io',
      'Moonbeam Foundation': 'wss://wss.api.moonbase.moonbeam.network',
      OnFinality: 'wss://moonbeam-alpha.api.onfinality.io/public-ws',
      UnitedBloc: 'wss://moonbase.unitedbloc.com:1001'
    },
    text: 'Moonbase Alpha',
    ui: {
      color: '#F45B5B',
      logo: nodesMoonbaseAlphaPNG
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
      Myriad: 'wss://ws-rpc.testnet.myriad.social'
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
      NFTMartDev: 'wss://dev-ws.nftmart.io',
      NFTMartStaging: 'wss://staging-ws.nftmart.io'
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
      Asia: 'wss://asia-ws-opal.unique.network',
      Europe: 'wss://eu-ws-opal.unique.network',
      'Geo Load Balancer': 'wss://ws-opal.unique.network',
      'North America': 'wss://us-ws-opal.unique.network'
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
    info: 'pangolin',
    providers: {
      'Darwinia Network': 'wss://pangolin-rpc.darwinia.network'
    },
    text: 'Pangolin',
    ui: {
      color: '#4B30DD',
      logo: nodesPangolinSVG
    }
  },
  {
    info: 'pangoro',
    providers: {
      'Darwinia Network': 'wss://pangoro-rpc.darwinia.network'
    },
    text: 'Pangoro',
    ui: {
      color: '#4B30DD',
      logo: nodesPangoroSVG
    }
  },
  {
    info: 'phala',
    providers: {
      'Phala Network': 'wss://poc5.phala.network/ws'
    },
    text: 'Phala (PoC 5)',
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
      'Polkadex Team': 'wss://blockchain.polkadex.trade'
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
      Polymath: 'wss://testnet-rpc.polymesh.live'
    },
    text: 'Polymesh Testnet',
    ui: {
      color: '#1348e4',
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
      Chainx: 'wss://sherpax-testnet.chainx.org'
    },
    text: 'Sherpax Testnet',
    ui: {
      color: '#6bbee8',
      logo: nodesSherpaxPNG
    }
  },
  {
    info: 'shibuya',
    providers: {
      Dwellir: 'wss://shibuya-rpc.dwellir.com',
      StakeTechnologies: 'wss://rpc.shibuya.astar.network'
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
      SkyeKiwi: 'wss://staging.rpc.skye.kiwi'
    },
    text: 'SkyeKiwi Testnet',
    ui: {
      color: '#6667ab',
      logo: chainsSkyekiwiPNG
    }
  },
  {
    info: 'soonsocial',
    providers: {
      // DappForce: 'wss://testnet.subsocial.network' // https://github.com/polkadot-js/apps/issues/8315
    },
    text: 'Soonsocial',
    ui: {
      logo: nodesSoonsocialPNG
    }
  },
  {
    info: 'sora-substrate',
    providers: {
      'Soramitsu #1': 'wss://ws.framenode-1.s1.stg1.sora2.soramitsu.co.jp',
      'Soramitsu #2': 'wss://ws.framenode-2.s1.stg1.sora2.soramitsu.co.jp',
      'Soramitsu #3': 'wss://ws.framenode-3.s2.stg1.sora2.soramitsu.co.jp',
      'Soramitsu #4': 'wss://ws.framenode-4.s2.stg1.sora2.soramitsu.co.jp'
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
      Europe: 'wss://eu.gemini-1b.subspace.network/ws'
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
      Europe: 'wss://eu-0.gemini-2a.subspace.network/ws'
    },
    text: 'Subspace Gemini 2a',
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
      Webb: 'wss://tangle-archive.webb.tools'
    },
    text: 'Tangle Alpha',
    ui: {
      color: '#0099ff',
      logo: chainsTanglePNG
    }
  },
  {
    info: 'ternoa-alphanet',
    providers: {
      CapsuleCorp: 'wss://alphanet.ternoa.com'
    },
    text: 'Ternoa Alphanet',
    ui: {
      logo: nodesTernoaSVG
    }
  },
  {
    info: 'ternoa-testnet',
    providers: {
      CapsuleCorp: 'wss://testnet.ternoa.com/'
    },
    text: 'Ternoa Testnet',
    ui: {
      color: '#d622ff',
      logo: nodesTernoaSVG
    }
  },
  {
    info: 'thebifrost-testnet',
    providers: {
      'Pilab #1': 'wss://public-01.testnet.thebifrost.io/ws',
      'Pilab #2': 'wss://public-02.testnet.thebifrost.io/ws'
    },
    text: 'The Bifrost Testnet',
    ui: {
      logo: nodesBifrostSVG
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
    info: 'vara',
    providers: {
      'Gear Tech': 'wss://rpc.vara-network.io'
    },
    text: 'Vara',
    ui: {
      color: '#32e37d',
      logo: chainsVaraSVG
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
      'Web3Games Foundation': 'wss://devnet.web3games.org'
    },
    text: 'Web3Games',
    ui: {
      color: '#000000',
      logo: nodesWeb3gamesSVG
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
    info: 'zeitgeist',
    providers: {
      Zeitgeist: 'wss://bsr.zeitgeist.pm'
    },
    text: 'Zeitgeist Battery Station',
    ui: {
      color: 'linear-gradient(180deg, rgba(32,90,172,1) 0%, rgba(26,72,138,1) 50%, rgba(13,36,69,1) 100%)',
      logo: nodesZeitgeistPNG
    }
  },
  {
    info: 'zero',
    providers: {
      // ZERO: 'wss://alphaville.zero.io' // https://github.com/polkadot-js/apps/issues/8263
    },
    text: 'Zero Alphaville',
    ui: {
      color: '#000000'
    }
  }
];
