// Copyright 2017-2023 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { EndpointOption } from './types';

import { POLKADOT_GENESIS } from '../api/constants';
import { getTeleports } from './util';

// The available endpoints that will show in the dropdown. For the most part (with the exception of
// Polkadot) we try to keep this to live chains only, with RPCs hosted by the community/chain vendor
//   info: The chain logo name as defined in ../ui/logos/index.ts in namedLogos (this also needs to align with @polkadot/networks)
//   text: The text to display on the dropdown
//   providers: The actual hosted secure websocket endpoint
//
// IMPORTANT: Alphabetical based on text
export const prodParasPolkadot: EndpointOption[] = [
  {
    homepage: 'https://acala.network/',
    info: 'acala',
    paraId: 2000,
    providers: {
      'Acala Foundation 0': 'wss://acala-rpc-0.aca-api.network',
      'Acala Foundation 1': 'wss://acala-rpc-1.aca-api.network',
      // 'Acala Foundation 2': 'wss://acala-rpc-2.aca-api.network/ws', // https://github.com/polkadot-js/apps/issues/6965
      'Acala Foundation 3': 'wss://acala-rpc-3.aca-api.network/ws',
      Dwellir: 'wss://acala-rpc.dwellir.com',
      // 'Automata 1RPC': 'wss://1rpc.io/aca' // https://github.com/polkadot-js/apps/issues/8648
      OnFinality: 'wss://acala-polkadot.api.onfinality.io/public-ws',
      'Polkawallet 0': 'wss://acala.polkawallet.io'
    },
    text: 'Acala'
  },
  {
    homepage: 'https://ajuna.io',
    info: 'ajuna',
    paraId: 2051,
    providers: {
      AjunaNetwork: 'wss://rpc-parachain.ajuna.network',
      RadiumBlock: 'wss://ajuna.public.curie.radiumblock.co/ws'
    },
    text: 'Ajuna Network'
  },
  {
    homepage: 'https://www.aresprotocol.io/',
    info: 'odyssey',
    paraId: 2028,
    providers: {
      AresProtocol: 'wss://wss.odyssey.aresprotocol.io'
    },
    text: 'Ares Odyssey'
  },
  {
    homepage: 'https://astar.network',
    info: 'astar',
    paraId: 2006,
    providers: {
      Astar: 'wss://rpc.astar.network',
      'Automata 1RPC': 'wss://1rpc.io/astr',
      Blast: 'wss://astar.public.blastapi.io',
      Dwellir: 'wss://astar-rpc.dwellir.com',
      OnFinality: 'wss://astar.api.onfinality.io/public-ws',
      Pinknode: 'wss://public-rpc.pinknode.io/astar',
      RadiumBlock: 'wss://astar.public.curie.radiumblock.co/ws',
      'light client': 'light://substrate-connect/polkadot/astar'
    },
    text: 'Astar'
  },
  {
    homepage: 'https://www.aventus.io/',
    info: 'aventus',
    paraId: 2056,
    providers: {},
    text: 'Aventus'
  },
  {
    homepage: 'https://crowdloan.bifrost.app',
    info: 'bifrost',
    paraId: 2030,
    providers: {
      Liebi: 'wss://hk.p.bifrost-rpc.liebi.com/ws',
      OnFinality: 'wss://bifrost-polkadot.api.onfinality.io/public-ws'
    },
    text: 'Bifrost'
  },
  {
    homepage: 'https://www.bitgreen.org',
    info: 'bitgreen',
    paraId: 2048,
    providers: {
      Bitgreen: 'wss://mainnet.bitgreen.org'
    },
    text: 'Bitgreen'
  },
  {
    homepage: 'https://centrifuge.io',
    info: 'centrifuge',
    paraId: 2031,
    providers: {
      Centrifuge: 'wss://fullnode.parachain.centrifuge.io',
      OnFinality: 'wss://centrifuge-parachain.api.onfinality.io/public-ws'
    },
    text: 'Centrifuge'
  },
  {
    homepage: 'https://clover.finance',
    info: 'clover',
    paraId: 2002,
    providers: {
      Clover: 'wss://rpc-para.clover.finance',
      OnFinality: 'wss://clover.api.onfinality.io/public-ws' // https://github.com/polkadot-js/apps/issues/8355, then enabled in https://github.com/polkadot-js/apps/pull/8413, then broken in https://github.com/polkadot-js/apps/issues/8421, renenabled for PolkadotJS
    },
    text: 'Clover'
  },
  {
    homepage: 'http://www.coinversation.io/',
    info: 'coinversation',
    // this is also a duplicate as a Live and Testing network -
    // it is either/or, not and
    isUnreachable: true,
    paraId: 2027,
    providers: {
      // Coinversation: 'wss://rpc.coinversation.io/' // https://github.com/polkadot-js/apps/issues/6635
    },
    text: 'Coinversation'
  },
  {
    homepage: 'https://composable.finance/',
    info: 'composableFinance',
    paraId: 2019,
    providers: {
      Composable: 'wss://rpc.composable.finance',
      OnFinality: 'wss://composable.api.onfinality.io/public-ws'
    },
    text: 'Composable Finance'
  },
  {
    homepage: 'https://crust.network',
    info: 'crustParachain',
    paraId: 2008,
    providers: {
      Crust: 'wss://crust-parachain.crustapps.net'
    },
    text: 'Crust'
  },
  {
    homepage: 'https://darwinia.network/',
    info: 'darwinia',
    paraId: 2046,
    providers: {
      'Darwinia Network': 'wss://parachain-rpc.darwinia.network'
    },
    text: 'Darwinia'
  },
  {
    homepage: 'https://darwinia.network/',
    info: 'darwinia',
    paraId: 2003,
    providers: {
      // 'Darwinia Network': 'wss://parachain-rpc.darwinia.network' // https://github.com/polkadot-js/apps/issues/6530
    },
    text: 'Darwinia Backup'
  },
  {
    homepage: 'https://efinity.io',
    info: 'efinity',
    paraId: 2021,
    providers: {
      Dwellir: 'wss://efinity-rpc.dwellir.com',
      Efinity: 'wss://rpc.efinity.io',
      OnFinality: 'wss://efinity.api.onfinality.io/public-ws'
    },
    text: 'Efinity'
  },
  {
    homepage: 'https://equilibrium.io/',
    info: 'equilibrium',
    paraId: 2011,
    providers: {
      Dwellir: 'wss://equilibrium-rpc.dwellir.com',
      Equilibrium: 'wss://node.pol.equilibrium.io/'
    },
    text: 'Equilibrium'
  },
  {
    homepage: 'https://frequency.xyz',
    info: 'frequency',
    paraId: 2091,
    providers: {
      'Frequency 0': 'wss://0.rpc.frequency.xyz',
      'Frequency 1': 'wss://1.rpc.frequency.xyz'
    },
    text: 'Frequency'
  },
  {
    homepage: 'https://geminis.network/',
    info: 'geminis',
    isUnreachable: true,
    paraId: 2038,
    providers: {
      Geminis: 'wss://rpc.geminis.network'
    },
    text: 'Geminis'
  },
  {
    homepage: 'https://hashed.network/',
    info: 'hashed',
    paraId: 2093,
    providers: {
      'Hashed Systems': 'wss://c1.hashed.network'
    },
    text: 'Hashed Network'
  },
  {
    homepage: 'https://hydradx.io/',
    info: 'hydra',
    paraId: 2034,
    providers: {
      Dwellir: 'wss://hydradx-rpc.dwellir.com',
      'Galactic Council': 'wss://rpc.hydradx.cloud',
      OnFinality: 'wss://hydradx.api.onfinality.io/public-ws' // https://github.com/polkadot-js/apps/issues/8623, Renabled for PolkadotJS
    },
    text: 'HydraDX'
  },
  {
    homepage: 'https://integritee.network',
    info: 'integritee',
    paraId: 2039,
    providers: {
      Integritee: 'wss://polkadot.api.integritee.network'
    },
    text: 'Integritee Shell'
  },
  {
    homepage: 'https://interlay.io/',
    info: 'interlay',
    paraId: 2032,
    providers: {
      'Kintsugi Labs': 'wss://api.interlay.io/parachain',
      OnFinality: 'wss://interlay.api.onfinality.io/public-ws'
    },
    text: 'Interlay'
  },
  {
    homepage: 'https://totemaccounting.com/',
    info: 'kapex',
    paraId: 2007,
    providers: {
      Totem: 'wss://k-ui.kapex.network'
    },
    text: 'Kapex'
  },
  {
    homepage: 'https://www.kilt.io/',
    info: 'kilt',
    paraId: 2086,
    providers: {
      Dwellir: 'wss://kilt-rpc.dwellir.com',
      'KILT Protocol': 'wss://spiritnet.kilt.io/',
      OnFinality: 'wss://spiritnet.api.onfinality.io/public-ws'
    },
    text: 'KILT Spiritnet'
  },
  {
    homepage: 'https://kylin.network/',
    info: 'kylin',
    paraId: 2052,
    providers: {
      'Kylin Network': 'wss://polkadot.kylin-node.co.uk'
    },
    text: 'Kylin'
  },
  {
    homepage: 'https://crowdloan.litentry.com',
    info: 'litentry',
    paraId: 2013,
    providers: {
      Dwellir: 'wss://litentry-rpc.dwellir.com',
      Litentry: 'wss://rpc.litentry-parachain.litentry.io'
    },
    text: 'Litentry'
  },
  {
    homepage: 'https://manta.network',
    info: 'manta',
    isUnreachable: true, // https://github.com/polkadot-js/apps/issues/7018
    paraId: 2015,
    providers: {
      // 'Manta Kuhlii': 'wss://kuhlii.manta.systems', // https://github.com/polkadot-js/apps/issues/6930
      // 'Manta Munkiana': 'wss://munkiana.manta.systems', // https://github.com/polkadot-js/apps/issues/6871
      // 'Manta Pectinata': 'wss://pectinata.manta.systems' // https://github.com/polkadot-js/apps/issues/7018
    },
    text: 'Manta'
  },
  {
    homepage: 'https://moonbeam.network/networks/moonbeam/',
    info: 'moonbeam',
    paraId: 2004,
    providers: {
      'Automata 1RPC': 'wss://1rpc.io/glmr',
      Blast: 'wss://moonbeam.public.blastapi.io',
      'Moonbeam Foundation': 'wss://wss.api.moonbeam.network',
      OnFinality: 'wss://moonbeam.api.onfinality.io/public-ws',
      UnitedBloc: 'wss://moonbeam.unitedbloc.com:3001'
    },
    text: 'Moonbeam'
  },
  {
    homepage: 'https://nodle.com',
    info: 'nodle',
    paraId: 2026,
    providers: {
      Dwellir: 'wss://eden-rpc.dwellir.com',
      OnFinality: 'wss://nodle-parachain.api.onfinality.io/public-ws',
      Pinknode: 'wss://public-rpc.pinknode.io/nodle'
    },
    text: 'Nodle'
  },
  {
    homepage: 'https://oak.tech',
    info: 'oak',
    isUnreachable: true,
    paraId: 2090,
    providers: {
      OAK: 'wss://rpc.oak.tech'
    },
    text: 'OAK Network'
  },
  {
    homepage: 'https://www.omnibtc.finance',
    info: 'omnibtc',
    isUnreachable: true,
    paraId: 2053,
    providers: {
      OmniBTC: 'wss://psc-parachain.coming.chat'
    },
    text: 'OmniBTC'
  },
  {
    homepage: 'https://parachain.origintrail.io',
    info: 'origintrail-parachain',
    paraId: 2043,
    providers: {
      TraceLabs: 'wss://parachain-rpc.origin-trail.network'
    },
    text: 'OriginTrail'
  },
  {
    homepage: 'https://parallel.fi',
    info: 'parallel',
    paraId: 2012,
    providers: {
      OnFinality: 'wss://parallel.api.onfinality.io/public-ws', // https://github.com/polkadot-js/apps/issues/8355, then enabled in https://github.com/polkadot-js/apps/pull/8413, then broken in https://github.com/polkadot-js/apps/issues/8421, reenabled for PolkadotJS
      Parallel: 'wss://rpc.parallel.fi'
    },
    text: 'Parallel'
  },
  {
    homepage: 'https://pendulumchain.org/',
    info: 'pendulum',
    isUnreachable: true,
    paraId: 2094,
    providers: {
      PendulumChain: 'wss://rpc.pendulumchain.tech'
    },
    text: 'Pendulum'
  },
  {
    homepage: 'https://phala.network',
    info: 'phala',
    paraId: 2035,
    providers: {
      OnFinality: 'wss://phala.api.onfinality.io/public-ws',
      Phala: 'wss://api.phala.network/ws'
    },
    text: 'Phala Network'
  },
  {
    // https://github.com/polkadot-js/apps/issues/7620
    homepage: 'https://polkadex.trade/',
    info: 'polkadex',
    isUnreachable: true,
    paraId: 2040,
    providers: {
      // 'Polkadex Team': 'wss://mainnet.polkadex.trade/', // https://github.com/polkadot-js/apps/issues/7620
      // OnFinality: 'wss://polkadex.api.onfinality.io/public-ws' // https://github.com/polkadot-js/apps/issues/7620
    },
    text: 'Polkadex'
  },
  {
    homepage: 'https://subdao.network/',
    info: 'subdao',
    isUnreachable: true,
    paraId: 2018,
    providers: {
      SubDAO: 'wss://parachain-rpc.subdao.org'
    },
    text: 'SubDAO'
  },
  {
    homepage: 'http://subgame.org/',
    info: 'subgame',
    paraId: 2017,
    providers: {// SubGame: 'wss://gamma.subgame.org/' // https://github.com/polkadot-js/apps/pull/6761
    },
    text: 'SubGame Gamma'
  },
  {
    homepage: 'https://unique.network/',
    info: 'unique',
    paraId: 2037,
    providers: {
      OnFinality: 'wss://unique.api.onfinality.io/public-ws',
      'Unique America': 'wss://us-ws.unique.network/',
      'Unique Asia': 'wss://asia-ws.unique.network/',
      'Unique Europe': 'wss://eu-ws.unique.network/'
    },
    text: 'Unique Network'
  }
];

