// Copyright 2017-2021 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { TFunction } from 'i18next';
import type { EndpointOption } from './types';

import { KUSAMA_GENESIS } from '../api/constants';

/* eslint-disable sort-keys */

// The available endpoints that will show in the dropdown. For the most part (with the exception of
// Polkadot) we try to keep this to live chains only, with RPCs hosted by the community/chain vendor
//   info: The chain logo name as defined in ../ui/logos/index.ts in namedLogos (this also needs to align with @polkadot/networks)
//   text: The text to display on the dropdown
//   value: The actual hosted secure websocket endpoint
export function createKusama (t: TFunction): EndpointOption {
  return {
    dnslink: 'kusama',
    genesisHash: KUSAMA_GENESIS,
    info: 'kusama',
    text: t('rpc.kusama.parity', 'Kusama', { ns: 'apps-config' }),
    providers: {
      Parity: 'wss://kusama-rpc.polkadot.io',
      OnFinality: 'wss://kusama.api.onfinality.io/public-ws',
      'Patract Elara': 'wss://pub.elara.patract.io/kusama',
      'Geometry Labs': 'wss://kusama.geometry.io/websockets',
      // Dwellir: 'wss://kusama-rpc.dwellir.com', // https://github.com/polkadot-js/apps/issues/6427
      'light client': 'light://substrate-connect/kusama'
      // Pinknode: 'wss://rpc.pinknode.io/kusama/explorer' // https://github.com/polkadot-js/apps/issues/5721
    },
    teleport: [1000],
    linked: [
      // (1) all system parachains (none available yet)
      // ...
      // (2) all common good parachains
      {
        info: 'statemine',
        paraId: 1000,
        text: t('rpc.kusama.statemine', 'Statemine', { ns: 'apps-config' }),
        providers: {
          Parity: 'wss://kusama-statemine-rpc.paritytech.net',
          OnFinality: 'wss://statemine.api.onfinality.io/public-ws'
          // 'Patract Elara': 'wss://pub.elara.patract.io/statemine' // See https://github.com/polkadot-js/apps/issues/6292
        },
        teleport: [-1]
      },
      /// (3) parachains with id, see Rococo (info here maps to the actual "named icon")
      //
      // NOTE: Added alphabetical based on chain name
      {
        info: 'altair',
        homepage: 'https://centrifuge.io/altair',
        paraId: 2088,
        text: t('rpc.kusama.altair', 'Altair', { ns: 'apps-config' }),
        providers: {
          Centrifuge: 'wss://fullnode.altair.centrifuge.io',
          OnFinality: 'wss://altair.api.onfinality.io/public-ws'
        }
      },
      {
        info: 'basilisk',
        homepage: 'https://bsx.fi',
        paraId: 2090,
        text: t('rpc.kusama.basilisk', 'Basilisk', { ns: 'apps-config' }),
        providers: {
          HydraDX: 'wss://rpc-01.basilisk.hydradx.io',
          OnFinality: 'wss://basilisk.api.onfinality.io/public-ws'
        }
      },
      {
        info: 'bifrost',
        homepage: 'https://ksm.vtoken.io/?ref=polkadotjs',
        paraId: 2001,
        text: t('rpc.kusama.bifrost', 'Bifrost (Kusama)', { ns: 'apps-config' }),
        providers: {
          Liebi: 'wss://bifrost-rpc.liebi.com/ws',
          OnFinality: 'wss://bifrost-parachain.api.onfinality.io/public-ws',
          'Patract Elara': 'wss://pub.elara.patract.io/bifrost'
        }
      },
      {
        info: 'bitcountryPioneer',
        homepage: 'https://bit.country/?ref=polkadotjs',
        paraId: 2096,
        text: t('rpc.kusama.pioneerNetwork', 'Bit.Country Pioneer', { ns: 'apps-config' }),
        providers: {
          'Bit.Country': 'wss://pioneer-1-rpc.bit.country'
        }
      },
      {
        info: 'calamari',
        homepage: 'https://www.calamari.network/',
        paraId: 2084,
        text: t('rpc.calamari.systems', 'Calamari', { ns: 'apps-config' }),
        providers: {
          'Manta Network 0': 'wss://falafel.calamari.systems/',
          'Manta Network 1': 'wss://fritti.calamari.systems/',
          'Manta Network 2': 'wss://smoothie.calamari.systems/',
          OnFinality: 'wss://calamari.api.onfinality.io/public-ws'
        }
      },
      {
        info: 'shadow',
        homepage: 'https://crust.network/',
        paraId: 2012,
        text: t('rpc.kusama.shadow', 'Crust Shadow', { ns: 'apps-config' }),
        providers: {
          Crust: 'wss://shadow.crust.network/'
        }
      },
      {
        info: 'encointer_canary',
        homepage: 'https://encointer.org/',
        isUnreachable: true,
        paraId: 2014,
        text: t('rpc.kusama.encointer', 'Encointer Canary', { ns: 'apps-config' }),
        providers: {
          Encointer: 'wss://canary.encointer.org'
        }
      },
      {
        info: 'genshiro',
        homepage: 'https://genshiro.equilibrium.io',
        paraId: 2024,
        text: t('rpc.kusama.genshiro', 'Genshiro', { ns: 'apps-config' }),
        providers: {
          Equilibrium: 'wss://node.genshiro.io'
        }
      },
      {
        info: 'integritee',
        homepage: 'https://integritee.network',
        paraId: 2015,
        text: t('rpc.kusama.integritee', 'Integritee Network', { ns: 'apps-config' }),
        providers: {
          Integritee: 'wss://kusama.api.integritee.network'
        }
      },
      {
        info: 'karura',
        homepage: 'https://acala.network/karura/join-karura',
        paraId: 2000,
        text: t('rpc.kusama.karura', 'Karura', { ns: 'apps-config' }),
        providers: {
          'Acala Foundation 0': 'wss://karura-rpc-0.aca-api.network',
          'Acala Foundation 1': 'wss://karura-rpc-1.aca-api.network',
          'Acala Foundation 2': 'wss://karura-rpc-2.aca-api.network/ws',
          'Acala Foundation 3': 'wss://karura-rpc-3.aca-api.network/ws',
          'Polkawallet 0': 'wss://karura.polkawallet.io',
          OnFinality: 'wss://karura.api.onfinality.io/public-ws',
          'Patract Elara': 'wss://pub.elara.patract.io/karura'
        }
      },
      {
        info: 'khala',
        homepage: 'https://phala.network/',
        paraId: 2004,
        text: t('rpc.kusama.khala', 'Khala Network', { ns: 'apps-config' }),
        providers: {
          Phala: 'wss://khala-api.phala.network/ws',
          OnFinality: 'wss://khala.api.onfinality.io/public-ws'
        }
      },
      {
        info: 'kilt',
        homepage: 'https://www.kilt.io/',
        paraId: 2086,
        text: t('rpc.kusama.kilt', 'KILT Spiritnet', { ns: 'apps-config' }),
        providers: {
          'KILT Protocol': 'wss://spiritnet.kilt.io/',
          OnFinality: 'wss://spiritnet.api.onfinality.io/public-ws'
        }
      },
      {
        info: 'kintsugi',
        homepage: 'https://kintsugi.interlay.io/',
        paraId: 2092,
        text: t('rpc.kusama.kintsugi', 'Kintsugi BTC', { ns: 'apps-config' }),
        providers: {
          'Kintsugi Labs': 'wss://api-kusama.interlay.io/parachain',
          OnFinality: 'wss://kintsugi.api.onfinality.io/public-ws'
        }
      },
      {
        info: 'kpron',
        homepage: 'http://apron.network/',
        isUnreachable: true,
        paraId: 2019,
        text: t('rpc.kusama.kpron', 'Kpron', { ns: 'apps-config' }),
        providers: {
          Kpron: 'wss://kusama-kpron-rpc.apron.network/'
        }
      },
      {
        info: 'loomNetwork',
        isUnreachable: true, // https://github.com/polkadot-js/apps/issues/5888
        homepage: 'https://loomx.io/',
        paraId: 2080,
        text: t('rpc.kusama.loomnetwork', 'Loom Network', { ns: 'apps-config' }),
        providers: {
          LoomNetwork: 'wss://kusama.dappchains.com'
        }
      },
      {
        info: 'mars',
        homepage: 'https://www.aresprotocol.io/mars',
        paraId: 2008,
        text: t('rpc.kusama.mars', 'Mars', { ns: 'apps-config' }),
        providers: {
          AresProtocol: 'wss://wss.mars.aresprotocol.io'
        }
      },
      {
        info: 'moonriver',
        homepage: 'https://moonbeam.foundation/moonriver-crowdloan/',
        paraId: 2023,
        text: t('rpc.kusama.moonriver', 'Moonriver', { ns: 'apps-config' }),
        providers: {
          PureStake: 'wss://wss.moonriver.moonbeam.network',
          OnFinality: 'wss://moonriver.api.onfinality.io/public-ws',
          Pinknode: 'wss://rpc.pinknode.io/moonriver/explorer',
          'Patract Elara': 'wss://pub.elara.patract.io/moonriver'
        }
      },
      {
        info: 'heiko',
        homepage: 'https://parallel.fi',
        paraId: 2085,
        text: t('rpc.kusama.heiko', 'Parallel Heiko', { ns: 'apps-config' }),
        providers: {
          OnFinality: 'wss://parallel-heiko.api.onfinality.io/public-ws',
          Parallel: 'wss://heiko-rpc.parallel.fi'
        }
      },
      {
        info: 'picasso',
        homepage: 'https://picasso.composable.finance/',
        paraId: 2087,
        text: t('rpc.kusama.picasso', 'Picasso', { ns: 'apps-config' }),
        providers: {
          Composable: 'wss://picasso-rpc.composable.finance'
        }
      },
      {
        info: 'polkasmith',
        homepage: 'https://polkasmith.polkafoundry.com/',
        paraId: 2009,
        text: t('rpc.kusama.polkasmith', 'PolkaSmith by PolkaFoundry', { ns: 'apps-config' }),
        providers: {
          PolkaSmith: 'wss://wss-polkasmith.polkafoundry.com'
        }
      },
      {
        info: 'quartz',
        homepage: 'https://unique.network/',
        paraId: 2095,
        text: t('quartz.unique.network', 'QUARTZ by UNIQUE', { ns: 'apps-config' }),
        providers: {
          Unique: 'wss://quartz.unique.network'
        }
      },
      {
        info: 'robonomics',
        homepage: 'http://robonomics.network/',
        paraId: 2077,
        text: t('rpc.kusama.robonomics', 'Robonomics', { ns: 'apps-config' }),
        providers: {
          Airalab: 'wss://kusama.rpc.robonomics.network/'
        }
      },
      {
        info: 'trustbase',
        isUnreachable: true, // no providers (yet)
        homepage: 'https://trustbase.network/',
        paraId: 2078,
        text: t('rpc.kusama.trustbase', 'TrustBase', { ns: 'apps-config' }),
        providers: {}
      },
      {
        info: 'sakura',
        homepage: 'https://clover.finance/',
        isUnreachable: true,
        paraId: 2016,
        text: t('rpc.kusama.sakura', 'Sakura', { ns: 'apps-config' }),
        providers: {
          Clover: 'wss://api-sakura.clover.finance'
        }
      },
      {
        info: 'sherpax',
        homepage: 'https://chainx.org/',
        isUnreachable: true,
        paraId: 2013,
        text: t('rpc.kusama.sherpax', 'SherpaX', { ns: 'apps-config' }),
        providers: {
          ChainX: 'wss://sherpax.chainx.org'
        }
      },
      {
        info: 'shiden',
        homepage: 'https://shiden.plasmnet.io/',
        paraId: 2007,
        text: t('rpc.kusama.shiden', 'Shiden', { ns: 'apps-config' }),
        providers: {
          StakeTechnologies: 'wss://rpc.shiden.astar.network',
          OnFinality: 'wss://shiden.api.onfinality.io/public-ws',
          Pinknode: 'wss://rpc.pinknode.io/shiden/explorer'
        }
      },
      {
        info: 'subgame',
        homepage: 'http://subgame.org/',
        paraId: 2018,
        text: t('rpc.kusama.subgame', 'SubGame Gamma', { ns: 'apps-config' }),
        providers: {
          SubGame: 'wss://gamma.subgame.org/'
        }
      },
      {
        info: 'unorthodox',
        homepage: 'https://standard.tech/',
        paraId: 2094,
        text: t('rpc.kusama.standard', 'Unorthodox', { ns: 'apps-config' }),
        providers: {
          'Standard Protocol': 'wss://rpc.kusama.standard.tech'
        }
      }
    ]
  };
}
