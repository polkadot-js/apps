// Copyright 2017-2023 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { EndpointOption } from './types';

import { KUSAMA_GENESIS } from '../api/constants';
import { chainsAbandPNG, chainsKusamaSVG, chainsTinkerPNG, chainsTuringPNG } from '../ui/logos/chains';
import { nodesAjunaPNG, nodesBridgeHubBlackSVG, nodesStatemineSVG, nodesZeitgeistPNG } from '../ui/logos/nodes';
import { getTeleports } from './util';

// The available endpoints that will show in the dropdown. For the most part (with the exception of
// Polkadot) we try to keep this to live chains only, with RPCs hosted by the community/chain vendor
//   info: The chain logo name as defined in ../ui/logos/index.ts in namedLogos (this also needs to align with @polkadot/networks)
//   text: The text to display on the dropdown
//   providers: The actual hosted secure websocket endpoint
//
// IMPORTANT: Alphabetical based on text
export const prodParasKusama: EndpointOption[] = [
  {
    homepage: 'https://a.band',
    info: 'aband',
    paraId: 2257,
    providers: {
      'Aband DAO': 'wss://rpc-parachain.a.band'
    },
    text: 'Aband',
    uiColor: '#7358ff',
    uiLogo: chainsAbandPNG
  },
  {
    homepage: 'https://centrifuge.io/altair',
    info: 'altair',
    paraId: 2088,
    providers: {
      Centrifuge: 'wss://fullnode.altair.centrifuge.io',
      OnFinality: 'wss://altair.api.onfinality.io/public-ws'
    },
    text: 'Altair',
    uiColor: '#ffb700'
  },
  {
    homepage: 'https://pendulumchain.org/amplitude',
    info: 'amplitude',
    paraId: 2124,
    providers: {
      Dwellir: 'wss://amplitude-rpc.dwellir.com',
      PendulumChain: 'wss://rpc-amplitude.pendulumchain.tech'
    },
    text: 'Amplitude',
    uiColor: '#5DEFA7'
  },
  {
    homepage: 'https://ajuna.io',
    info: 'bajun',
    paraId: 2119,
    providers: {
      AjunaNetwork: 'wss://rpc-parachain.bajun.network',
      Dwellir: 'wss://bajun-rpc.dwellir.com',
      OnFinality: 'wss://bajun.api.onfinality.io/public-ws'
    },
    text: 'Bajun Network',
    uiColor: '#161212',
    uiLogo: nodesAjunaPNG
  },
  {
    homepage: 'https://app.basilisk.cloud',
    info: 'basilisk',
    paraId: 2090,
    providers: {
      Basilisk: 'wss://rpc.basilisk.cloud',
      Dwellir: 'wss://basilisk-rpc.dwellir.com'
    },
    text: 'Basilisk',
    uiColor: '#49E49F'
  },
  {
    homepage: 'https://ksm.vtoken.io/?ref=polkadotjs',
    info: 'bifrost',
    paraId: 2001,
    providers: {
      Dwellir: 'wss://bifrost-rpc.dwellir.com',
      Liebi: 'wss://bifrost-rpc.liebi.com/ws',
      OnFinality: 'wss://bifrost-parachain.api.onfinality.io/public-ws'
    },
    text: 'Bifrost'
  },
  {
    homepage: 'https://bit.country/?ref=polkadotjs',
    info: 'bitcountryPioneer',
    paraId: 2096,
    providers: {
      OnFinality: 'wss://pioneer.api.onfinality.io/public-ws'
    },
    text: 'Bit.Country Pioneer',
    uiColor: '#000000'
  },
  {
    homepage: 'https://www.calamari.network/',
    info: 'calamari',
    paraId: 2084,
    providers: {
      'Manta Network': 'wss://ws.calamari.systems/'
    },
    text: 'Calamari',
    uiColor: '#000000'
  },
  {
    homepage: 'https://crust.network/',
    info: 'shadow',
    paraId: 2012,
    providers: {
      Crust: 'wss://rpc-shadow.crust.network/'
    },
    text: 'Crust Shadow'
  },
  {
    homepage: 'https://crust.network/',
    info: 'shadow',
    isUnreachable: true,
    paraId: 2225,
    providers: {
      // also duplicated right above (hence marked unreachable)
      // Crust: 'wss://rpc-shadow.crust.network/' // https://github.com/polkadot-js/apps/issues/8355
    },
    text: 'Crust Shadow 2'
  },
  {
    homepage: 'https://ipci.io',
    info: 'ipci',
    paraId: 2222,
    providers: {
      Airalab: 'wss://kusama.rpc.ipci.io'
    },
    text: 'DAO IPCI'
  },
  {
    homepage: 'https://crab.network',
    info: 'crab',
    paraId: 2105,
    providers: {
      'Darwinia Network': 'wss://crab-parachain-rpc.darwinia.network/'
    },
    text: 'Darwinia Crab'
  },
  {
    homepage: 'https://dorafactory.org/kusama/',
    info: 'dorafactory',
    paraId: 2115,
    providers: {
      DORA: 'wss://kusama.dorafactory.org'
    },
    text: 'Dora Factory'
  },
  {
    homepage: 'https://genshiro.equilibrium.io',
    info: 'genshiro',
    isUnreachable: true,
    paraId: 2024,
    providers: {
      Equilibrium: 'wss://node.genshiro.io'
    },
    text: 'Genshiro'
  },
  {
    homepage: 'https://genshiro.equilibrium.io',
    info: 'genshiro',
    isUnreachable: true,
    paraId: 2226,
    providers: {
      Equilibrium: 'wss://node.genshiro.io'
    },
    text: 'Genshiro crowdloan 2'
  },
  {
    homepage: 'https://gmordie.com',
    info: 'gm',
    paraId: 2123,
    providers: {
      // GMorDieDAO: 'wss://kusama.gmordie.com', // https://github.com/polkadot-js/apps/issues/8457
      'GM Intern': 'wss://intern.gmordie.com',
      // TerraBioDAO: 'wss://ws-node-gm.terrabiodao.org', // https://github.com/polkadot-js/apps/issues/8867
      Leemo: 'wss://leemo.gmordie.com',
      'bLd Nodes': 'wss://ws.gm.bldnodes.org',
      'light client': 'light://substrate-connect/kusama/gm'
    },
    text: 'GM',
    uiColor: '#f47b36'
  },
  {
    homepage: 'https://imbue.network',
    info: 'imbue',
    paraId: 2121,
    providers: {
      'Imbue Network': 'wss://imbue-kusama.imbue.network'
    },
    text: 'Imbue Network'
  },
  {
    homepage: 'https://integritee.network',
    info: 'integritee',
    paraId: 2015,
    providers: {
      Integritee: 'wss://kusama.api.integritee.network',
      OnFinality: 'wss://integritee-kusama.api.onfinality.io/public-ws'
    },
    text: 'Integritee Network'
  },
  {
    homepage: 'https://invarch.network/tinkernet',
    info: 'tinker',
    paraId: 2125,
    providers: {
      // 'InvArch Team': 'wss://tinker.invarch.network', // https://github.com/polkadot-js/apps/issues/8623
      OnFinality: 'wss://invarch-tinkernet.api.onfinality.io/public-ws',
      'light client': 'light://substrate-connect/kusama/tinkernet'
    },
    text: 'InvArch Tinkernet',
    uiColor: '#161616',
    uiLogo: chainsTinkerPNG
  },
  {
    homepage: 'https://kabocha.network',
    info: 'kabocha',
    paraId: 2113,
    providers: {
      JelliedOwl: 'wss://kabocha.jelliedowl.net'
    },
    text: 'Kabocha',
    uiColor: 'repeating-radial-gradient(black, black 4px, yellow 5px)'
  },
  {
    homepage: 'https://acala.network/karura/join-karura',
    info: 'karura',
    paraId: 2000,
    providers: {
      'Acala Foundation 0': 'wss://karura-rpc-0.aca-api.network',
      'Acala Foundation 1': 'wss://karura-rpc-1.aca-api.network',
      'Acala Foundation 2': 'wss://karura-rpc-2.aca-api.network/ws',
      'Acala Foundation 3': 'wss://karura-rpc-3.aca-api.network/ws',
      Dwellir: 'wss://karura-rpc.dwellir.com',
      OnFinality: 'wss://karura.api.onfinality.io/public-ws',
      'Polkawallet 0': 'wss://karura.polkawallet.io'
    },
    text: 'Karura',
    uiColor: '#ff4c3b'
  },
  {
    homepage: 'https://phala.network/',
    info: 'khala',
    paraId: 2004,
    providers: {
      Dwellir: 'wss://khala-rpc.dwellir.com',
      OnFinality: 'wss://khala.api.onfinality.io/public-ws',
      Phala: 'wss://khala-api.phala.network/ws',
      Pinknode: 'wss://public-rpc.pinknode.io/khala'
    },
    text: 'Khala Network',
    uiColor: '#03f3f3'
  },
  {
    homepage: 'https://dico.io/',
    info: 'kico',
    paraId: 2107,
    providers: {
      'DICO Foundation': 'wss://rpc.kico.dico.io'
      // 'DICO Foundation 2': 'wss://rpc.api.kico.dico.io' // https://github.com/polkadot-js/apps/issues/8203

    },
    text: 'KICO',
    uiColor: '#29B58D'
  },
  {
    homepage: 'https://dico.io/',
    info: 'kico 2',
    paraId: 2235,
    providers: {
      // 'DICO Foundation': 'wss://rpc.kico2.dico.io' // https://github.com/polkadot-js/apps/issues/8415
    },
    text: 'KICO 2',
    uiColor: '#29B58D'
  },
  {
    homepage: 'https://kintsugi.interlay.io/',
    info: 'kintsugi',
    paraId: 2092,
    providers: {
      'Kintsugi Labs': 'wss://api-kusama.interlay.io/parachain',
      OnFinality: 'wss://kintsugi.api.onfinality.io/public-ws'
    },
    text: 'Kintsugi BTC'
  },
  {
    homepage: 'http://apron.network/',
    info: 'kpron',
    isUnreachable: true,
    paraId: 2019,
    providers: {
      Kpron: 'wss://kusama-kpron-rpc.apron.network/'
    },
    text: 'Kpron',
    uiColor: 'linear-gradient(45deg, #0099F7 0%, #2E49EB 100%)'
  },
  {
    homepage: 'https://listen.io/',
    info: 'listen',
    paraId: 2118,
    providers: {
      'Listen Foundation 1': 'wss://rpc.mainnet.listen.io',
      'Listen Foundation 2': 'wss://wss.mainnet.listen.io'
    },
    text: 'Listen Network',
    uiColor: '#FFAD0A'
  },
  {
    homepage: 'https://kusama-crowdloan.litentry.com',
    info: 'litmus',
    isUnreachable: false,
    paraId: 2106,
    providers: {
      Litentry: 'wss://rpc.litmus-parachain.litentry.io'
    },
    text: 'Litmus'
  },
  {
    // https://github.com/polkadot-js/apps/issues/5888
    homepage: 'https://loomx.io/',
    info: 'loomNetwork',
    isUnreachable: true,
    paraId: 2080,
    providers: {
      LoomNetwork: 'wss://kusama.dappchains.com'
    },
    text: 'Loom Network'
  },
  {
    homepage: 'https://luhn.network/',
    info: 'luhn',
    paraId: 2232,
    providers: {
      'Hashed Systems': 'wss://c1.luhn.network'
    },
    text: 'Luhn Network',
    uiColor: '#2F8E85'
  },
  {
    homepage: 'https://mangata.finance',
    info: 'mangata',
    paraId: 2110,
    providers: {
      Mangata: 'wss://prod-kusama-collator-01.mangatafinance.cloud',
      OnFinality: 'wss://mangata-x.api.onfinality.io/public-ws'
    },
    text: 'Mangata',
    uiColor: '#030408'
  },
  {
    homepage: 'https://www.aresprotocol.io/mars',
    info: 'mars',
    paraId: 2008,
    providers: {
      // AresProtocol: 'wss://wss.mars.aresprotocol.io' // https://github.com/polkadot-js/apps/issues/8937
    },
    text: 'Mars'
  },
  {
    homepage: 'https://moonbeam.network/networks/moonriver/',
    info: 'moonriver',
    paraId: 2023,
    providers: {
      Blast: 'wss://moonriver.public.blastapi.io',
      'Moonbeam Foundation': 'wss://wss.api.moonriver.moonbeam.network',
      OnFinality: 'wss://moonriver.api.onfinality.io/public-ws',
      UnitedBloc: 'wss://moonriver.unitedbloc.com:2001'
    },
    text: 'Moonriver'
  },
  {
    homepage: 'https://parallel.fi',
    info: 'heiko',
    paraId: 2085,
    providers: {
      OnFinality: 'wss://parallel-heiko.api.onfinality.io/public-ws',
      // https://github.com/polkadot-js/apps/issues/8355, then enabled in https://github.com/polkadot-js/apps/pull/8413, then broken in https://github.com/polkadot-js/apps/issues/8421, reenabled for PolkadotJS
      Parallel: 'wss://heiko-rpc.parallel.fi'
    },
    text: 'Parallel Heiko'
  },
  {
    homepage: 'https://parallel.fi',
    info: 'heiko',
    isUnreachable: true,
    paraId: 2126,
    providers: {},
    text: 'Parallel Heiko 2'
  },
  {
    homepage: 'https://picasso.composable.finance/',
    info: 'picasso',
    paraId: 2087,
    providers: {
      Composable: 'wss://rpc.composablenodes.tech'
    },
    text: 'Picasso',
    uiColor: '#000000'
  },
  {
    homepage: 'https://kylin.network/',
    info: 'pichiu',
    paraId: 2102,
    providers: {
      'Kylin Network': 'wss://kusama.kylin-node.co.uk',
      OnFinality: 'wss://pichiu.api.onfinality.io/public-ws' // https://github.com/polkadot-js/apps/issues/8867, reenabled for PolkadotJS
    },
    text: 'Pichiu'
  },
  {
    homepage: 'https://polkasmith.polkafoundry.com/',
    info: 'polkasmith',
    paraId: 2009,
    providers: {
      // PolkaSmith: 'wss://wss-polkasmith.polkafoundry.com' // https://github.com/polkadot-js/apps/issues/6595
    },
    text: 'PolkaSmith by PolkaFoundry'
  },
  {
    homepage: 'https://unique.network/',
    info: 'quartz',
    paraId: 2095,
    providers: {
      OnFinality: 'wss://quartz.api.onfinality.io/public-ws', // https://github.com/polkadot-js/apps/issues/8436 re-added added previously removed, still unreachable, reenabled for PolkadotJS
      'Unique America': 'wss://us-ws-quartz.unique.network',
      'Unique Asia': 'wss://asia-ws-quartz.unique.network',
      'Unique Europe': 'wss://eu-ws-quartz.unique.network'
    },
    text: 'QUARTZ by UNIQUE',
    uiColor: '#FF4D6A'
  },
  {
    homepage: 'https://riodefi.com',
    info: 'riodefi',
    paraId: 2227,
    providers: {
      RioProtocol: 'wss://rio-kusama.riocorenetwork.com'
    },
    text: 'RioDeFi',
    uiColor: '#4E7AED'
  },
  {
    homepage: 'http://robonomics.network/',
    info: 'robonomics',
    paraId: 2048,
    providers: {
      Airalab: 'wss://kusama.rpc.robonomics.network/',
      Leemo: 'wss://robonomics.leemo.me',
      OnFinality: 'wss://robonomics.api.onfinality.io/public-ws',
      Samsara: 'wss://robonomics.0xsamsara.com'
    },
    text: 'Robonomics'
  },
  {
    homepage: 'http://robonomics.network/',
    info: 'robonomics',
    isUnreachable: true,
    paraId: 2240,
    providers: {
      Airalab: 'wss://kusama.rpc.robonomics.network/',
      Leemo: 'wss://robonomics.leemo.me',
      OnFinality: 'wss://robonomics.api.onfinality.io/public-ws',
      Samsara: 'wss://robonomics.0xsamsara.com'
    },
    text: 'Robonomics 2'
  },
  {
    homepage: 'https://clover.finance/',
    info: 'sakura',
    isUnreachable: true,
    paraId: 2016,
    providers: {
      Clover: 'wss://api-sakura.clover.finance'
    },
    text: 'Sakura',
    uiColor: '#ff5995'
  },
  {
    homepage: 'https://shiden.astar.network/',
    info: 'shiden',
    paraId: 2007,
    providers: {
      Blast: 'wss://shiden.public.blastapi.io',
      Dwellir: 'wss://shiden-rpc.dwellir.com',
      OnFinality: 'wss://shiden.api.onfinality.io/public-ws',
      Pinknode: 'wss://public-rpc.pinknode.io/shiden',
      StakeTechnologies: 'wss://rpc.shiden.astar.network',
      'light client': 'light://substrate-connect/kusama/shiden'
    },
    text: 'Shiden'
  },
  {
    homepage: 'https://shiden.astar.network/',
    info: 'shiden',
    isUnreachable: true,
    paraId: 2120,
    providers: {
      StakeTechnologies: 'wss://rpc.shiden.astar.network'
    },
    text: 'Shiden Crowdloan 2',
    uiColor: '#1b6dc1d9'
  },
  {
    homepage: 'https://icenetwork.io/snow',
    info: 'snow',
    isUnreachable: false,
    paraId: 2129,
    providers: {
      IceNetwork: 'wss://snow-rpc.icenetwork.io'
    },
    text: 'SNOW Network'
  },
  {
    homepage: 'https://sora.org/',
    info: 'sora_ksm',
    paraId: 2011,
    providers: {
      Soramitsu: 'wss://ws.parachain-collator-1.c1.sora2.soramitsu.co.jp'
    },
    text: 'SORA',
    uiColor: '#2D2926'
  },
  {
    homepage: 'http://subgame.org/',
    info: 'subgame',
    isUnreachable: true, // https://github.com/polkadot-js/apps/issues/7982
    paraId: 2018,
    providers: {
      SubGame: 'wss://gamma.subgame.org/'
    },
    text: 'SubGame Gamma',
    uiColor: '#EB027D'
  },
  {
    homepage: 'https://subsocial.network/',
    info: 'subsocialX',
    paraId: 2100,
    providers: {
      'Dappforce 1': 'wss://para.subsocial.network'
    },
    text: 'SubsocialX'
  },
  {
    homepage: 'https://zero.io',
    info: 'zero',
    paraId: 2236,
    providers: {
      ZeroNetwork: 'wss://rpc-1.kusama.node.zero.io'
    },
    text: 'subzero',
    uiColor: '#000000'
  },
  {
    homepage: 'https://www.datahighway.com/',
    info: 'tanganika',
    paraId: 2116,
    providers: {
      DataHighway: 'wss://tanganika.datahighway.com'
    },
    text: 'Tanganika',
    uiColor: 'linear-gradient(-90deg, #9400D3 0%, #5A5CA9 50%, #00BFFF 100%)'
  },
  {
    homepage: 'https://trustbase.network/',
    info: 'trustbase',
    isUnreachable: true,
    paraId: 2078,
    providers: {},
    text: 'TrustBase'
  },
  {
    homepage: 'https://oak.tech',
    info: 'turing',
    paraId: 2114,
    providers: {
      Dwellir: 'wss://turing-rpc.dwellir.com',
      OAK: 'wss://rpc.turing.oak.tech'
    },
    text: 'Turing Network',
    uiColor: '#A8278C',
    uiLogo: chainsTuringPNG
  },
  {
    homepage: 'https://standard.tech/',
    info: 'unorthodox',
    paraId: 2094,
    providers: {
      // 'Standard Protocol': 'wss://rpc.kusama.standard.tech' // https://github.com/polkadot-js/apps/issues/8525
    },
    text: 'Unorthodox'
  },
  {
    homepage: 'https://zeitgeist.pm',
    info: 'zeitgeist',
    paraId: 2101,
    providers: {
      // ZeitgeistPM: 'wss://rpc-0.zeitgeist.pm', // https://github.com/polkadot-js/apps/issues/7982
      Dwellir: 'wss://zeitgeist-rpc.dwellir.com',
      OnFinality: 'wss://zeitgeist.api.onfinality.io/public-ws'
    },
    text: 'Zeitgeist',
    uiColor: 'linear-gradient(180deg, rgba(32,90,172,1) 0%, rgba(26,72,138,1) 50%, rgba(13,36,69,1) 100%)',
    uiLogo: nodesZeitgeistPNG
  }
];