export const prodParasPolkadotCommon: EndpointOption[] = [
  {
    info: 'statemint',
    paraId: 1000,
    providers: {
      Dwellir: 'wss://statemint-rpc.dwellir.com',
      'Dwellir Tunisia': 'wss://statemint-rpc-tn.dwellir.com',
      OnFinality: 'wss://statemint.api.onfinality.io/public-ws',
      Parity: 'wss://statemint-rpc.polkadot.io',
      Pinknode: 'wss://public-rpc.pinknode.io/statemint',
      RadiumBlock: 'wss://statemint.public.curie.radiumblock.co/ws'
    },
    teleport: [-1],
    text: 'Statemint'
  },
  {
    info: 'polkadotCollectives',
    paraId: 1001,
    providers: {
      OnFinality: 'wss://collectives.api.onfinality.io/public-ws',
      Parity: 'wss://polkadot-collectives-rpc.polkadot.io'
    },
    teleport: [-1],
    text: 'Collectives'
  }
];

export const prodRelayPolkadot: EndpointOption = {
  dnslink: 'polkadot',
  genesisHash: POLKADOT_GENESIS,
  info: 'polkadot',
  linked: [
    ...prodParasPolkadotCommon,
    ...prodParasPolkadot
  ],
  providers: {
    // 'Geometry Labs': 'wss://polkadot.geometry.io/websockets', // https://github.com/polkadot-js/apps/pull/6746
    'Automata 1RPC': 'wss://1rpc.io/dot',
    'Dotters Net': 'wss://rpc.dotters.network/polkadot',
    Dwellir: 'wss://polkadot-rpc.dwellir.com',
    'Dwellir Tunisia': 'wss://polkadot-rpc-tn.dwellir.com',
    OnFinality: 'wss://polkadot.api.onfinality.io/public-ws',
    Parity: 'wss://rpc.polkadot.io',
    Pinknode: 'wss://public-rpc.pinknode.io/polkadot',
    RadiumBlock: 'wss://polkadot.public.curie.radiumblock.co/ws',
    'light client': 'light://substrate-connect/polkadot'
  },
  teleport: getTeleports(prodParasPolkadotCommon),
  text: 'Polkadot'
};
