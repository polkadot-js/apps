// Copyright 2017-2021 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { TFunction } from 'i18next';
import type { LinkOption } from '../settings/types';

import { expandEndpoints } from './util';

/* eslint-disable sort-keys */

// The available endpoints that will show in the dropdown. For the most part (with the exception of
// Polkadot) we try to keep this to live chains only, with RPCs hosted by the community/chain vendor
//   info: The chain logo name as defined in ../ui/logos/index.ts in namedLogos (this also needs to align with @polkadot/networks)
//   text: The text to display on the dropdown
//   value: The actual hosted secure websocket endpoint

// Based on history, this will expand so keep it as a singular chunk
export function createRococo (t: TFunction): LinkOption[] {
  return expandEndpoints(t, [{
    dnslink: 'rococo',
    genesisHash: '0xf60989b1d5edd03c1947d557dc56982800a3fec377702be5e87ee6f30b6298f9',
    info: 'rococo',
    text: t('rpc.rococo', 'Rococo', { ns: 'apps-config' }),
    providers: {
      Parity: 'wss://rococo-rpc.polkadot.io',
      OnFinality: 'wss://rococo.api.onfinality.io/public-ws',
      'Patract Elara': 'wss://rococo.elara.patract.io',
      'Ares Protocol': 'wss://rococo.aresprotocol.com'
    },
    linked: [
      // these are the base chains
      {
        info: 'rococoTick',
        paraId: 100,
        text: t('rpc.rococo.tick', 'Tick', { ns: 'apps-config' }),
        providers: {
          Parity: 'wss://tick-rpc.polkadot.io'
        }
      },
      {
        info: 'rococoTrick',
        paraId: 110,
        text: t('rpc.rococo.trick', 'Trick', { ns: 'apps-config' }),
        providers: {
          Parity: 'wss://trick-rpc.polkadot.io'
        }
      },
      {
        info: 'rococoTrack',
        paraId: 120,
        text: t('rpc.rococo.track', 'Track', { ns: 'apps-config' }),
        providers: {
          Parity: 'wss://track-rpc.polkadot.io'
        }
      },
      // add any additional parachains here, alphabetical
      {
        info: 'rococoAres',
        paraId: 6,
        text: t('rpc.rococo.ares', 'Ares PC1', { ns: 'apps-config' }),
        providers: {
          'Ares Protocol': 'wss://rococo.parachain.aresprotocol.com'
        }
      },
      {
        info: 'rococoBifrost',
        paraId: 107,
        text: t('rpc.rococo.bifrost', 'Bifrost PC1', { ns: 'apps-config' }),
        providers: {
          Bifrost: 'wss://rococo-1.testnet.liebi.com'
        }
      },
      {
        info: 'rococoBitCountry',
        paraId: 8888,
        text: t('rpc.rococo.bitcountry', 'Bit.Country PC1', { ns: 'apps-config' }),
        providers: {
          BitCountry: 'wss://tewai-parachain.bit.country:9955'
        }
      },
      {
        info: 'rococoClover',
        paraId: 229,
        text: t('rpc.rococo.clover', 'Clover PC1', { ns: 'apps-config' }),
        providers: {
          Clover: 'wss://api-rococo.clover.finance'
        }
      },
      {
        info: 'rococoCrust',
        paraId: 7777,
        text: t('rpc.rococo.crust', 'Crust PC1', { ns: 'apps-config' }),
        providers: {
          Crust: 'wss://api-rococo.crust.network'
        }
      },
      {
        info: 'rococoDarwinia',
        paraId: 18,
        text: t('rpc.rococo.darwinia', 'Darwinia PC2', { ns: 'apps-config' }),
        providers: {
          Darwinia: 'wss://parachain-rpc.darwinia.network'
        }
      },
      {
        info: 'rococoDataHighway',
        paraId: 2,
        text: t('rpc.rococo.datahighway', 'DataHighway', { ns: 'apps-config' }),
        providers: {
          DataHighway: 'wss://testnet-harbour.datahighway.com'
        }
      },
      {
        info: 'rococoEncointer',
        paraId: 1862,
        text: t('rpc.rococo.encointer', 'Encointer PC1', { ns: 'apps-config' }),
        providers: {
          Encointer: 'wss://rococo.encointer.org'
        }
      },
      {
        info: 'rococoHydrate',
        paraId: 82406,
        text: t('rpc.rococo.hydrate', 'Hydrate', { ns: 'apps-config' }),
        providers: {
          HydraDX: 'wss://hydrate-rpc.hydradx.io:9944'
        }
      },
      {
        info: 'rococoIdavoll',
        paraId: 7766,
        text: t('rpc.rococo.idavoll', 'Idavoll', { ns: 'apps-config' }),
        providers: {
          Idavoll: 'wss://rococo.idavoll.network'
        }
      },
      {
        info: 'rococoIntegritee',
        paraId: 1983,
        text: t('rpc.rococo.integritee', 'IntegriTEE PC1', { ns: 'apps-config' }),
        providers: {
          SCS: 'wss://rococo.integritee.network'
        }
      },
      {
        info: 'rococoKilt',
        paraId: 12623,
        text: t('rpc.rococo.kilt', 'KILT PC1', { ns: 'apps-config' }),
        providers: {
          'KILT Protocol': 'wss://para.rococo-v1.kilt.io'
        }
      },
      {
        info: 'rococoLitentry',
        paraId: 1984,
        text: t('rpc.rocco.litentry', 'Litentry Rostock', { ns: 'apps-config' }),
        providers: {
          Litentry: 'wss://rococov1.litentry.io'
        }
      },
      {
        info: 'rococoAcala',
        paraId: 666,
        text: t('rpc.rococo.acala', 'Mandala PC2', { ns: 'apps-config' }),
        providers: {
          Acala: 'wss://rococo-1.acala.laminar.one/ws'
        }
      },
      {
        info: 'rococoMathChain',
        paraId: 40,
        text: t('rpc.rococo.mathchain', 'MathChain PC1', { ns: 'apps-config' }),
        providers: {
          MathWallet: 'wss://testpara.maiziqianbao.net/ws'
        }
      },
      {
        info: 'rococoPhala',
        paraId: 30,
        text: t('rpc.rococo.phala', 'Phala PC1', { ns: 'apps-config' }),
        providers: {
          Phala: 'wss://rococov1.phala.network/ws'
        }
      },
      {
        info: 'rococoPlasm',
        paraId: 5000,
        text: t('rpc.rococo.plasm', 'Plasm PC2', { ns: 'apps-config' }),
        providers: {
          PlasmNetwork: 'wss://rpc.rococo.plasmnet.io'
        }
      },
      {
        info: 'rococoPolkabtc',
        paraId: 21,
        text: t('rpc.rococo.polkabtc', 'PolkaBTC PC1', { ns: 'apps-config' }),
        providers: {
          Interlay: 'wss://rococo.polkabtc.io/api/parachain'
        }
      },
      {
        info: 'rococoRobonomics',
        paraId: 3000,
        text: t('rpc.rococo.robonomics', 'Robonomics PC2', { ns: 'apps-config' }),
        providers: {
          Airalab: 'wss://rococo.parachain.robonomics.network'
        }
      },
      {
        info: 'rococoSubDAO',
        paraId: 888,
        text: t('rpc.rococo.subdao', 'SubDAO PC1', { ns: 'apps-config' }),
        providers: {
          SubDAONetwork: 'wss://parachain.subdao.network'
        }
      },
      {
        info: 'rococoTrustBase',
        paraId: 6633,
        text: t('rpc.rococo.trustbase', 'TrustBase PC1', { ns: 'apps-config' }),
        providers: {
          TrustBase: 'wss://rococo.trustednodes.net'
        }
      },
      {
        info: 'rococoZenlink',
        paraId: 188,
        text: t('rpc.rococo.zenlink', 'Zenlink PC1', { ns: 'apps-config' }),
        providers: {
          Zenlink: 'wss://rococo-parachain.zenlink.pro'
        }
      }
    ]
  }]);
}