export const prodParasKusamaCommon: EndpointOption[] = [
  {
    info: 'statemine',
    paraId: 1000,
    providers: {
      Dwellir: 'wss://statemine-rpc.dwellir.com',
      'Dwellir Tunisia': 'wss://statemine-rpc-tn.dwellir.com',
      OnFinality: 'wss://statemine.api.onfinality.io/public-ws',
      Parity: 'wss://statemine-rpc.polkadot.io',
      Pinknode: 'wss://public-rpc.pinknode.io/statemine',
      RadiumBlock: 'wss://statemine.public.curie.radiumblock.co/ws'
    },
    teleport: [-1],
    text: 'Statemine',
    uiColor: '#113911',
    uiLogo: nodesStatemineSVG
  },
  {
    homepage: 'https://encointer.org/',
    info: 'encointer',
    paraId: 1001,
    providers: {
      'Encointer Association': 'wss://kusama.api.encointer.org',
      OnFinality: 'wss://encointer.api.onfinality.io/public-ws' // https://github.com/polkadot-js/apps/issues/8553, reenabled for Polkadot JS
    },
    teleport: [-1],
    text: 'Encointer Network'
  },
  {
    info: 'kusamaBridgeHub',
    paraId: 1002,
    providers: {
      Parity: 'wss://kusama-bridge-hub-rpc.polkadot.io'
    },
    text: 'BridgeHub',
    uiLogo: nodesBridgeHubBlackSVG
  }
];

export const prodRelayKusama: EndpointOption = {
  dnslink: 'kusama',
  genesisHash: KUSAMA_GENESIS,
  info: 'kusama',
  linked: [
    ...prodParasKusamaCommon,
    ...prodParasKusama
  ],
  providers: {
    // 'Geometry Labs': 'wss://kusama.geometry.io/websockets', // https://github.com/polkadot-js/apps/pull/6746
    'Automata 1RPC': 'wss://1rpc.io/ksm',
    'Dotters Net': 'wss://rpc.dotters.network/kusama',
    Dwellir: 'wss://kusama-rpc.dwellir.com',
    'Dwellir Tunisia': 'wss://kusama-rpc-tn.dwellir.com',
    OnFinality: 'wss://kusama.api.onfinality.io/public-ws',
    Parity: 'wss://kusama-rpc.polkadot.io',
    Pinknode: 'wss://public-rpc.pinknode.io/kusama',
    RadiumBlock: 'wss://kusama.public.curie.radiumblock.co/ws',
    'light client': 'light://substrate-connect/kusama'
  },
  teleport: getTeleports(prodParasKusamaCommon),
  text: 'Kusama',
  uiColor: '#000',
  uiLogo: chainsKusamaSVG
};
