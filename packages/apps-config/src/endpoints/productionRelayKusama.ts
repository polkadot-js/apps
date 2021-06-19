// Copyright 2017-2021 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { TFunction } from 'i18next';
import type { EndpointOption } from './types';

import { EndpointType } from '../../../../../ui/packages/ui-settings/src/types';
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
<<<<<<< HEAD
      Parity: { type: 'json-rpc' as EndpointType, param: 'wss://kusama-rpc.polkadot.io' },
      OnFinality: { type: 'json-rpc' as EndpointType, param: 'wss://kusama.api.onfinality.io/public-ws' },
      'Patract Elara': { type: 'json-rpc' as EndpointType, param: 'wss://kusama.elara.patract.io' },
      'light client': { type: 'substrate-connect' as EndpointType, param: 'kusama-substrate-connect' }
=======
      Parity: 'wss://kusama-rpc.polkadot.io',
      OnFinality: 'wss://kusama.api.onfinality.io/public-ws',
      'Patract Elara': 'wss://kusama.elara.patract.io',
      Pinknode: 'wss://rpc.pinknode.io/kusama/explorer'
>>>>>>> 9e22ba0f6c5da47f93d0cab38ec097ad7483753c
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
<<<<<<< HEAD
          Parity: { type: 'json-rpc' as EndpointType, param: 'wss://kusama-shell-rpc.parity.io' }
        }
=======
          Parity: 'wss://kusama-statemine-rpc.paritytech.net',
          OnFinality: 'wss://statemine.api.onfinality.io/public-ws',
          'Patract Elara': 'wss://statemine.kusama.elara.patract.io'
        },
        teleport: [-1]
>>>>>>> 9e22ba0f6c5da47f93d0cab38ec097ad7483753c
      },
      /// (3) parachains with id, see Rococo (info here maps to the actual "named icon")
      //
      // NOTE: Added alphabetical based on chain name
      {
        info: 'altair',
        isUnreachable: true,
        paraId: 2021,
        text: t('rpc.kusama.altair', 'Altair', { ns: 'apps-config' }),
        providers: {
          Centrifuge: 'wss://fullnode.altair.centrifuge.io'
        }
      },
      {
        info: 'bifrost',
        isUnreachable: true, // https://github.com/polkadot-js/apps/issues/5619 (duplicated in testing networks)
        homepage: 'https://ksm.vtoken.io/?ref=polkadotjs',
        paraId: 2001,
        text: t('rpc.kusama.bifrost', 'Bifrost', { ns: 'apps-config' }),
        providers: {
          Bifrost: { type: 'json-rpc' as EndpointType, param: 'wss://bifrost-rpc.liebi.com/ws' }
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
        info: 'crab_redirect',
        homepage: 'https://crab.network/',
        paraId: 2006,
        text: t('rpc.kusama.crab-redirect', 'Darwinia Crab Redirect', { ns: 'apps-config' }),
        providers: {
<<<<<<< HEAD
          Crab: { type: 'json-rpc' as EndpointType, param: 'wss://crab-rpc.darwinia.network/' }
=======
          Crab: 'wss://crab-redirect-rpc.darwinia.network/'
>>>>>>> 9e22ba0f6c5da47f93d0cab38ec097ad7483753c
        }
      },
      {
        info: 'encointer_canary',
        homepage: 'https://encointer.org/',
        isUnreachable: true,
        paraId: 2014,
        text: t('rpc.kusama.encointer', 'Encointer Canary', { ns: 'apps-config' }),
        providers: {
<<<<<<< HEAD
          Crust: { type: 'json-rpc' as EndpointType, param: 'wss://shadow.crust.network/' }
=======
          Encointer: 'wss://canary.encointer.org'
        }
      },
      {
        info: 'genshiro',
        homepage: 'https://genshiro.equilibrium.io',
        paraId: 2024,
        text: t('rpc.kusama.genshiro', 'Genshiro', { ns: 'apps-config' }),
        providers: {
          Equilibrium: 'wss://gens-mainnet.equilibrium.io'
        }
      },
      {
        info: 'integritee',
        isUnreachable: true,
        paraId: 2015,
        text: t('rpc.kusama.integritee', 'IntegriTEE Network', { ns: 'apps-config' }),
        providers: {
          IntegriTEE: 'wss://mainnet.integritee.network'
        }
      },
      {
        info: 'karura',
        homepage: 'https://acala.network/karura/join-karura',
        paraId: 2000,
        text: t('rpc.kusama.karura', 'Karura', { ns: 'apps-config' }),
        providers: {
          'Acala Foundation': 'wss://karura-rpc-0.aca-api.network',
          OnFinality: 'wss://karura.api.onfinality.io/public-ws'
>>>>>>> 9e22ba0f6c5da47f93d0cab38ec097ad7483753c
        }
      },
      {
        info: 'khala',
        isUnreachable: true,
        homepage: 'https://phala.network/',
        paraId: 2004,
        text: t('rpc.kusama.khala', 'Khala Network', { ns: 'apps-config' }),
        providers: {
<<<<<<< HEAD
          Phala: { type: 'json-rpc' as EndpointType, param: 'wss://khala.phala.network/ws' }
=======
          Phala: 'wss://khala.phala.network/ws',
          OnFinality: 'wss://khala.api.onfinality.io/public-ws'
>>>>>>> 9e22ba0f6c5da47f93d0cab38ec097ad7483753c
        }
      },
      {
        info: 'kilt',
        homepage: 'https://www.kilt.io/',
        paraId: 2005,
        text: t('rpc.kusama.kilt', 'KILT Spiritnet', { ns: 'apps-config' }),
        providers: {
          'KILT Protocol': 'wss://spiritnet.kilt.io/'
        }
      },
      {
        info: 'mars',
        homepage: 'https://www.aresprotocol.io/',
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
          Purestake: 'wss://wss.moonriver.moonbeam.network'
        }
      },
      {
        info: 'polkasmith',
        homepage: 'https://polkasmith.polkafoundry.com/',
        paraId: 2009,
        text: t('rpc.kusama.polkasmith', 'PolkaSmith by PolkaFoundry', { ns: 'apps-config' }),
        providers: {
<<<<<<< HEAD
          'KILT Protocol': { type: 'json-rpc' as EndpointType, param: 'wss://mainnet.kilt.io/' }
=======
          PolkaSmith: 'wss://wss-polkasmith.polkafoundry.com'
        }
      },
      {
        info: 'sakura',
        homepage: 'https://clover.finance/',
        isUnreachable: true,
        paraId: 2016,
        text: t('rpc.kusama.sakura', 'Sakura', { ns: 'apps-config' }),
        providers: {
          Clover: 'wss://api-sakura.clover.finance'
>>>>>>> 9e22ba0f6c5da47f93d0cab38ec097ad7483753c
        }
      },
      {
        info: 'sherpax',
        homepage: 'https://chainx.org/',
        isUnreachable: true,
        paraId: 2013,
        text: t('rpc.kusama.sherpax', 'SherpaX', { ns: 'apps-config' }),
        providers: {
          ChainX: { type: 'json-rpc' as EndpointType, param: 'wss://sherpax.chainx.org' }
        }
      },
      {
        info: 'shiden',
        homepage: 'https://shiden.plasmnet.io/',
        paraId: 2007,
        text: t('rpc.kusama.shiden', 'Shiden', { ns: 'apps-config' }),
        providers: {
          StakeTechnologies: 'wss://rpc.shiden.plasmnet.io'
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
      }
    ]
  };
}
