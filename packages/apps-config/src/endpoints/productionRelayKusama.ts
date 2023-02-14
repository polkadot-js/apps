// Copyright 2017-2022 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { EndpointOption } from './types';

import { KUSAMA_GENESIS } from '../api/constants';

/* eslint-disable sort-keys */

// The available endpoints that will show in the dropdown. For the most part (with the exception of
// Polkadot) we try to keep this to live chains only, with RPCs hosted by the community/chain vendor
//   info: The chain logo name as defined in ../ui/logos/index.ts in namedLogos (this also needs to align with @polkadot/networks)
//   text: The text to display on the dropdown
//   providers: The actual hosted secure websocket endpoint
//
// IMPORTANT: Alphabetical based on text
export const prodParasKusama: EndpointOption[] = [
  {
    info: 'altair',
    homepage: 'https://centrifuge.io/altair',
    paraId: 2088,
    text: 'Altair',
    providers: {
      Centrifuge: 'wss://fullnode.altair.centrifuge.io',
      OnFinality: 'wss://altair.api.onfinality.io/public-ws'
    }
  },
  {
    info: 'bajun',
    homepage: 'https://ajuna.io',
    paraId: 2119,
    text: 'Bajun Network',
    providers: {
      AjunaNetwork: 'wss://rpc-parachain.bajun.network'
    }
  },
  {
    info: 'basilisk',
    homepage: 'https://bsx.fi',
    paraId: 2090,
    text: 'Basilisk',
    providers: {
      HydraDX: 'wss://rpc-01.basilisk.hydradx.io',
      OnFinality: 'wss://basilisk.api.onfinality.io/public-ws',
      Dwellir: 'wss://basilisk-rpc.dwellir.com'
    }
  },
  {
    info: 'bifrost',
    homepage: 'https://ksm.vtoken.io/?ref=polkadotjs',
    paraId: 2001,
    text: 'Bifrost (Kusama)',
    providers: {
      'Liebi 0': 'wss://bifrost-rpc.liebi.com/ws',
      'Liebi 1': 'wss://us.bifrost-rpc.liebi.com/ws',
      'Liebi 2': 'wss://eu.bifrost-rpc.liebi.com/ws',
      OnFinality: 'wss://bifrost-parachain.api.onfinality.io/public-ws',
      Dwellir: 'wss://bifrost-rpc.dwellir.com'
    }
  },
  {
    info: 'bitcountryPioneer',
    homepage: 'https://bit.country/?ref=polkadotjs',
    paraId: 2096,
    text: 'Bit.Country Pioneer',
    providers: {
      'Bit.Country': 'wss://pioneer-1-rpc.bit.country',
      OnFinality: 'wss://pioneer.api.onfinality.io/public-ws'
    }
  },
  {
    info: 'calamari',
    homepage: 'https://www.calamari.network/',
    paraId: 2084,
    text: 'Calamari',
    providers: {
      'Manta Network': 'wss://ws.calamari.systems/',
      OnFinality: 'wss://calamari.api.onfinality.io/public-ws',
      Dwellir: 'wss://calamari-rpc.dwellir.com'
    }
  },
  {
    info: 'shadow',
    homepage: 'https://crust.network/',
    paraId: 2012,
    text: 'Crust Shadow',
    providers: {
      Crust: 'wss://rpc-shadow.crust.network/'
    }
  },
  {
    info: 'crab',
    homepage: 'https://crab.network',
    paraId: 2105,
    text: 'Darwinia Crab Parachain',
    providers: {
      Crab: 'wss://crab-parachain-rpc.darwinia.network/'
    }
  },
  {
    info: 'dorafactory',
    homepage: 'https://dorafactory.org/kusama/',
    paraId: 2115,
    text: 'Dora Factory',
    providers: {
      DORA: 'wss://kusama.dorafactory.org'
    }
  },
  {
    info: 'genshiro',
    homepage: 'https://genshiro.equilibrium.io',
    isUnreachable: true, // https://github.com/polkadot-js/apps/pull/6761
    paraId: 2024,
    text: 'Genshiro',
    providers: {
      Equilibrium: 'wss://node.genshiro.io'
    }
  },
  {
    info: 'integritee',
    homepage: 'https://integritee.network',
    paraId: 2015,
    text: 'Integritee Network',
    providers: {
      Integritee: 'wss://kusama.api.integritee.network',
      OnFinality: 'wss://integritee-kusama.api.onfinality.io/public-ws'
    }
  },
  {
    info: 'kabocha',
    homepage: 'https://kabocha.network',
    paraId: 2113,
    text: 'Kabocha',
    providers: {
      JelliedOwl: 'wss://kabocha.jelliedowl.com'
    }
  },
  {
    info: 'karura',
    homepage: 'https://acala.network/karura/join-karura',
    paraId: 2000,
    text: 'Karura',
    providers: {
      'Acala Foundation 0': 'wss://karura-rpc-0.aca-api.network',
      'Acala Foundation 1': 'wss://karura-rpc-1.aca-api.network',
      'Acala Foundation 2': 'wss://karura-rpc-2.aca-api.network/ws',
      'Acala Foundation 3': 'wss://karura-rpc-3.aca-api.network/ws',
      'Polkawallet 0': 'wss://karura.polkawallet.io',
      OnFinality: 'wss://karura.api.onfinality.io/public-ws',
      Dwellir: 'wss://karura-rpc.dwellir.com'
    }
  },
  {
    info: 'khala',
    homepage: 'https://phala.network/',
    paraId: 2004,
    text: 'Khala Network',
    providers: {
      Phala: 'wss://khala-api.phala.network/ws',
      OnFinality: 'wss://khala.api.onfinality.io/public-ws',
      Dwellir: 'wss://khala-rpc.dwellir.com'
    }
  },
  {
    info: 'kico',
    homepage: 'https://dico.io/',
    paraId: 2107,
    text: 'KICO',
    providers: {
      'DICO Foundation': 'wss://rpc.kico.dico.io',
      'DICO Foundation 2': 'wss://rpc.api.kico.dico.io'
    }
  },
  {
    info: 'kilt',
    homepage: 'https://www.kilt.io/',
    paraId: 2086,
    text: 'KILT Spiritnet',
    providers: {
      'KILT Protocol': 'wss://spiritnet.kilt.io/',
      OnFinality: 'wss://spiritnet.api.onfinality.io/public-ws',
      Dwellir: 'wss://kilt-rpc.dwellir.com'
    }
  },
  {
    info: 'kintsugi',
    homepage: 'https://kintsugi.interlay.io/',
    paraId: 2092,
    text: 'Kintsugi BTC',
    providers: {
      'Kintsugi Labs': 'wss://api-kusama.interlay.io/parachain',
      OnFinality: 'wss://kintsugi.api.onfinality.io/public-ws',
      Dwellir: 'wss://kintsugi-rpc.dwellir.com'
    }
  },
  {
    info: 'kpron',
    homepage: 'http://apron.network/',
    isUnreachable: true,
    paraId: 2019,
    text: 'Kpron',
    providers: {
      Kpron: 'wss://kusama-kpron-rpc.apron.network/'
    }
  },
  {
    info: 'listen',
    homepage: 'https://listen.io/',
    paraId: 2118,
    text: 'Listen Network',
    providers: {
      'Listen Foundation 1': 'wss://rpc.mainnet.listen.io',
      'Listen Foundation 2': 'wss://wss.mainnet.listen.io'
    }
  },
  {
    info: 'litmus',
    homepage: 'https://kusama-crowdloan.litentry.com',
    paraId: 2106,
    isUnreachable: false,
    text: 'Litmus',
    providers: {
      Litentry: 'wss://rpc.litmus-parachain.litentry.io'
    }
  },
  {
    info: 'loomNetwork',
    isUnreachable: true, // https://github.com/polkadot-js/apps/issues/5888
    homepage: 'https://loomx.io/',
    paraId: 2080,
    text: 'Loom Network',
    providers: {
      LoomNetwork: 'wss://kusama.dappchains.com'
    }
  },
  {
    info: 'mangata',
    homepage: 'https://mangata.finance',
    paraId: 2110,
    text: 'Mangata',
    providers: {
      Mangata: 'wss://prod-kusama-collator-01.mangatafinance.cloud',
      OnFinality: 'wss://mangata-x.api.onfinality.io/public-ws'
    }
  },
  {
    info: 'mars',
    homepage: 'https://www.aresprotocol.io/mars',
    paraId: 2008,
    text: 'Mars',
    providers: {
      AresProtocol: 'wss://wss.mars.aresprotocol.io'
    }
  },
  {
    info: 'moonriver',
    homepage: 'https://moonbeam.network/networks/moonriver/',
    paraId: 2023,
    text: 'Moonriver',
    providers: {
      'Moonbeam Foundation': 'wss://wss.api.moonriver.moonbeam.network',
      Blast: 'wss://moonriver.public.blastapi.io',
      Dwellir: 'wss://moonriver-rpc.dwellir.com',
      OnFinality: 'wss://moonriver.api.onfinality.io/public-ws'
    }
  },
  {
    info: 'heiko',
    homepage: 'https://parallel.fi',
    paraId: 2085,
    text: 'Parallel Heiko',
    providers: {
      OnFinality: 'wss://parallel-heiko.api.onfinality.io/public-ws',
      Parallel: 'wss://heiko-rpc.parallel.fi',
      Dwellir: 'wss://heiko-rpc.dwellir.com'
    }
  },
  {
    info: 'picasso',
    homepage: 'https://picasso.composable.finance/',
    paraId: 2087,
    text: 'Picasso',
    providers: {
      Composable: 'wss://picasso-rpc.composable.finance',
      Dwellir: 'wss://picasso-rpc.dwellir.com'
    }
  },
  {
    info: 'pichiu',
    homepage: 'https://kylin.network/',
    paraId: 2102,
    text: 'Pichiu',
    providers: {
      'Kylin Network': 'wss://kusama.kylin-node.co.uk'
    }
  },
  {
    info: 'polkasmith',
    isUnreachable: true, // https://github.com/polkadot-js/apps/issues/6595
    homepage: 'https://polkasmith.polkafoundry.com/',
    paraId: 2009,
    text: 'PolkaSmith by PolkaFoundry',
    providers: {
      PolkaSmith: 'wss://wss-polkasmith.polkafoundry.com'
    }
  },
  {
    info: 'quartz',
    homepage: 'https://unique.network/',
    paraId: 2095,
    text: 'QUARTZ by UNIQUE',
    providers: {
      Unique: 'wss://quartz.unique.network',
      OnFinality: 'wss://quartz.api.onfinality.io/public-ws',
      'Unique Europe': 'wss://eu-ws-quartz.unique.network',
      'Unique US': 'wss://us-ws-quartz.unique.network'
    }
  },
  {
    info: 'robonomics',
    homepage: 'http://robonomics.network/',
    paraId: 2048,
    text: 'Robonomics',
    providers: {
      Airalab: 'wss://kusama.rpc.robonomics.network/',
      OnFinality: 'wss://robonomics.api.onfinality.io/public-ws'
    }
  },
  {
    info: 'sakura',
    homepage: 'https://clover.finance/',
    isUnreachable: true,
    paraId: 2016,
    text: 'Sakura',
    providers: {
      Clover: 'wss://api-sakura.clover.finance'
    }
  },
  {
    info: 'shiden',
    homepage: 'https://shiden.astar.network/',
    paraId: 2007,
    text: 'Shiden',
    providers: {
      StakeTechnologies: 'wss://rpc.shiden.astar.network',
      OnFinality: 'wss://shiden.api.onfinality.io/public-ws',
      Dwellir: 'wss://shiden-rpc.dwellir.com'
    }
  },
  {
    info: 'shiden',
    homepage: 'https://shiden.astar.network/',
    paraId: 2120,
    text: 'Shiden Crowdloan 2',
    isUnreachable: true,
    providers: {
      StakeTechnologies: 'wss://rpc.shiden.astar.network'
    }
  },
  {
    info: 'sora_ksm',
    homepage: 'https://sora.org/',
    paraId: 2011,
    text: 'SORA Kusama Parachain',
    providers: {
      Soramitsu: 'wss://ws.parachain-collator-1.c1.sora2.soramitsu.co.jp'
    }
  },
  {
    info: 'subgame',
    homepage: 'http://subgame.org/',
    paraId: 2018,
    text: 'SubGame Gamma',
    providers: {
      SubGame: 'wss://gamma.subgame.org/'
    }
  },
  {
    info: 'subsocialX',
    homepage: 'https://subsocial.network/',
    paraId: 2100,
    text: 'SubsocialX',
    providers: {
      Dappforce: 'wss://para.subsocial.network'
    }
  },
  {
    info: 'tanganika',
    homepage: 'https://www.datahighway.com/',
    paraId: 2116,
    text: 'Tanganika',
    providers: {
      DataHighway: 'wss://tanganika.datahighway.com'
    }
  },
  {
    info: 'trustbase',
    isUnreachable: true, // no providers (yet)
    homepage: 'https://trustbase.network/',
    paraId: 2078,
    text: 'TrustBase',
    providers: {}
  },
  {
    info: 'turing',
    homepage: 'https://oak.tech',
    paraId: 2114,
    text: 'Turing Network',
    providers: {
      OAK: 'wss://rpc.turing.oak.tech',
      OnFinality: 'wss://turing.api.onfinality.io/public-ws',
      Dwellir: 'wss://turing-rpc.dwellir.com'
    }
  },
  {
    info: 'unorthodox',
    homepage: 'https://standard.tech/',
    paraId: 2094,
    text: 'Unorthodox',
    providers: {
      'Standard Protocol': 'wss://rpc.kusama.standard.tech'
    }
  },
  {
    info: 'zeitgeist',
    homepage: 'https://zeitgeist.pm',
    paraId: 2101,
    text: 'Zeitgeist',
    providers: {
      ZeitgeistPM: 'wss://rpc-0.zeitgeist.pm',
      Dwellir: 'wss://zeitgeist-rpc.dwellir.com',
      OnFinality: 'wss://zeitgeist.api.onfinality.io/public-ws'
    }
  }
];

