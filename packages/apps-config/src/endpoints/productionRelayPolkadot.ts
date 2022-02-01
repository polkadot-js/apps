// Copyright 2017-2022 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { TFunction } from 'i18next';
import type { EndpointOption } from './types';

import { POLKADOT_GENESIS } from '../api/constants';

/* eslint-disable sort-keys */

// The available endpoints that will show in the dropdown. For the most part (with the exception of
// Polkadot) we try to keep this to live chains only, with RPCs hosted by the community/chain vendor
//   info: The chain logo name as defined in ../ui/logos/index.ts in namedLogos (this also needs to align with @polkadot/networks)
//   text: The text to display on the dropdown
//   value: The actual hosted secure websocket endpoint
export function createPolkadot (t: TFunction): EndpointOption {
  return {
    dnslink: 'polkadot',
    genesisHash: POLKADOT_GENESIS,
    info: 'polkadot',
    text: t('rpc.polkadot.parity', 'Polkadot', { ns: 'apps-config' }),
    providers: {
      Parity: 'wss://rpc.polkadot.io',
      OnFinality: 'wss://polkadot.api.onfinality.io/public-ws',
      // 'Geometry Labs': 'wss://polkadot.geometry.io/websockets', // https://github.com/polkadot-js/apps/pull/6746
      Dwellir: 'wss://polkadot-rpc.dwellir.com',
      'light client': 'light://substrate-connect/polkadot'
      // Pinknode: 'wss://rpc.pinknode.io/polkadot/explorer' // https://github.com/polkadot-js/apps/issues/5721
    },
    linked: [
      // (1) system parachains (none available yet)
      // ...
      // (2) all common good parachains
      {
        info: 'statemint',
        paraId: 1000,
        text: t('rpc.polkadot.statemint', 'Statemint', { ns: 'apps-config' }),
        providers: {
          Parity: 'wss://statemint-rpc.polkadot.io',
          OnFinality: 'wss://statemint.api.onfinality.io/public-ws'
        }
      },
      /// (3) parachains with id, see Rococo (info here maps to the actual "named icon")
      //
      // NOTE: Added alphabetical based on chain name
      {
        info: 'acala',
        homepage: 'https://acala.network/',
        paraId: 2000,
        text: t('rpc.polkadot.acala', 'Acala', { ns: 'apps-config' }),
        providers: {
          'Acala Foundation 0': 'wss://acala-rpc-0.aca-api.network',
          'Acala Foundation 1': 'wss://acala-rpc-1.aca-api.network',
          'Acala Foundation 2': 'wss://acala-rpc-2.aca-api.network/ws',
          'Acala Foundation 3': 'wss://acala-rpc-3.aca-api.network/ws',
          'Polkawallet 0': 'wss://acala.polkawallet.io',
          OnFinality: 'wss://acala-polkadot.api.onfinality.io/public-ws'
        }
      },
      {
        info: 'odyssey',
        homepage: 'https://www.aresprotocol.io/',
        paraId: 2028,
        text: t('rpc.polkadot.odyssey', 'Ares Odyssey', { ns: 'apps-config' }),
        providers: {
          AresProtocol: 'wss://wss.odyssey.aresprotocol.io'
        }
      },
      {
        info: 'astar',
        homepage: 'https://astar.network',
        paraId: 2006,
        text: t('rpc.polkadot.astar', 'Astar', { ns: 'apps-config' }),
        providers: {
          Astar: 'wss://rpc.astar.network',
          OnFinality: 'wss://astar.api.onfinality.io/public-ws'
        }
      },
      {
        info: 'bifrost',
        homepage: 'https://dot.bifrost.app/?ref=polkadotjs',
        paraId: 2001,
        isUnreachable: true,
        text: t('rpc.polkadot.bifrost', 'Bifrost', { ns: 'apps-config' }),
        providers: {
          Liebi: 'wss://bifrost-dot.liebi.com/ws'
        }
      },
      {
        info: 'centrifuge',
        homepage: 'https://centrifuge.io',
        paraId: 2031,
        isUnreachable: true,
        text: t('rpc.polkadot.centrifuge', 'Centrifuge', { ns: 'apps-config' }),
        providers: {
          Centrifuge: 'wss://fullnode.parachain.centrifuge.io'
        }
      },
      {
        info: 'clover',
        homepage: 'https://clover.finance',
        paraId: 2002,
        text: t('rpc.polkadot.clover-para', 'Clover', { ns: 'apps-config' }),
        providers: {
          Clover: 'wss://rpc-para.clover.finance',
          OnFinality: 'wss://clover.api.onfinality.io/public-ws'
        }
      },
      {
        // this is also a duplicate as a Live and Testing network -
        // it is either/or, not and
        info: 'coinversation',
        isUnreachable: true, // https://github.com/polkadot-js/apps/issues/6635
        homepage: 'http://www.coinversation.io/',
        paraId: 2027,
        text: t('rpc.polkadot.coinversation', 'Coinversation', { ns: 'apps-config' }),
        providers: {
          Coinversation: 'wss://rpc.coinversation.io/'
        }
      },
      {
        info: 'composableFinance',
        isUnreachable: true, // https://github.com/polkadot-js/apps/issues/6721
        homepage: 'https://composable.finance/',
        paraId: 2019,
        text: t('rpc.polkadot.composable', 'Composable Finance', { ns: 'apps-config' }),
        providers: {
          Composable: 'wss://rpc.composable.finance'
        }
      },
      {
        info: 'crustParachain',
        homepage: 'https://crust.network',
        paraId: 2008,
        isUnreachable: true,
        text: t('rpc.polkadot.crust', 'Crust', { ns: 'apps-config' }),
        providers: {
          Crust: 'wss://rpc.crust.network'
        }
      },
      {
        info: 'darwinia',
        isUnreachable: true, // https://github.com/polkadot-js/apps/issues/6530
        homepage: 'https://darwinia.network/',
        paraId: 2003,
        text: t('rpc.polkadot.darwinia', 'Darwinia', { ns: 'apps-config' }),
        providers: {
          Darwinia: 'wss://parachain-rpc.darwinia.network'
        }
      },
      {
        info: 'efinity',
        homepage: 'https://efinity.io',
        paraId: 2021,
        text: t('rpc.polkadot.efinity', 'Efinity', { ns: 'apps-config' }),
        providers: {
          Efinity: 'wss://rpc.efinity.io'
        }
      },
      {
        info: 'equilibrium',
        isUnreachable: true, // https://github.com/polkadot-js/apps/pull/6761
        homepage: 'https://equilibrium.io/',
        paraId: 2011,
        text: t('rpc.polkadot.equilibrium', 'Equilibrium', { ns: 'apps-config' }),
        providers: {
          Equilibrium: 'wss://node.equilibrium.io'
        }
      },
      {
        info: 'hydra',
        homepage: 'https://hydradx.io/',
        paraId: 2034,
        isUnreachable: true, // waiting for onboarding
        text: t('rpc.polkadot.hydra', 'HydraDX', { ns: 'apps-config' }),
        providers: {
          'Galactic Council': 'wss://rpc-01.hydradx.io'
        }
      },
      {
        info: 'interlay',
        homepage: 'https://interlay.io/',
        paraId: 2032,
        text: t('rpc.polkadot.interlay', 'Interlay', { ns: 'apps-config' }),
        providers: {
          'Kintsugi Labs': 'wss://api.interlay.io/parachain'
        }
      },
      {
        info: 'litentry',
        homepage: 'https://crowdloan.litentry.com',
        paraId: 2013,
        isUnreachable: true,
        text: t('rpc.polkadot.litentry', 'Litentry', { ns: 'apps-config' }),
        providers: {
          Litentry: 'wss://parachain.litentry.io'
        }
      },
      {
        info: 'manta',
        homepage: 'https://manta.network',
        paraId: 2015,
        text: t('rpc.polkadot.manta', 'Manta', { ns: 'apps-config' }),
        providers: {
          'Manta Kuhlii': 'wss://kuhlii.manta.systems',
          // 'Manta Munkiana': 'wss://munkiana.manta.systems', // https://github.com/polkadot-js/apps/issues/6871
          'Manta Pectinata': 'wss://pectinata.manta.systems'
        }
      },
      {
        info: 'moonbeam',
        homepage: 'https://moonbeam.network/networks/moonbeam/',
        paraId: 2004,
        text: t('rpc.polkadot.moonbeam', 'Moonbeam', { ns: 'apps-config' }),
        providers: {
          'Moonbeam Foundation': 'wss://wss.api.moonbeam.network',
          OnFinality: 'wss://moonbeam.api.onfinality.io/public-ws'
        }
      },
      {
        info: 'nodle',
        homepage: 'https://nodle.com',
        isUnreachable: true,
        paraId: 2026,
        text: t('rpc.polkadot.nodle', 'Nodle', { ns: 'apps-config' }),
        providers: {
          Nodle: 'wss://rpc.nodle.com'
        }
      },
      {
        info: 'parallel',
        homepage: 'https://parallel.fi',
        paraId: 2012,
        text: t('rpc.polkadot.parallel', 'Parallel', { ns: 'apps-config' }),
        providers: {
          OnFinality: 'wss://parallel.api.onfinality.io/public-ws',
          Parallel: 'wss://rpc.parallel.fi'
        }
      },
      {
        info: 'phala',
        homepage: 'https://phala.network',
        isUnreachable: true,
        paraId: 2035,
        text: t('rpc.polkadot.phala', 'Phala Network', { ns: 'apps-config' }),
        providers: {
          Phala: 'wss://api.phala.network/ws'
        }
      },
      {
        info: 'polkadex',
        homepage: 'https://polkadex.trade/',
        paraId: 2036,
        text: t('rpc.polkadot.polkadex', 'Polkadex', { ns: 'apps-config' }),
        providers: {
          'Polkadex Team': 'wss://mainnet.polkadex.trade/'
        }
      },
      {
        info: 'subdao',
        homepage: 'https://subdao.network/',
        paraId: 2018,
        isUnreachable: true,
        text: t('rpc.polkadot.subdao', 'SubDAO', { ns: 'apps-config' }),
        providers: {
          SubDAO: 'wss://parachain-rpc.subdao.org'
        }
      },
      {
        info: 'subgame',
        homepage: 'http://subgame.org/',
        isUnreachable: true, // https://github.com/polkadot-js/apps/pull/6761
        paraId: 2017,
        text: t('rpc.polkadot.subgame', 'SubGame Gamma', { ns: 'apps-config' }),
        providers: {
          SubGame: 'wss://gamma.subgame.org/'
        }
      }
    ]
  };
}
