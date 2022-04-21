// Copyright 2017-2022 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { TFunction } from '../types';
import type { EndpointOption } from './types';

import { ROCOCO_GENESIS } from '../api/constants';

/* eslint-disable sort-keys */

// The available endpoints that will show in the dropdown. For the most part (with the exception of
// Polkadot) we try to keep this to live chains only, with RPCs hosted by the community/chain vendor
//   info: The chain logo name as defined in ../ui/logos/index.ts in namedLogos (this also needs to align with @polkadot/networks)
//   text: The text to display on the dropdown
//   value: The actual hosted secure websocket endpoint

// Based on history, this will expand so keep it as a singular chunk
export function createRococo (t: TFunction): EndpointOption {
  return {
    dnslink: 'rococo',
    genesisHash: ROCOCO_GENESIS,
    info: 'rococo',
    text: t('rpc.rococo', 'Rococo', { ns: 'apps-config' }),
    providers: {
      Parity: 'wss://rococo-rpc.polkadot.io',
      'light client': 'light://substrate-connect/rococo'
      // OnFinality: 'wss://rococo.api.onfinality.io/public-ws', // After reset, node misses host functions
      // Pinknode: 'wss://rpc.pinknode.io/rococo/explorer' // After reset, syncs to old chain
      // 'Ares Protocol': 'wss://rococo.aresprotocol.com' // https://github.com/polkadot-js/apps/issues/5767
    },
    teleport: [1000, 1002],
    linked: [
      // these are the base chains
      {
        info: 'rococoStatemint',
        paraId: 1000,
        text: t('rpc.rococo.statemint', 'Statemint', { ns: 'apps-config' }),
        providers: {
          Parity: 'wss://rococo-statemint-rpc.polkadot.io'
        },
        teleport: [-1]
      },
      {
        info: 'rococoCanvas',
        paraId: 1002,
        text: t('rpc.rococo.canvas', 'Canvas', { ns: 'apps-config' }),
        providers: {
          Parity: 'wss://rococo-canvas-rpc.polkadot.io'
        },
        teleport: [-1]
      },
      {
        info: 'encointer',
        homepage: 'https://encointer.org/',
        paraId: 1003,
        text: t('rpc.rococo.encointer', 'Encointer Lietaer', { ns: 'apps-config' }),
        providers: {
          'Encointer Association': 'wss://rococo.api.encointer.org'
        },
        teleport: [-1]
      },
      // add any additional parachains here, alphabetical
      {
        info: 'arctic',
        paraId: 3025,
        text: t('rpc.rococo.arctic', 'Arctic', { ns: 'apps-config' }),
        providers: {
          Arctic: 'wss://arctic-rpc-parachain.icenetwork.io:9944'
        }
      },
      {
        info: 'rococoBasilisk',
        paraId: 2090,
        text: t('rpc.rococo.basilisk', 'Basilisk', { ns: 'apps-config' }),
        providers: {
          'Galactic Council': 'wss://rpc-01.basilisk-rococo.hydradx.io'
        }
      },
      {
        info: 'rococoCatalyst',
        paraId: 2031,
        text: t('rpc.rococo.catalyst', 'Catalyst', { ns: 'apps-config' }),
        providers: {
          Centrifuge: 'wss://fullnode.catalyst.cntrfg.com'
        }
      },
      {
        info: 'rococoDolphin',
        paraId: 2084,
        text: t('rpc.rococo.dolphin', 'Dolphin', { ns: 'apps-config' }),
        providers: {
          'Manta Network': 'wss://anjie.rococo.dolphin.engineering'
        }
      },
      {
        info: 'rocfinity',
        paraId: 2051,
        text: t('rpc.rococo.efinity.io', 'Efinity', { ns: 'apps-config' }),
        providers: {
          Efinity: 'wss://rpc.rococo.efinity.io'
        }
      },
      {
        info: 'rococoIntegritee',
        paraId: 3002,
        text: t('rpc.rococo.integritee', 'Integritee Network', { ns: 'apps-config' }),
        providers: {
          Integritee: 'wss://rococo.api.integritee.network'
        }
      },
      {
        info: 'rococoTinker',
        paraId: 2014,
        text: t('rpc.rococo.tinker', 'InvArch Tinkernet', { ns: 'apps-config' }),
        providers: {
          OnFinality: 'wss://invarch-tinkernet.api.onfinality.io/public-ws'
        }
      },
      {
        info: 'rococoLitentry',
        paraId: 2106,
        text: t('rpc.rococo.litentry', 'Litentry', { ns: 'apps-config' }),
        providers: {
          Litentry: 'wss://rpc.rococo-parachain-sg.litentry.io'
        }
      },
      {
        info: 'rococoMoonsama',
        paraId: 2055,
        text: t('rpc.rococo.moonsama', 'Moonsama', { ns: 'apps-config' }),
        providers: {
          Moonsama: 'wss://moonsama-testnet-rpc.moonsama.com'
        }
      },
      {
        info: 'rococoNodle',
        paraId: 2026,
        text: t('rpc.rococo.nodle', 'Nodle', { ns: 'apps-config' }),
        providers: {
          OnFinality: 'wss://node-6913072722034561024.lh.onfinality.io/ws?apikey=84d77e2e-3793-4785-8908-5096cffea77a'
        }
      },
      {
        info: 'rococoPangolin',
        paraId: 2105,
        text: t('rpc.rococo.pangolin', 'Pangolin Parachain', { ns: 'apps-config' }),
        providers: {
          'Darwinia Network': 'wss://pangolin-parachain-rpc.darwinia.network'
        }
      },
      {
        info: 'rococoKilt',
        paraId: 2015,
        text: t('rpc.rococo.kilt', 'RILT', { ns: 'apps-config' }),
        providers: {
          'KILT Protocol': 'wss://rococo.kilt.io'
        }
      },
      {
        info: 'rococoSubsocial',
        paraId: 2100,
        text: t('rpc.rococo.subsocial', 'SoonsocialX', { ns: 'apps-config' }),
        providers: {
          DappForce: 'wss://rco-para.subsocial.network'
        }
      },
      {
        info: 'rococoSpreehafen',
        paraId: 2116,
        text: t('rpc.rococo.spreehafen', 'Spreehafen', { ns: 'apps-config' }),
        providers: {
          DataHighway: 'wss://spreehafen.datahighway.com'
        }
      },
      {
        info: 'rococoZeitgeist',
        isDisabled: true, // See https://github.com/polkadot-js/apps/issues/5842
        paraId: 2050,
        text: t('rpc.rococo.zeitgeist', 'Zeitgeist PC', { ns: 'apps-config' }),
        providers: {
          Zeitggeist: 'wss://roc.zeitgeist.pm'
        }
      }
    ]
  };
}
