// Copyright 2017-2022 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { createOptions } from './util';

export * from './productionRelayKusama';
export * from './productionRelayPolkadot';

/* eslint-disable sort-keys */

// The available endpoints that will show in the dropdown. For the most part (with the exception of
// Polkadot) we try to keep this to live chains only, with RPCs hosted by the community/chain vendor
//   info: The chain logo name as defined in ../ui/logos/index.ts in namedLogos (this also needs to align with @polkadot/networks)
//   text: The text to display on the dropdown
//   providers: The actual hosted secure websocket endpoint
//
// IMPORTANT: Alphabetical based on text
export const prodChains = createOptions({
  aleph: {
    text: 'Aleph Zero',
    providers: {
      'Aleph Zero Foundation': 'wss://ws.azero.dev'
    }
  },
  'Ares Odyssey': {
    text: 'Ares Odyssey',
    providers: {
      'Ares Protocol': 'wss://odyssey.aresprotocol.io'
    }
  },
  automata: {
    text: 'Automata',
    providers: {
      'Automata Network': 'wss://api.ata.network',
      OnFinality: 'wss://automata.api.onfinality.io/public-ws'
    }
  },
  centrifuge: {
    dnslink: 'centrifuge',
    text: 'Centrifuge Standalone [Archived]',
    providers: {
      // Centrifuge: 'wss://fullnode.centrifuge.io' // https://github.com/polkadot-js/apps/issues/8012
    }
  },
  chainx: {
    text: 'ChainX',
    providers: {
      ChainX: 'wss://mainnet.chainx.org/ws'
    }
  },
  'competitors-club': {
    text: 'Competitors Club',
    providers: {
      // 'Competitors Club': 'wss://node0.competitors.club/wss' // https://github.com/polkadot-js/apps/issues/8263
    }
  },
  creditcoin: {
    text: 'Creditcoin',
    providers: {
      'Creditcoin Foundation': 'wss://rpc.mainnet.creditcoin.network/ws'
    }
  },
  'crown-sterling': {
    text: 'Crown Sterling',
    providers: {
      'Crown Sterling': 'wss://blockchain.crownsterling.io'
    }
  },
  crust: {
    text: 'Crust Network',
    providers: {
      'Crust Network': 'wss://rpc.crust.network',
      OnFinality: 'wss://crust.api.onfinality.io/public-ws'
    }
  },
  darwinia: {
    text: 'Darwinia',
    providers: {
      'Darwinia Network': 'wss://rpc.darwinia.network',
      Dwellir: 'wss://darwinia-rpc.dwellir.com'
    }
  },
  crab: {
    text: 'Darwinia Crab',
    providers: {
      'Darwinia Network': 'wss://crab-rpc.darwinia.network',
      Dwellir: 'wss://darwiniacrab-rpc.dwellir.com',
      OnFinality: 'wss://darwinia-crab.api.onfinality.io/public-ws'
    }
  },
  'dock-pos-mainnet': {
    text: 'Dock',
    providers: {
      'Dock Association': 'wss://mainnet-node.dock.io'
    }
  },
  edgeware: {
    dnslink: 'edgeware',
    text: 'Edgeware',
    providers: {
      JelliedOwl: 'wss://edgeware.jelliedowl.net',
      'Commonwealth Labs': 'wss://mainnet2.edgewa.re',
      OnFinality: 'wss://edgeware.api.onfinality.io/public-ws',
      Dwellir: 'wss://edgeware-rpc.dwellir.com'
    }
  },
  efinity: {
    text: 'Efinity',
    providers: {
      // Efinity: 'wss://rpc.efinity.io' // https://github.com/polkadot-js/apps/pull/6761
    }
  },
  equilibrium: {
    text: 'Equilibrium',
    providers: {
      // Equilibrium: 'wss://node.equilibrium.io' // https://github.com/polkadot-js/apps/issues/7219
    }
  },
  genshiro: {
    text: 'Genshiro',
    providers: {
      Equilibrium: 'wss://node.genshiro.io'
    }
  },
  hanonycash: {
    text: 'Hanonycash',
    providers: {
      // Hanonycash: 'wss://rpc.hanonycash.com' // https://github.com/polkadot-js/apps/runs/2755409009?check_suite_focus=true
    }
  },
  kulupu: {
    dnslink: 'kulupu',
    text: 'Kulupu',
    providers: {
      Kulupu: 'wss://rpc.kulupu.corepaper.org/ws'
    }
  },
  kusari: {
    text: 'Kusari',
    providers: {
      Swapdex: 'wss://ws.kusari.network'
    }
  },
  logion: {
    text: 'logion Standalone',
    providers: {
      Logion: 'wss://rpc01.logion.network'
    }
  },
  mathchain: {
    text: 'MathChain',
    providers: {
      MathWallet: 'wss://mathchain-asia.maiziqianbao.net/ws',
      'MathWallet Backup': 'wss://mathchain-us.maiziqianbao.net/ws'
    }
  },
  minix: {
    text: 'MiniX',
    providers: {
      // ChainX: 'wss://minichain-mainnet.coming.chat/ws' // https://github.com/polkadot-js/apps/issues/7182
    }
  },
  myriad: {
    text: 'Myriad',
    providers: {
      Myriad: 'wss://ws-rpc.myriad.social'
    }
  },
  neatcoin: {
    text: 'Neatcoin',
    providers: {
      Neatcoin: 'wss://rpc.neatcoin.org/ws'
    }
  },
  nftmart: {
    text: 'NFTMart',
    providers: {
      NFTMart: 'wss://mainnet.nftmart.io/rpc/ws'
    }
  },
  nodle: {
    text: 'Nodle',
    providers: {
      // Nodle: 'wss://main3.nodleprotocol.io', // https://github.com/polkadot-js/apps/issues/7652
      // OnFinality: 'wss://nodle.api.onfinality.io/public-ws' // https://github.com/polkadot-js/apps/issues/8013
    }
  },
  polkadex: {
    text: 'Polkadex',
    providers: {
      'Polkadex Team': 'wss://mainnet.polkadex.trade',
      OnFinality: 'wss://polkadex.api.onfinality.io/public-ws'
    }
  },
  polymesh: {
    text: 'Polymesh Mainnet',
    providers: {
      Polymath: 'wss://mainnet-rpc.polymesh.network'
    }
  },
  riochain: {
    text: 'RioChain',
    providers: {
      RioChain: 'wss://node.v1.riochain.io'
    }
  },
  robonomics: {
    text: 'Robonomics',
    providers: {
      // Airalab: 'wss://kusama.rpc.robonomics.network/' // https://github.com/polkadot-js/apps/pull/6761
    }
  },
  sherpax: {
    text: 'SherpaX',
    providers: {
      ChainX: 'wss://mainnet.sherpax.io'
    }
  },
  'sora-substrate': {
    text: 'SORA',
    providers: {
      'SORA Parliament Ministry of Finance #2': 'wss://mof2.sora.org',
      'SORA Parliament Ministry of Finance': 'wss://ws.mof.sora.org',
      'SORA Parliament Ministry of Finance #3': 'wss://mof3.sora.org',
      // Soramitsu: 'wss://ws.alb.sora.org', // https://github.com/polkadot-js/apps/issues/7786
      OnFinality: 'wss://sora.api.onfinality.io/public-ws'
      // 'SORA Community (Lux8)': 'wss://sora.lux8.net' // https://github.com/polkadot-js/apps/issues/6195
    }
  },
  spanner: {
    text: 'Spanner',
    providers: {
      // Spanner: 'wss://wss.spannerprotocol.com' // https://github.com/polkadot-js/apps/issues/6547
    }
  },
  stafi: {
    isDisabled: true, // Cannot find type ChainId
    text: 'Stafi',
    providers: {
      'Stafi Foundation': 'wss://mainnet-rpc.stafi.io'
    }
  },
  subgame: {
    text: 'SubGame',
    providers: {
      SubGame: 'wss://mainnet.subgame.org/'
    }
  },
  subsocial: {
    text: 'Subsocial',
    providers: {
      // DappForce: 'wss://rpc.subsocial.network' // https://github.com/polkadot-js/apps/issues/8046
    }
  },
  swapdex: {
    text: 'Swapdex',
    providers: {
      Swapdex: 'wss://ws.swapdex.network'
    }
  },
  ternoa: {
    text: 'Ternoa',
    providers: {
      CapsuleCorp: 'wss://mainnet.ternoa.network'
    }
  },
  uniarts: {
    text: 'UniArts',
    providers: {
      UniArts: 'wss://mainnet.uniarts.vip:9443'
    }
  },
  unitnetwork: {
    text: 'UnitNetwork',
    providers: {
      // UnitNetwork: 'wss://www.unitnode3.info:443'
    }
  },
  westlake: {
    text: 'Westlake',
    providers: {
      // DataHighway: 'wss://westlake.datahighway.com' // https://github.com/polkadot-js/apps/issues/7293
    }
  }
});
