// Copyright 2017-2022 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { EndpointOption } from './types';

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
export const prodChains: EndpointOption[] = [
  {
    info: '3dpass',
    text: '3DPass',
    providers: {
      '3dpass': 'wss://rpc2.3dpass.org'
    }
  },
  {
    info: 'aleph',
    text: 'Aleph Zero',
    providers: {
      'Aleph Zero Foundation': 'wss://ws.azero.dev'
    }
  },
  {
    info: 'Ares Odyssey',
    text: 'Ares Odyssey',
    providers: {
      'Ares Protocol': 'wss://odyssey.aresprotocol.io'
    }
  },
  {
    info: 'automata',
    text: 'Automata',
    providers: {
      'Automata Network': 'wss://api.ata.network',
      OnFinality: 'wss://automata.api.onfinality.io/public-ws'
    }
  },
  {
    info: 'bittensor',
    text: 'Bittensor',
    providers: {
      'Opentensor Foundation': 'wss://archivelb.nakamoto.opentensor.ai:9943',
    }
  },
  {
    dnslink: 'centrifuge',
    info: 'centrifuge',
    text: 'Centrifuge Standalone [Archived]',
    providers: {
      // Centrifuge: 'wss://fullnode.centrifuge.io' // https://github.com/polkadot-js/apps/issues/8012
    }
  },
  {
    info: 'chainx',
    text: 'ChainX',
    providers: {
      ChainX: 'wss://mainnet.chainx.org/ws'
    }
  },
  {
    info: 'competitors-club',
    text: 'Competitors Club',
    providers: {
      // 'Competitors Club': 'wss://node0.competitors.club/wss' // https://github.com/polkadot-js/apps/issues/8263
    }
  },
  {
    info: 'creditcoin',
    text: 'Creditcoin',
    providers: {
      'Creditcoin Foundation': 'wss://rpc.mainnet.creditcoin.network/ws'
    }
  },
  {
    info: 'crown-sterling',
    text: 'Crown Sterling',
    providers: {
      'Crown Sterling': 'wss://blockchain.crownsterling.io'
    }
  },
  {
    info: 'crust',
    text: 'Crust Network',
    providers: {
      'Crust Network': 'wss://rpc.crust.network',
      OnFinality: 'wss://crust.api.onfinality.io/public-ws'
    }
  },
  {
    info: 'darwinia',
    text: 'Darwinia',
    providers: {
      'Darwinia Network': 'wss://rpc.darwinia.network',
      Dwellir: 'wss://darwinia-rpc.dwellir.com'
    }
  },
  {
    info: 'crab',
    text: 'Darwinia Crab',
    providers: {
      'Darwinia Network': 'wss://crab-rpc.darwinia.network',
      Dwellir: 'wss://darwiniacrab-rpc.dwellir.com',
      OnFinality: 'wss://darwinia-crab.api.onfinality.io/public-ws'
    }
  },
  {
    info: 'debio',
    text: 'DeBio',
    providers: {
      DeBio: 'wss://ws-rpc.debio.network'
    }
  },
  {
    info: 'dock-pos-mainnet',
    text: 'Dock',
    providers: {
      'Dock Association': 'wss://mainnet-node.dock.io'
    }
  },
  {
    dnslink: 'edgeware',
    info: 'edgeware',
    text: 'Edgeware',
    providers: {
      JelliedOwl: 'wss://edgeware.jelliedowl.net',
      'Commonwealth Labs': 'wss://mainnet2.edgewa.re',
      OnFinality: 'wss://edgeware.api.onfinality.io/public-ws',
      Dwellir: 'wss://edgeware-rpc.dwellir.com'
    }
  },
  {
    info: 'efinity',
    text: 'Efinity',
    providers: {
      // Efinity: 'wss://rpc.efinity.io' // https://github.com/polkadot-js/apps/pull/6761
    }
  },
  {
    info: 'equilibrium',
    text: 'Equilibrium',
    providers: {
      // Equilibrium: 'wss://node.equilibrium.io' // https://github.com/polkadot-js/apps/issues/7219
    }
  },
  {
    info: 'genshiro',
    text: 'Genshiro',
    providers: {
      Equilibrium: 'wss://node.genshiro.io'
    }
  },
  {
    info: 'hanonycash',
    text: 'Hanonycash',
    providers: {
      // Hanonycash: 'wss://rpc.hanonycash.com' // https://github.com/polkadot-js/apps/runs/2755409009?check_suite_focus=true
    }
  },
  {
    info: 'joystream',
    text: 'Joystream',
    providers: {
      Jsgenesis: 'wss://rpc.joystream.org'
    }
  },
  {
    dnslink: 'kulupu',
    info: 'kulupu',
    text: 'Kulupu',
    providers: {
      Kulupu: 'wss://rpc.kulupu.corepaper.org/ws'
    }
  },
  {
    info: 'kusari',
    text: 'Kusari',
    providers: {
      Swapdex: 'wss://ws.kusari.network'
    }
  },
  {
    info: 'logion',
    text: 'logion Standalone',
    providers: {
      Logion: 'wss://rpc01.logion.network'
    }
  },
  {
    info: 'mathchain',
    text: 'MathChain',
    providers: {
      //  MathWallet: 'wss://mathchain-asia.maiziqianbao.net/ws', // https://github.com/polkadot-js/apps/issues/8525
      // 'MathWallet Backup': 'wss://mathchain-us.maiziqianbao.net/ws' // https://github.com/polkadot-js/apps/issues/8525
    }
  },
  {
    info: 'minix',
    text: 'MiniX',
    providers: {
      // ChainX: 'wss://minichain-mainnet.coming.chat/ws' // https://github.com/polkadot-js/apps/issues/7182
    }
  },
  {
    info: 'myriad',
    text: 'Myriad',
    providers: {
      Myriad: 'wss://ws-rpc.myriad.social'
    }
  },
  {
    info: 'neatcoin',
    text: 'Neatcoin',
    providers: {
      Neatcoin: 'wss://rpc.neatcoin.org/ws'
    }
  },
  {
    info: 'nftmart',
    text: 'NFTMart',
    providers: {
      NFTMart: 'wss://mainnet.nftmart.io/rpc/ws'
    }
  },
  {
    info: 'nodle',
    text: 'Nodle',
    providers: {
      // Nodle: 'wss://main3.nodleprotocol.io', // https://github.com/polkadot-js/apps/issues/7652
      // OnFinality: 'wss://nodle.api.onfinality.io/public-ws' // https://github.com/polkadot-js/apps/issues/8013
    }
  },
  {
    info: 'polkadex',
    text: 'Polkadex',
    providers: {
      'Polkadex Team': 'wss://mainnet.polkadex.trade',
      OnFinality: 'wss://polkadex.api.onfinality.io/public-ws'
    }
  },
  {
    info: 'polymesh',
    text: 'Polymesh Mainnet',
    providers: {
      Polymath: 'wss://mainnet-rpc.polymesh.network'
    }
  },
  {
    info: 'riochain',
    text: 'RioChain',
    providers: {
      RioChain: 'wss://node.v1.riochain.io'
    }
  },
  {
    info: 'robonomics',
    text: 'Robonomics',
    providers: {
      // Airalab: 'wss://kusama.rpc.robonomics.network/' // https://github.com/polkadot-js/apps/pull/6761
    }
  },
  {
    info: 'sherpax',
    text: 'SherpaX',
    providers: {
      ChainX: 'wss://mainnet.sherpax.io'
    }
  },
  {
    info: 'sora-substrate',
    text: 'SORA',
    providers: {
      'SORA Parliament Ministry of Finance #2': 'wss://mof2.sora.org',
      'SORA Parliament Ministry of Finance': 'wss://ws.mof.sora.org',
      'SORA Parliament Ministry of Finance #3': 'wss://mof3.sora.org',
      OnFinality: 'wss://sora.api.onfinality.io/public-ws'
    }
  },
  {
    info: 'spanner',
    text: 'Spanner',
    providers: {
      // Spanner: 'wss://wss.spannerprotocol.com' // https://github.com/polkadot-js/apps/issues/6547
    }
  },
  {
    info: 'stafi',
    isDisabled: true, // Cannot find type ChainId
    text: 'Stafi',
    providers: {
      'Stafi Foundation': 'wss://mainnet-rpc.stafi.io'
    }
  },
  {
    info: 'subgame',
    text: 'SubGame',
    providers: {
      SubGame: 'wss://mainnet.subgame.org/'
    }
  },
  {
    info: 'subsocial',
    text: 'Subsocial',
    providers: {
      // DappForce: 'wss://rpc.subsocial.network' // https://github.com/polkadot-js/apps/issues/8046
    }
  },
  {
    info: 'swapdex',
    text: 'Swapdex',
    providers: {
      Swapdex: 'wss://ws.swapdex.network'
    }
  },
  {
    info: 'ternoa',
    text: 'Ternoa',
    providers: {
      CapsuleCorp: 'wss://mainnet.ternoa.network'
    }
  },
  {
    info: 'uniarts',
    text: 'UniArts',
    providers: {
      UniArts: 'wss://mainnet.uniarts.vip:9443'
    }
  },
  {
    info: 'unitnetwork',
    text: 'UnitNetwork',
    providers: {
      // UnitNetwork: 'wss://www.unitnode3.info:443'
    }
  },
  {
    info: 'westlake',
    text: 'Westlake',
    providers: {
      // DataHighway: 'wss://westlake.datahighway.com' // https://github.com/polkadot-js/apps/issues/7293
    }
  }
];
