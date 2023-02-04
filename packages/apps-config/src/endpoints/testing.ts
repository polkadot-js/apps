// Copyright 2017-2023 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { EndpointOption } from './types';

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
    text: '3DPass Testnet'
  },
  {
    info: 'ajuna',
    providers: {
      'Ajuna Network': 'wss://rpc-test.ajuna.network'
    },
    text: 'Ajuna Testnet'
  },
  {
    info: 'aleph',
    providers: {
      'Aleph Zero Foundation': 'wss://ws.test.azero.dev',
      Dwellir: 'wss://aleph-zero-testnet-rpc.dwellir.com'
    },
    text: 'Aleph Zero Testnet'
  },
  {
    info: 'nodle',
    providers: {
      // Nodle: 'wss://arcadia1.nodleprotocol.io' // https://github.com/polkadot-js/apps/issues/7652
    },
    text: 'Arcadia'
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
    text: 'Ares Gladios'
  },
  {
    info: 'jaz',
    providers: {
      Jaz: 'wss://ws0.jaz.network'
    },
    text: 'Artio Testnet'
  },
  {
    info: 'automata-contextfree',
    providers: {
      'Automata Network': 'wss://cf-api.ata.network',
      OnFinality: 'wss://contextfree.api.onfinality.io/public-ws'
    },
    text: 'Automata ContextFree'
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
    text: 'CESS Testnet'
  },
  {
    info: 'clover',
    providers: {
      // Clover: 'wss://api.clover.finance/' // Cannot construct unknown type BridgeNetworks
    },
    text: 'Clover'
  },
  {
    // this is also a duplicate as a parachain under Polkadot and live under production -
    // it is either/or, not and
    info: 'coinversation',
    isDisabled: true, // https://github.com/polkadot-js/apps/issues/6635
    providers: {
      Coinversation: 'wss://rpc.coinversation.io/'
    },
    text: 'Coinversation'
  },
  {
    info: 'creditcoin-testnet',
    providers: {
      'Creditcoin Foundation': 'wss://rpc.testnet.creditcoin.network/ws'
    },
    text: 'Creditcoin Testnet'
  },
  {
    info: 'Crust Maxwell',
    providers: {
      // 'Crust Network': 'wss://api.crust.network/', // https://github.com/polkadot-js/apps/issues/8060
      // 'DCloud Foundation': 'wss://api.decloudf.com/' // https://github.com/polkadot-js/apps/issues/8060
      // Pinknode: 'wss://rpc.pinknode.io/maxwell/explorer' // https://github.com/polkadot-js/apps/issues/7058
    },
    text: 'Crust Maxwell'
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
    text: 'DeBio Testnet'
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
    text: 'Dolphin Testnet'
  },
  {
    info: 'dotmog',
    providers: {
      // DOTMog: 'wss://mogiway-01.dotmog.com' // https://github.com/polkadot-js/apps/issues/8895
    },
    text: 'DOTMog'
  },
  {
    info: 'encointer',
    providers: {
      'Encointer Association': 'wss://gesell.encointer.org'
    },
    text: 'Encointer Gesell'
  },
  {
    info: 'equilibrium',
    providers: {
      // Equilibrium: 'wss://testnet.equilibrium.io' // https://github.com/polkadot-js/apps/issues/6250
    },
    text: 'Equilibrium'
  },
  {
    info: 'fantour',
    providers: {
      // FantourDev: 'wss://test-ws.fantour.io' // https://github.com/polkadot-js/apps/issues/6519
    },
    text: 'Fantour'
  },
  {
    info: 'ferrum',
    providers: {
      Ferrum: 'wss://testnet.dev.svcs.ferrumnetwork.io'
    },
    text: 'Ferrum Testnet'
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
    text: 'Galital PC2'
  },
  {
    info: 'galois',
    providers: {
      MathWallet: 'wss://galois-hk.maiziqianbao.net/ws',
      'MathWallet Backup': 'wss://galois.maiziqianbao.net/ws'
    },
    text: 'Galois'
  },
  {
    info: 'gamepower',
    providers: {
      // GamePower: 'wss://gamepower.io' // https://github.com/polkadot-js/apps/issues/7223
    },
    text: 'GamePower'
  },
  {
    info: 'geek',
    providers: {
      // 'Geek Team': 'wss://testnet.geekcash.org' // https://github.com/polkadot-js/apps/issues/8361
    },
    text: 'GeekCash'
  },
  {
    info: 'halongbay',
    providers: {
      // Halongbay: 'wss://halongbay.polkafoundry.com' // https://github.com/polkadot-js/apps/issues/6871
    },
    text: 'Halongbay Testnet'
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
    text: 'InvArch Brainstorm Testnet'
  },
  {
    info: 'ipse',
    isDisabled: true, // https://github.com/polkadot-js/apps/issues/6242
    providers: {
      'IPSE China': 'wss://testnet-china.ipse.io',
      'IPSE Europe': 'wss://testnet-europe.ipse.io',
      'IPSE USA': 'wss://testnet-usa.ipse.io'
    },
    text: 'IPSE'
  },
  {
    info: 'jupiter',
    providers: {
      // Patract: 'wss://ws.jupiter-poa.patract.cn' // https://github.com/polkadot-js/apps/issues/7765
    },
    text: 'Jupiter'
  },
  {
    info: 'khala',
    providers: {
      // 'Phala Network': 'wss://pc-test-3.phala.network/khala/ws' // https://github.com/polkadot-js/apps/issues/6930
    },
    text: 'Khala (Para 3)'
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
    text: 'KILT Peregrine'
  },
  {
    info: 'kintsugi-testnet',
    providers: {
      Interlay: 'wss://api-dev-kintsugi.interlay.io/parachain'
    },
    text: 'Kintsugi Testnet'
  },
  {
    info: 'klugdossier',
    providers: {
      // 'Klug Dossier': 'wss://klugdossier.net/' // https://github.com/polkadot-js/apps/issues/8081
    },
    text: 'Klug Dossier'
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
    text: 'Litentry Testnet'
  },
  {
    info: 'logion',
    providers: {
      Logion: 'wss://chimay.logion.network'
    },
    text: 'logion Para Testnet'
  },
  {
    info: 'logion',
    providers: {
      Logion: 'wss://test-rpc01.logion.network'
    },
    text: 'logion Standalone Testnet'
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
    text: 'Manta Testnet'
  },
  {
    info: 'minix',
    providers: {
      // Chainx: 'wss://minichain.coming.chat/ws' // https://github.com/polkadot-js/apps/issues/8132
    },
    text: 'MiniX Testnet'
  },
  {
    info: 'moonbaseAlpha',
    providers: {
      Blast: 'wss://moonbase-alpha.public.blastapi.io',
      'Moonbeam Foundation': 'wss://wss.api.moonbase.moonbeam.network',
      OnFinality: 'wss://moonbeam-alpha.api.onfinality.io/public-ws',
      UnitedBloc: 'wss://moonbase.unitedbloc.com:1001'
    },
    text: 'Moonbase Alpha'
  },
  {
    info: 'mybank',
    providers: {
      // MYBANK: 'wss://mybank.network/substrate' // https://github.com/polkadot-js/apps/issues/5845
    },
    text: 'mybank.network'
  },
  {
    info: 'myriad-tesnet',
    providers: {
      Myriad: 'wss://ws-rpc.testnet.myriad.social'
    },
    text: 'Myriad Testnet'
  },
  {
    info: 'nftmart',
    providers: {
      NFTMartDev: 'wss://dev-ws.nftmart.io',
      NFTMartStaging: 'wss://staging-ws.nftmart.io'
    },
    text: 'NFTMart'
  },
  {
    info: 'opal',
    providers: {
      Asia: 'wss://asia-ws-opal.unique.network',
      Europe: 'wss://eu-ws-opal.unique.network',
      'Geo Load Balancer': 'wss://ws-opal.unique.network',
      'North America': 'wss://us-ws-opal.unique.network'
    },
    text: 'OPAL by UNIQUE'
  },
  {
    info: 'opportunity',
    providers: {
      // 'Standard Protocol': 'wss://rpc.opportunity.standard.tech' // https://github.com/polkadot-js/apps/issues/7982
    },
    text: 'Opportunity'
  },
  {
    info: 'pangolin',
    providers: {
      'Darwinia Network': 'wss://pangolin-rpc.darwinia.network'
    },
    text: 'Pangolin'
  },
  {
    info: 'pangoro',
    providers: {
      'Darwinia Network': 'wss://pangoro-rpc.darwinia.network'
    },
    text: 'Pangoro'
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
    text: 'Phoenix Mashnet'
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
    text: 'Polkadex'
  },
  {
    info: 'polymesh',
    providers: {
      Polymath: 'wss://testnet-rpc.polymesh.live'
    },
    text: 'Polymesh Testnet'
  },
  {
    info: 'pontem',
    providers: {
      // Pontem: 'wss://testnet.pontem.network/ws', // https://github.com/polkadot-js/apps/issues/7652
    },
    text: 'Pontem'
  },
  {
    info: 'prism',
    providers: {
      // Prism: 'wss://testnet.psm.link' // https://github.com/polkadot-js/apps/issues/7340
    },
    text: 'Prism'
  },
  {
    info: 'realis',
    providers: {
      // 'Realis.Network': 'wss://rpc.realis.network/' // https://github.com/polkadot-js/apps/issues/7982
    },
    text: 'Realis.Network'
  },
  {
    info: 'riochain',
    providers: {
      // 'RioChain Staging': 'wss://node.v1.staging.riochain.io' // https://github.com/polkadot-js/apps/issues/6181
    },
    text: 'RioChain'
  },
  {
    info: 'sherpax',
    providers: {
      Chainx: 'wss://sherpax-testnet.chainx.org'
    },
    text: 'Sherpax Testnet'
  },
  {
    info: 'shibuya',
    providers: {
      Dwellir: 'wss://shibuya-rpc.dwellir.com',
      StakeTechnologies: 'wss://rpc.shibuya.astar.network'
    },
    text: 'Shibuya'
  },
  {
    info: 'skyekiwi',
    providers: {
      SkyeKiwi: 'wss://staging.rpc.skye.kiwi'
    },
    text: 'SkyeKiwi Testnet'
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
    text: 'SORA-staging'
  },
  {
    info: 'subdao',
    providers: {
      // SubDAO: 'wss://alpha.subdao.org' // https://github.com/polkadot-js/apps/issues/7473
    },
    text: 'SubDAO Staging'
  },
  {
    info: 'subgame',
    providers: {
      // SubGame: 'wss://staging.subgame.org' // https://github.com/polkadot-js/apps/issues/7982
    },
    text: 'SubGame Staging'
  },
  {
    info: 'subspace-farmnet',
    providers: {
      // 'Subspace Network': 'wss://farm-rpc.subspace.network/ws' // https://github.com/polkadot-js/apps/issues/8135
    },
    text: 'Subspace Farmnet'
  },
  {
    info: 'subspace-gemini-1',
    providers: {
      Europe: 'wss://eu.gemini-1b.subspace.network/ws'
    },
    text: 'Subspace Gemini 1'
  },
  {
    info: 'subspace-gemini-2a',
    providers: {
      Europe: 'wss://eu-0.gemini-2a.subspace.network/ws'
    },
    text: 'Subspace Gemini 2a'
  },
  {
    info: 'subspace',
    providers: {
      // 'Subspace Network': 'wss://test-rpc.subspace.network' // https://github.com/polkadot-js/apps/issues/8598
    },
    text: 'Subspace Testnet'
  },
  {
    info: 'tangle',
    providers: {
      Webb: 'wss://tangle-archive.webb.tools'
    },
    text: 'Tangle Alpha'
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
    text: 'Ternoa Testnet'
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
    text: 'Turbulence'
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
    text: 'Unique'
  },
  {
    info: 'unitv',
    providers: {
      // 'Unit Network': 'wss://unitventures.io/' // https://github.com/polkadot-js/apps/issues/5684
    },
    text: 'Unit Network'
  },
  {
    info: 'vara',
    providers: {
      'Gear Tech': 'wss://rpc.vara-network.io'
    },
    text: 'Vara'
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
    text: 'Web3Games'
  },
  {
    info: 'zCloak',
    providers: {
      // 'zCloak Network': 'wss://test1.zcloak.network' // https://github.com/polkadot-js/apps/issues/7408
    },
    text: 'zCloak-network'
  },
  {
    info: 'zeitgeist',
    providers: {
      Zeitgeist: 'wss://bsr.zeitgeist.pm'
    },
    text: 'Zeitgeist Battery Station'
  },
  {
    info: 'zero',
    providers: {
      // ZERO: 'wss://alphaville.zero.io' // https://github.com/polkadot-js/apps/issues/8263
    },
    text: 'Zero Alphaville'
  }
];