export const prodParasKusamaCommon: EndpointOption[] = [
  {
    info: 'statemine',
    paraId: 1000,
    text: 'Statemine',
    providers: {
      Parity: 'wss://statemine-rpc.polkadot.io',
      OnFinality: 'wss://statemine.api.onfinality.io/public-ws',
      Dwellir: 'wss://statemine-rpc.dwellir.com'
    },
    teleport: [-1]
  },
  {
    info: 'encointer',
    homepage: 'https://encointer.org/',
    paraId: 1001,
    text: 'Encointer Network',
    providers: {
      'Encointer Association': 'wss://kusama.api.encointer.org',
      OnFinality: 'wss://encointer.api.onfinality.io/public-ws'
    },
    teleport: [-1]
  }
];

export const prodRelayKusama: EndpointOption = {
  dnslink: 'kusama',
  genesisHash: KUSAMA_GENESIS,
  info: 'kusama',
  text: 'Kusama',
  providers: {
    Parity: 'wss://kusama-rpc.polkadot.io',
    OnFinality: 'wss://kusama.api.onfinality.io/public-ws',
    Dwellir: 'wss://kusama-rpc.dwellir.com',
    RadiumBlock: 'wss://kusama.public.curie.radiumblock.co/ws',
    // 'Geometry Labs': 'wss://kusama.geometry.io/websockets', // https://github.com/polkadot-js/apps/pull/6746
    'light client': 'light://substrate-connect/kusama'
  },
  teleport: [1000, 1001],
  linked: [
    ...prodParasKusamaCommon,
    ...prodParasKusama
  ]
};
