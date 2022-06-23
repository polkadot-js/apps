// Copyright 2017-2022 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { EndpointOption } from './types';

export * from './testingRelayRococo';
export * from './testingRelayWestend';

/* eslint-disable sort-keys */

// The available endpoints that will show in the dropdown. For the most part (with the exception of
// Polkadot) we try to keep this to live chains only, with RPCs hosted by the community/chain vendor
//   info: The chain logo name as defined in ../ui/logos/index.ts in namedLogos (this also needs to align with @polkadot/networks)
//   text: The text to display on the dropdown
//   providers: The actual hosted secure websocket endpoint
//
// IMPORTANT: Alphabetical based on text
export const testChains: EndpointOption[] = [
  {
    info: 'ajuna',
    text: 'Ajuna Testnet',
    providers: {
      'Ajuna Network': 'wss://rpc-test.ajuna.network'
    }
  },
  {
    info: 'aleph',
    text: 'Aleph Zero Testnet',
    providers: {
      'Aleph Zero Foundation': 'wss://ws.test.azero.dev'
    }
  },
  {
    info: 'nodle',
    isDisabled: true, // https://github.com/polkadot-js/apps/issues/7652
    text: 'Arcadia',
    providers: {
      Nodle: 'wss://arcadia1.nodleprotocol.io'
    }
  },
  {
    info: 'arctic',
    text: 'Arctic',
    providers: {
      Arctic: 'wss://arctic-rpc.icenetwork.io:9944'
    }
  },
  {
    info: 'Ares Gladios',
    text: 'Ares Gladios',
    providers: {
      'Ares Protocol': 'wss://gladios.aresprotocol.io'
    }
  },
  {
    info: 'automata-contextfree',
    text: 'Automata ContextFree',
    providers: {
      'Automata Network': 'wss://cf-api.ata.network',
      OnFinality: 'wss://contextfree.api.onfinality.io/public-ws'
    }
  },
  {
    info: 'edgeware',
    text: 'Beresheet',
    providers: {
      'Commonwealth Labs': 'wss://beresheet.edgewa.re'
    }
  },
  {
    info: 'bifrost',
    text: 'Bifrost Stage Network',
    providers: {
      Liebi: 'wss://bifrost-rpc.testnet.liebi.com/ws'
    }
  },
  {
    info: 'bitcountry',
    text: 'Bit.Country - Metaverse Network',
    providers: {
      'Metaverse Foundation': 'wss://tewai-rpc.bit.country'
    }
  },
  {
    info: 'clover',
    isDisabled: true, // Cannot construct unknown type BridgeNetworks
    text: 'Clover',
    providers: {
      Clover: 'wss://api.clover.finance/'
    }
  },
  {
    // this is also a duplicate as a parachain under Polkadot and live under production -
    // it is either/or, not and
    info: 'coinversation',
    isDisabled: true, // https://github.com/polkadot-js/apps/issues/6635
    text: 'Coinversation',
    providers: {
      Coinversation: 'wss://rpc.coinversation.io/'
    }
  },
  {
    info: 'creditcoin-testnet',
    text: 'Creditcoin Testnet',
    providers: {
      'Creditcoin Foundation': 'wss://testnet.creditcoin.network'
    }
  },
  {
    info: 'Crust Maxwell',
    text: 'Crust Maxwell',
    providers: {
      'Crust Network': 'wss://api.crust.network/',
      'DCloud Foundation': 'wss://api.decloudf.com/'
      // Pinknode: 'wss://rpc.pinknode.io/maxwell/explorer' // https://github.com/polkadot-js/apps/issues/7058
    }
  },
  {
    info: 'datahighway',
    isDisabled: true,
    text: 'Spreehafen',
    providers: {
      MXC: 'wss://spreehafen.datahighway.com'
    }
  },
  {
    info: 'dock-testnet',
    isDisabled: true, // https://github.com/polkadot-js/apps/issues/6831
    text: 'Dock',
    providers: {
      'Dock Association': 'wss://knox-1.dock.io'
    }
  },
  {
    info: 'dolphin',
    isDisabled: true, // https://github.com/polkadot-js/apps/issues/7439
    text: 'Dolphin Testnet',
    providers: {
      'Dolphin Testnet': 'wss://trillian.dolphin.red'
    }
  },
  {
    info: 'dotmog',
    text: 'DOTMog',
    providers: {
      DOTMog: 'wss://mogiway-01.dotmog.com'
    }
  },
  {
    info: 'encointer',
    text: 'Encointer Gesell',
    providers: {
      'Encointer Association': 'wss://gesell.encointer.org'
    }
  },
  {
    info: 'equilibrium',
    isDisabled: true, // https://github.com/polkadot-js/apps/issues/6250
    text: 'Equilibrium',
    providers: {
      Equilibrium: 'wss://testnet.equilibrium.io'
    }
  },
  {
    info: 'substrate',
    isDisabled: true, // https://github.com/polkadot-js/apps/issues/5571
    text: 'Flaming Fir',
    providers: {
      Parity: 'wss://substrate-rpc.parity.io'
    }
  },
  {
    info: 'fantour',
    isDisabled: true, // https://github.com/polkadot-js/apps/issues/6519
    text: 'Fantour',
    providers: {
      FantourDev: 'wss://test-ws.fantour.io'
    }
  },
  {
    info: 'Galital',
    isDisabled: true, // https://github.com/polkadot-js/apps/issues/6721
    text: 'Galital PC2',
    providers: {
      StarkleyTech: 'wss://galital-rpc-testnet.starkleytech.com'
    }
  },
  {
    info: 'galois',
    text: 'Galois',
    providers: {
      MathWallet: 'wss://galois-hk.maiziqianbao.net/ws',
      'MathWallet Backup': 'wss://galois.maiziqianbao.net/ws'
    }
  },
  {
    info: 'gamepower',
    isDisabled: true, // https://github.com/polkadot-js/apps/issues/7223
    text: 'GamePower',
    providers: {
      GamePower: 'wss://gamepower.io'
    }
  },
  {
    info: 'geek',
    text: 'GeekCash',
    providers: {
      'Geek Team': 'wss://testnet.geekcash.org'
    }
  },
  {
    info: 'halongbay',
    isDisabled: true, // https://github.com/polkadot-js/apps/issues/6871
    text: 'Halongbay Testnet',
    providers: {
      Halongbay: 'wss://halongbay.polkafoundry.com'
    }
  },
  {
    info: 'interbtc',
    text: 'Interlay Testnet',
    providers: {
      Interlay: 'wss://api-testnet.interlay.io/parachain/'
    }
  },
  {
    info: 'brainstorm',
    text: 'InvArch Brainstorm Testnet',
    providers: {
      'InvArch Team': 'wss://brainstorm.invarch.network/'
    }
  },
  {
    info: 'ipse',
    isDisabled: true, // https://github.com/polkadot-js/apps/issues/6242
    text: 'IPSE',
    providers: {
      'IPSE China': 'wss://testnet-china.ipse.io',
      'IPSE USA': 'wss://testnet-usa.ipse.io',
      'IPSE Europe': 'wss://testnet-europe.ipse.io'
    }
  },
  {
    info: 'joystream',
    text: 'Joystream',
    providers: {
      Jsgenesis: 'wss://rpc.joystream.org:9944'
    }
  },
  {
    info: 'jupiter',
    isDisabled: true, // https://github.com/polkadot-js/apps/issues/7765
    text: 'Jupiter',
    providers: {
      Patract: 'wss://ws.jupiter-poa.patract.cn'
    }
  },
  {
    info: 'khala',
    isDisabled: true, // https://github.com/polkadot-js/apps/issues/6930
    text: 'Khala (Para 3)',
    providers: {
      'Phala Network': 'wss://pc-test-3.phala.network/khala/ws'
    }
  },
  {
    info: 'kilt',
    text: 'KILT Mashnet',
    providers: {
      'KILT Protocol': 'wss://full-nodes.kilt.io:9944/'
    }
  },
  {
    info: 'kilt',
    text: 'KILT Peregrine',
    providers: {
      'KILT Protocol': 'wss://peregrine.kilt.io/parachain-public-ws/'
    }
  },
  {
    info: 'klugdossier',
    text: 'Klug Dossier',
    providers: {
      'Klug Dossier': 'wss://klugdossier.net/'
    }
  },
  {
    info: 'kylin',
    isDisabled: true, // https://github.com/polkadot-js/apps/issues/6635
    text: 'Kylin Testnet',
    providers: {
      'Kylin Network': 'wss://testnet.kylin-node.co.uk'
    }
  },
  {
    info: 'litentry',
    text: 'Litentry Testnet',
    providers: {
      Litentry: 'wss://testnet.litentry.io'
    }
  },
  {
    info: 'logion',
    text: 'logion Parachain Testnet',
    providers: {
      Logion: 'wss://chimay.logion.network'
    }
  },
  {
    info: 'logion',
    text: 'logion Standalone Testnet',
    providers: {
      Logion: 'wss://test-rpc01.logion.network'
    }
  },
  {
    info: 'acala',
    text: 'Mandala',
    providers: {
      Acala: 'wss://mandala.polkawallet.io',
      OnFinality: 'wss://acala-mandala.api.onfinality.io/public-ws'
    }
  },
  {
    info: 'manta',
    isDisabled: true, // https://github.com/polkadot-js/apps/issues/6384
    text: 'Manta Testnet',
    providers: {
      'Manta Testnet': 'wss://ws.f1.testnet.manta.network'
    }
  },
  {
    info: 'minix',
    text: 'MiniX Testnet',
    providers: {
      Chainx: 'wss://minichain.coming.chat/ws'
    }
  },
  {
    info: 'moonbaseAlpha',
    text: 'Moonbase Alpha',
    providers: {
      'Moonbeam Foundation': 'wss://wss.api.moonbase.moonbeam.network',
      Blast: 'wss://moonbase-alpha.public.blastapi.io',
      OnFinality: 'wss://moonbeam-alpha.api.onfinality.io/public-ws',
      Pinknode: 'wss://public-rpc.pinknode.io/alphanet'
    }
  },
  {
    info: 'mybank',
    isDisabled: true, // https://github.com/polkadot-js/apps/issues/5845
    text: 'mybank.network',
    providers: {
      MYBANK: 'wss://mybank.network/substrate'
    }
  },
  {
    info: 'nftmart',
    text: 'NFTMart',
    providers: {
      NFTMartDev: 'wss://dev-ws.nftmart.io',
      NFTMartStaging: 'wss://staging-ws.nftmart.io'
    }
  },
  {
    info: 'opal',
    isDisabled: true, // https://github.com/polkadot-js/apps/issues/7638
    text: 'OPAL by UNIQUE',
    providers: {
      Unique: 'wss://opal.unique.network'
    }
  },
  {
    info: 'opportunity',
    isDisabled: false,
    text: 'Opportunity',
    providers: {
      'Standard Protocol': 'wss://rpc.opportunity.standard.tech'
    }
  },
  {
    info: 'pangolin',
    text: 'Pangolin',
    providers: {
      'Darwinia Network': 'wss://pangolin-rpc.darwinia.network'
    }
  },
  {
    info: 'pangoro',
    text: 'Pangoro',
    providers: {
      'Darwinia Network': 'wss://pangoro-rpc.darwinia.network'
    }
  },
  {
    info: 'phala',
    text: 'Phala (PoC 5)',
    providers: {
      'Phala Network': 'wss://poc5.phala.network/ws'
    }
  },
  {
    info: 'phoenix',
    isDisabled: true, // https://github.com/polkadot-js/apps/issues/6181
    text: 'Phoenix Mashnet',
    providers: {
      'phoenix Protocol': 'wss://phoenix-ws.coinid.pro/'
    }
  },
  {
    info: 'pichiu',
    isDisabled: true, // https://github.com/polkadot-js/apps/pull/6761
    text: 'Pichiu Testnet',
    providers: {
      'Kylin Network': 'wss://westend.kylin-node.co.uk'
    }
  },
  {
    info: 'polkadex',
    text: 'Polkadex',
    providers: {
      'Polkadex Team': 'wss://blockchain.polkadex.trade'
    }
  },
  {
    info: 'polymesh',
    text: 'Polymesh Testnet',
    providers: {
      Polymath: 'wss://testnet-rpc.polymesh.live'
    }
  },
  {
    info: 'pontem',
    text: 'Pontem',
    providers: {
      // Pontem: 'wss://testnet.pontem.network/ws', // https://github.com/polkadot-js/apps/issues/7652
    }
  },
  {
    info: 'prism',
    isDisabled: true, // https://github.com/polkadot-js/apps/issues/7340
    text: 'Prism',
    providers: {
      Prism: 'wss://testnet.psm.link'
    }
  },
  {
    info: 'realis',
    text: 'Realis.Network',
    providers: {
      'Realis.Network': 'wss://rpc.realis.network/'
    }
  },
  {
    info: 'riochain',
    isDisabled: true, // https://github.com/polkadot-js/apps/issues/6181
    text: 'RioChain',
    providers: {
      'RioChain Staging': 'wss://node.v1.staging.riochain.io'
    }
  },
  {
    info: 'sherpax',
    text: 'Sherpax Testnet',
    providers: {
      Chainx: 'wss://sherpax-testnet.chainx.org'
    }
  },
  {
    info: 'shibuya',
    text: 'Shibuya',
    providers: {
      StakeTechnologies: 'wss://rpc.shibuya.astar.network',
      Dwellir: 'wss://shibuya-rpc.dwellir.com',
      Pinknode: 'wss://public-rpc.pinknode.io/shibuya'
    }
  },
  {
    info: 'skyekiwi',
    text: 'SkyeKiwi Testnet',
    providers: {
      SkyeKiwi: 'wss://staging.rpc.skye.kiwi'
    }
  },
  {
    info: 'soonsocial',
    text: 'Soonsocial',
    providers: {
      DappForce: 'wss://testnet.subsocial.network'
    }
  },
  {
    info: 'sora-substrate',
    text: 'SORA-staging',
    providers: {
      Soramitsu: 'wss://ws.stage.sora2.soramitsu.co.jp'
    }
  },
  {
    info: 'subdao',
    isDisabled: true, // https://github.com/polkadot-js/apps/issues/7473
    text: 'SubDAO Staging',
    providers: {
      SubDAO: 'wss://alpha.subdao.org'
    }
  },
  {
    info: 'subgame',
    text: 'SubGame Staging',
    providers: {
      SubGame: 'wss://staging.subgame.org'
    }
  },
  {
    info: 'subspace-farmnet',
    text: 'Subspace Farmnet',
    providers: {
      'Subspace Network': 'wss://farm-rpc.subspace.network/ws'
    }
  },
  {
    info: 'subspace-gemini-1',
    text: 'Subspace Gemini 1',
    providers: {
      'North America': 'wss://na.gemini-1b.subspace.network/ws',
      Europe: 'wss://eu.gemini-1b.subspace.network/ws',
      Asia: 'wss://apac.gemini-1b.subspace.network/ws'
    }
  },
  {
    info: 'subspace',
    text: 'Subspace Testnet',
    providers: {
      'Subspace Network': 'wss://test-rpc.subspace.network'
    }
  },
  {
    info: 'ternoa-alphanet',
    text: 'Ternoa Alphanet',
    providers: {
      CapsuleCorp: 'wss://alphanet.ternoa.com'
    }
  },
  {
    info: 'ternoa-testnet',
    text: 'Ternoa Testnet',
    providers: {
      CapsuleCorp: 'wss://testnet.ternoa.com/'
    }
  },
  {
    info: 'laminar',
    text: 'Turbulence',
    providers: {
      Laminar: 'wss://testnet-node-1.laminar-chain.laminar.one/ws'
    }
  },
  {
    info: 'uniarts',
    text: 'UniArts',
    providers: {
      UniArts: 'wss://testnet.uniarts.network'
    }
  },
  {
    info: 'unique',
    isDisabled: true, // https://github.com/polkadot-js/apps/issues/7621
    text: 'Unique',
    providers: {
      Unique: 'wss://testnet2.unique.network'
    }
  },
  {
    info: 'unitv',
    isDisabled: true, // https://github.com/polkadot-js/apps/issues/5684
    text: 'Unit Network',
    providers: {
      'Unit Network': 'wss://unitventures.io/'
    }
  },
  {
    info: 'vodka',
    text: 'Vodka',
    providers: {
      Vodka: 'wss://vodka.rpc.neatcoin.org/ws'
    }
  },
  {
    info: 'web3games',
    text: 'Web3Games',
    providers: {
      Web3Games: 'wss://testnet.web3games.org'
    }
  },
  {
    info: 'zCloak',
    isDisabled: true, // https://github.com/polkadot-js/apps/issues/7408
    text: 'zCloak-network',
    providers: {
      'zCloak Network': 'wss://test1.zcloak.network'
    }
  },
  {
    info: 'zeitgeist',
    text: 'Zeitgeist Battery Station',
    providers: {
      Zeitgeist: 'wss://bsr.zeitgeist.pm'
    }
  },
  {
    info: 'zero',
    text: 'Zero Alphaville',
    providers: {
      ZERO: 'wss://alphaville.zero.io'
    }
  }
];
