// Copyright 2017-2023 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { EndpointOption } from './types';

import { nodesAjunaPNG, nodesZeitgeistPNG } from '../ui/logos/nodes';

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
    uiColor: '#323232'
  },
  {
    info: 'ajuna',
    providers: {
      'Ajuna Network': 'wss://rpc-test.ajuna.network'
    },
    text: 'Ajuna Testnet',
    uiColor: '#161212',
    uiLogo: nodesAjunaPNG
  },
  {
    info: 'aleph',
    providers: {
      'Aleph Zero Foundation': 'wss://ws.test.azero.dev',
      Dwellir: 'wss://aleph-zero-testnet-rpc.dwellir.com'
    },
    text: 'Aleph Zero Testnet',
    uiColor: '#00CCAB'
  },
  {
    info: 'nodle',
    providers: {
      // Nodle: 'wss://arcadia1.nodleprotocol.io' // https://github.com/polkadot-js/apps/issues/7652
    },
    text: 'Arcadia',
    uiColor: '#1ab394'
  },
  {
    info: 'arctic',
    providers: {
      Arctic: 'wss://arctic-rpc.icenetwork.io:9944'
    },
    text: 'Arctic'
  },
  {
    info: 'Ares Gladios',
    providers: {
      'Ares Protocol': 'wss://gladios.aresprotocol.io'
    },
    text: 'Ares Gladios',
    uiColor: '#1295F0'
  },
  {
    info: 'jaz',
    providers: {
      Jaz: 'wss://ws0.jaz.network'
    },
    text: 'Artio Testnet',
    uiColor: '#121212'
  },
  {
    info: 'automata-contextfree',
    providers: {
      'Automata Network': 'wss://cf-api.ata.network',
      OnFinality: 'wss://contextfree.api.onfinality.io/public-ws'
    },
    text: 'Automata ContextFree',
    uiColor: '#EC7032'
  },
  {
    info: 'edgeware',
    providers: {
      JelliedOwl: 'wss://beresheet.jelliedowl.net'
    },
    text: 'Beresheet'
  },
  {
    info: 'bifrost',
    providers: {
      // Liebi: 'wss://bifrost-rpc.testnet.liebi.com/ws' // https://github.com/polkadot-js/apps/issues/8139
    },
    text: 'Bifrost Stage Network'
  },
  {
    info: 'bitcountry',
    providers: {
      'Metaverse Foundation': 'wss://tewai-rpc.bit.country'
    },
    text: 'Bit.Country - Metaverse Network'
  },
  {
    info: 'cess-testnet',
    providers: {
      CESS: 'wss://testnet-rpc0.cess.cloud/ws/'
    },
    text: 'CESS Testnet',
    uiColor: '#2269a9'
  },
  {
    info: 'clover',
    providers: {
      // Clover: 'wss://api.clover.finance/' // Cannot construct unknown type BridgeNetworks
    },
    text: 'Clover',
    uiColor: 'linear-gradient(to right, #52ad75, #7cc773)'
  },
  {
    info: 'creditcoin-testnet',
    providers: {
      'Creditcoin Foundation': 'wss://rpc.testnet.creditcoin.network/ws'
    },
    text: 'Creditcoin Testnet',
    uiColor: '#00DF83'
  },
  {
    info: 'Crust Maxwell',
    providers: {
      // 'Crust Network': 'wss://api.crust.network/', // https://github.com/polkadot-js/apps/issues/8060
      // 'DCloud Foundation': 'wss://api.decloudf.com/' // https://github.com/polkadot-js/apps/issues/8060
      // Pinknode: 'wss://rpc.pinknode.io/maxwell/explorer' // https://github.com/polkadot-js/apps/issues/7058
    },
    text: 'Crust Maxwell',
    uiColor: '#2E333B'
  },
  {
    info: 'datahighway',
    isDisabled: true,
    providers: {
      MXC: 'wss://spreehafen.datahighway.com'
    },
    text: 'Spreehafen'
  },
  {
    info: 'debio-testnet',
    providers: {
      DeBio: 'wss://ws-rpc.testnet.debio.network'
    },
    text: 'DeBio Testnet',
    uiColor: '#FF56E0'
  },
  {
    info: 'dock-testnet',
    providers: {
      // 'Dock Association': 'wss://knox-1.dock.io' // https://github.com/polkadot-js/apps/issues/6831
    },
    text: 'Dock'
  },
  {
    info: 'dolphin',
    providers: {
      // 'Dolphin Testnet': 'wss://trillian.dolphin.red' // https://github.com/polkadot-js/apps/issues/7439
    },
    text: 'Dolphin Testnet',
    uiColor: '#000000'
  },
  {
    info: 'dotmog',
    providers: {
      // DOTMog: 'wss://mogiway-01.dotmog.com' // https://github.com/polkadot-js/apps/issues/8895
    },
    text: 'DOTMog',
    uiColor: '#020609'
  },
  {
    info: 'encointer',
    providers: {
      'Encointer Association': 'wss://gesell.encointer.org'
    },
    text: 'Encointer Gesell',
    uiColor: '#0000cc'
  },
  {
    info: 'equilibrium',
    providers: {
      // Equilibrium: 'wss://testnet.equilibrium.io' // https://github.com/polkadot-js/apps/issues/6250
    },
    text: 'Equilibrium',
    uiColor: '#1792ff'
  },
  {
    info: 'fantour',
    providers: {
      // FantourDev: 'wss://test-ws.fantour.io' // https://github.com/polkadot-js/apps/issues/6519
    },
    text: 'Fantour',
    uiColor: '#5a189a'
  },
  {
    info: 'ferrum',
    providers: {
      Ferrum: 'wss://testnet.dev.svcs.ferrumnetwork.io'
    },
    text: 'Ferrum Testnet',
    uiColor: '#b37700'
  },
  {
    info: 'substrate',
    providers: {
      // Parity: 'wss://substrate-rpc.parity.io' // https://github.com/polkadot-js/apps/issues/5571
    },
    text: 'Flaming Fir'
  },
  {
    info: 'Galital',
    providers: {
      // StarkleyTech: 'wss://galital-rpc-testnet.starkleytech.com' // https://github.com/polkadot-js/apps/issues/6721
    },
    text: 'Galital PC2',
    uiColor: '#00063F'
  },
  {
    info: 'galois',
    providers: {
      MathWallet: 'wss://galois-hk.maiziqianbao.net/ws',
      'MathWallet Backup': 'wss://galois.maiziqianbao.net/ws'
    },
    text: 'Galois',
    uiColor: '#000000'
  },
  {
    info: 'gamepower',
    providers: {
      // GamePower: 'wss://gamepower.io' // https://github.com/polkadot-js/apps/issues/7223
    },
    text: 'GamePower',
    uiColor: '#5d21a5'
  },
  {
    info: 'geek',
    providers: {
      // 'Geek Team': 'wss://testnet.geekcash.org' // https://github.com/polkadot-js/apps/issues/8361
    },
    text: 'GeekCash',
    uiColor: '#4f46e5'
  },
  {
    info: 'halongbay',
    providers: {
      // Halongbay: 'wss://halongbay.polkafoundry.com' // https://github.com/polkadot-js/apps/issues/6871
    },
    text: 'Halongbay Testnet',
    uiColor: '#ff527c'
  },
  {
    info: 'interlay-testnet',
    providers: {
      Interlay: 'wss://api-testnet.interlay.io/parachain/'
    },
    text: 'Interlay Testnet'
  },
  {
    info: 'brainstorm',
    providers: {
      // 'InvArch Team': 'wss://brainstorm.invarch.network/' // https://github.com/polkadot-js/apps/issues/8020
    },
    text: 'InvArch Brainstorm Testnet',
    uiColor: '#161616'
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
    uiColor: '#08a1e8'
  },
  {
    info: 'jupiter',
    providers: {
      // Patract: 'wss://ws.jupiter-poa.patract.cn' // https://github.com/polkadot-js/apps/issues/7765
    },
    text: 'Jupiter',
    uiColor: '#7143ff'
  },
  {
    info: 'khala',
    providers: {
      // 'Phala Network': 'wss://pc-test-3.phala.network/khala/ws' // https://github.com/polkadot-js/apps/issues/6930
    },
    text: 'Khala (Para 3)',
    uiColor: '#03f3f3'
  },
  {
    info: 'kilt',
    providers: {
      'KILT Protocol': 'wss://full-nodes.kilt.io:9944/'
    },
    text: 'KILT Mashnet'
  },
  {
    info: 'kilt',
    providers: {
      'KILT Protocol': 'wss://peregrine.kilt.io/parachain-public-ws/'
    },
    text: 'KILT Peregrine',
    uiColor: 'linear-gradient(45deg, #f05a27 0%, #8c145a 100%)'
  },
  {
    info: 'kintsugi-testnet',
    providers: {
      Interlay: 'wss://api-dev-kintsugi.interlay.io/parachain'
    },
    text: 'Kintsugi Testnet',
    uiColor: '#1a0a2d'
  },
  {
    info: 'klugdossier',
    providers: {
      // 'Klug Dossier': 'wss://klugdossier.net/' // https://github.com/polkadot-js/apps/issues/8081
    },
    text: 'Klug Dossier',
    uiColor: '#663399'
  },
  {
    info: 'kylin',
    providers: {
      // 'Kylin Network': 'wss://testnet.kylin-node.co.uk' // https://github.com/polkadot-js/apps/issues/6635
    },
    text: 'Kylin Testnet'
  },
  {
    info: 'litentry',
    providers: {
      Litentry: 'wss://testnet.litentry.io'
    },
    text: 'Litentry Testnet',
    uiColor: 'linear-gradient(45deg, #5cc27c 0%, #6de98f 100%)'
  },
  {
    info: 'logion',
    providers: {
      Logion: 'wss://chimay.logion.network'
    },
    text: 'logion Para Testnet',
    uiColor: 'rgb(21, 38, 101)'
  },
  {
    info: 'logion',
    providers: {
      Logion: 'wss://test-rpc01.logion.network'
    },
    text: 'logion Standalone Testnet',
    uiColor: 'rgb(21, 38, 101)'
  },
  {
    info: 'acala',
    providers: {
      Acala: 'wss://mandala.polkawallet.io'
      // OnFinality: 'wss://acala-mandala.api.onfinality.io/public-ws' // https://github.com/polkadot-js/apps/issues/8105
    },
    text: 'Mandala'
  },
  {
    info: 'manta',
    providers: {
      // 'Manta Testnet': 'wss://ws.f1.testnet.manta.network' // https://github.com/polkadot-js/apps/issues/6384
    },
    text: 'Manta Testnet',
    uiColor: '#2070a6'
  },
  {
    info: 'minix',
    providers: {
      // Chainx: 'wss://minichain.coming.chat/ws' // https://github.com/polkadot-js/apps/issues/8132
    },
    text: 'MiniX Testnet',
    uiColor: '#5152f7'
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
    uiColor: '#F45B5B'
  },
  {
    info: 'mybank',
    providers: {
      // MYBANK: 'wss://mybank.network/substrate' // https://github.com/polkadot-js/apps/issues/5845
    },
    text: 'mybank.network',
    uiColor: '#282736'
  },
  {
    info: 'myriad-tesnet',
    providers: {
      Myriad: 'wss://ws-rpc.testnet.myriad.social'
    },
    text: 'Myriad Testnet',
    uiColor: '#7342CC'
  },
  {
    info: 'nftmart',
    providers: {
      NFTMartDev: 'wss://dev-ws.nftmart.io',
      NFTMartStaging: 'wss://staging-ws.nftmart.io'
    },
    text: 'NFTMart',
    uiColor: '#307182'
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
    uiColor: '#3B9C9D'
  },
  {
    info: 'opportunity',
    providers: {
      // 'Standard Protocol': 'wss://rpc.opportunity.standard.tech' // https://github.com/polkadot-js/apps/issues/7982
    },
    text: 'Opportunity',
    uiColor: '#6143bc'
  },
  {
    info: 'pangolin',
    providers: {
      'Darwinia Network': 'wss://pangolin-rpc.darwinia.network'
    },
    text: 'Pangolin',
    uiColor: '#4B30DD'
  },
  {
    info: 'pangoro',
    providers: {
      'Darwinia Network': 'wss://pangoro-rpc.darwinia.network'
    },
    text: 'Pangoro',
    uiColor: '#4B30DD'
  },
  {
    info: 'phala',
    providers: {
      'Phala Network': 'wss://poc5.phala.network/ws'
    },
    text: 'Phala (PoC 5)'
  },
  {
    info: 'phoenix',
    providers: {
      // 'phoenix Protocol': 'wss://phoenix-ws.coinid.pro/' // https://github.com/polkadot-js/apps/issues/6181
    },
    text: 'Phoenix Mashnet',
    uiColor: '#d42181'
  },
  {
    info: 'pichiu',
    providers: {
      // 'Kylin Network': 'wss://westend.kylin-node.co.uk' // https://github.com/polkadot-js/apps/pull/6761
    },
    text: 'Pichiu Testnet'
  },
  {
    info: 'polkadex',
    providers: {
      'Polkadex Team': 'wss://blockchain.polkadex.trade'
    },
    text: 'Polkadex',
    uiColor: '#7C30DD'
  },
  {
    info: 'polymesh',
    providers: {
      Polymath: 'wss://testnet-rpc.polymesh.live'
    },
    text: 'Polymesh Testnet',
    uiColor: '#1348e4'
  },
  {
    info: 'pontem',
    providers: {
      // Pontem: 'wss://testnet.pontem.network/ws', // https://github.com/polkadot-js/apps/issues/7652
    },
    text: 'Pontem',
    uiColor: '#A92FAC'
  },
  {
    info: 'prism',
    providers: {
      // Prism: 'wss://testnet.psm.link' // https://github.com/polkadot-js/apps/issues/7340
    },
    text: 'Prism',
    uiColor: 'linear-gradient(45deg, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%)'
  },
  {
    info: 'realis',
    providers: {
      // 'Realis.Network': 'wss://rpc.realis.network/' // https://github.com/polkadot-js/apps/issues/7982
    },
    text: 'Realis.Network',
    uiColor: '#000000'
  },
  {
    info: 'riochain',
    providers: {
      // 'RioChain Staging': 'wss://node.v1.staging.riochain.io' // https://github.com/polkadot-js/apps/issues/6181
    },
    text: 'RioChain',
    uiColor: '#4d87f6'
  },
  {
    info: 'sherpax',
    providers: {
      Chainx: 'wss://sherpax-testnet.chainx.org'
    },
    text: 'Sherpax Testnet',
    uiColor: '#6bbee8'
  },
  {
    info: 'shibuya',
    providers: {
      Dwellir: 'wss://shibuya-rpc.dwellir.com',
      StakeTechnologies: 'wss://rpc.shibuya.astar.network'
    },
    text: 'Shibuya',
    uiColor: '#1b6dc1d9'
  },
  {
    info: 'skyekiwi',
    providers: {
      SkyeKiwi: 'wss://staging.rpc.skye.kiwi'
    },
    text: 'SkyeKiwi Testnet',
    uiColor: '#6667ab'
  },
  {
    info: 'soonsocial',
    providers: {
      // DappForce: 'wss://testnet.subsocial.network' // https://github.com/polkadot-js/apps/issues/8315
    },
    text: 'Soonsocial'
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
    uiColor: '#2D2926'
  },
  {
    info: 'subdao',
    providers: {
      // SubDAO: 'wss://alpha.subdao.org' // https://github.com/polkadot-js/apps/issues/7473
    },
    text: 'SubDAO Staging',
    uiColor: 'linear-gradient(50deg, #F20092 0%, #FF4D5D 100%)'
  },
  {
    info: 'subgame',
    providers: {
      // SubGame: 'wss://staging.subgame.org' // https://github.com/polkadot-js/apps/issues/7982
    },
    text: 'SubGame Staging',
    uiColor: '#EB027D'
  },
  {
    info: 'subspace-farmnet',
    providers: {
      // 'Subspace Network': 'wss://farm-rpc.subspace.network/ws' // https://github.com/polkadot-js/apps/issues/8135
    },
    text: 'Subspace Farmnet',
    uiColor: '#562b8e'
  },
  {
    info: 'subspace-gemini-1',
    providers: {
      Europe: 'wss://eu.gemini-1b.subspace.network/ws'
    },
    text: 'Subspace Gemini 1',
    uiColor: '#562b8e'
  },
  {
    info: 'subspace-gemini-2a',
    providers: {
      Europe: 'wss://eu-0.gemini-2a.subspace.network/ws'
    },
    text: 'Subspace Gemini 2a',
    uiColor: '#562b8e'
  },
  {
    info: 'subspace',
    providers: {
      // 'Subspace Network': 'wss://test-rpc.subspace.network' // https://github.com/polkadot-js/apps/issues/8598
    },
    text: 'Subspace Testnet',
    uiColor: '#562b8e'
  },
  {
    info: 'tangle',
    providers: {
      Webb: 'wss://tangle-archive.webb.tools'
    },
    text: 'Tangle Alpha',
    uiColor: '#0099ff'
  },
  {
    info: 'ternoa-alphanet',
    providers: {
      CapsuleCorp: 'wss://alphanet.ternoa.com'
    },
    text: 'Ternoa Alphanet'
  },
  {
    info: 'ternoa-testnet',
    providers: {
      CapsuleCorp: 'wss://testnet.ternoa.com/'
    },
    text: 'Ternoa Testnet',
    uiColor: '#d622ff'
  },
  {
    info: 'thebifrost-testnet',
    providers: {
      'Pilab #1': 'wss://public-01.testnet.thebifrost.io/ws',
      'Pilab #2': 'wss://public-02.testnet.thebifrost.io/ws'
    },
    text: 'The Bifrost Testnet'
  },
  {
    info: 'laminar',
    providers: {
      // Laminar: 'wss://testnet-node-1.laminar-chain.laminar.one/ws' // https://github.com/polkadot-js/apps/issues/8060
    },
    text: 'Turbulence',
    uiColor: '#004FFF'
  },
  {
    info: 'uniarts',
    providers: {
      // UniArts: 'wss://testnet.uniarts.network' // https://github.com/polkadot-js/apps/issues/8541
    },
    text: 'UniArts'
  },
  {
    info: 'unique',
    providers: {
      // Unique: 'wss://testnet2.unique.network' // https://github.com/polkadot-js/apps/issues/7621
    },
    text: 'Unique',
    uiColor: '#40BCFF'
  },
  {
    info: 'unitv',
    providers: {
      // 'Unit Network': 'wss://unitventures.io/' // https://github.com/polkadot-js/apps/issues/5684
    },
    text: 'Unit Network',
    uiColor: '#1452F0'
  },
  {
    info: 'vara',
    providers: {
      'Gear Tech': 'wss://rpc.vara-network.io'
    },
    text: 'Vara',
    uiColor: '#32e37d'
  },
  {
    info: 'vodka',
    providers: {
      // Vodka: 'wss://vodka.rpc.neatcoin.org/ws' // https://github.com/polkadot-js/apps/issues/8175
    },
    text: 'Vodka'
  },
  {
    info: 'web3games',
    providers: {
      'Web3Games Foundation': 'wss://devnet.web3games.org'
    },
    text: 'Web3Games',
    uiColor: '#000000'
  },
  {
    info: 'zCloak',
    providers: {
      // 'zCloak Network': 'wss://test1.zcloak.network' // https://github.com/polkadot-js/apps/issues/7408
    },
    text: 'zCloak-network',
    uiColor: 'linear-gradient(to right, #E89A76 0%, #C5B8CC 50%, #B0B4D7 100%)'
  },
  {
    info: 'zeitgeist',
    providers: {
      Zeitgeist: 'wss://bsr.zeitgeist.pm'
    },
    text: 'Zeitgeist Battery Station',
    uiColor: 'linear-gradient(180deg, rgba(32,90,172,1) 0%, rgba(26,72,138,1) 50%, rgba(13,36,69,1) 100%)',
    uiLogo: nodesZeitgeistPNG
  },
  {
    info: 'zero',
    providers: {
      // ZERO: 'wss://alphaville.zero.io' // https://github.com/polkadot-js/apps/issues/8263
    },
    text: 'Zero Alphaville',
    uiColor: '#000000'
  }
];
