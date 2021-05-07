// Copyright 2017-2021 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { TFunction } from 'i18next';
import type { LinkOption } from '../settings/types';

import { ROCOCO_GENESIS } from '../api/constants';
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
    genesisHash: ROCOCO_GENESIS,
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
      {
        info: 'rococoStatemint',
        paraId: 1,
        text: t('rpc.rococo.statemint', 'Statemint', { ns: 'apps-config' }),
        providers: {
          Parity: 'wss://statemint-rococo-rpc.parity.io'
        }
      },
      // add any additional parachains here, alphabetical
      {
        info: 'rococoApron',
        // paraId >= 1000, below that is reserved for system parachains
        paraId: 2048,
        text: t('rpc.rococo.apron', 'Apron PC1', { ns: 'apps-config' }),
        providers: {
          'Apron Network': 'wss://rococo.apron.network'
        }
      },
      {
        info: 'rococoAres',
        paraId: 1006,
        text: t('rpc.rococo.ares', 'Ares PC1', { ns: 'apps-config' }),
        providers: {
          'Ares Protocol': 'wss://rococo.parachain.aresprotocol.com'
        }
      },
      {
        info: 'rococoBifrost',
        paraId: 1024,
        text: t('rpc.rococo.bifrost', 'Bifrost PC1', { ns: 'apps-config' }),
        providers: {
          Bifrost: 'wss://rococo-1.testnet.liebi.com'
        }
      },
      {
        info: 'rococoBitCountry',
        // Needs paraId >= 1000, below that is reserved for system parachains
        // Update paraId to new selection, remove this flag to enable
        paraId: 1008,
        text: t('rpc.rococo.bitcountry', 'Bit.Country PC1', { ns: 'apps-config' }),
        providers: {
          BitCountry: 'wss://tewai-parachain.bit.country:9955'
        }
      },
      {
        info: 'rococoCentrifuge',
        paraId: 10001,
        text: t('rpc.rococo.centrifuge', 'Centrifuge Charcoal', { ns: 'apps-config' }),
        providers: {
          Centrifuge: 'wss://fullnode-collator.charcoal.centrifuge.io'
        }
      },
      {
        info: 'rococoClover',
        // Needs paraId >= 1000, below that is reserved for system parachains
        // Update paraId to new selection, remove this flag to enable
        isDisabled: true,
        paraId: 229,
        text: t('rpc.rococo.clover', 'Clover PC1', { ns: 'apps-config' }),
        providers: {
          Clover: 'wss://api-rococo.clover.finance'
        }
      },
      {
        info: 'rococoCrab',
        // Needs paraId >= 1000, below that is reserved for system parachains
        // Update paraId to new selection, remove this flag to enable
        isDisabled: true,
        paraId: 9,
        text: t('rpc.rococo.crab', 'Darwinia Crab PC2', { ns: 'apps-config' }),
        providers: {
          Darwinia: 'wss://crab-pc2-rpc.darwinia.network'
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
        info: 'rococoChainX',
        paraId: 1059,
        text: t('rpc.rococo.chainx', 'ChainX PC1', { ns: 'apps-config' }),
        providers: {
          ChainX: 'wss://sherpax.chainx.org'
        }
      },
      {
        info: 'rococoDarwinia',
        // Needs paraId >= 1000, below that is reserved for system parachains
        // Update paraId to new selection, remove this flag to enable
        isDisabled: true,
        paraId: 18,
        text: t('rpc.rococo.darwinia', 'Darwinia PC2', { ns: 'apps-config' }),
        providers: {
          Darwinia: 'wss://pc2-rpc.darwinia.network'
        }
      },
      {
        info: 'rococoDataHighway',
        // Needs paraId >= 1000, below that is reserved for system parachains
        // Update paraId to new selection, remove this flag to enable
        isDisabled: true,
        paraId: 2,
        text: t('rpc.rococo.datahighway', 'DataHighway', { ns: 'apps-config' }),
        providers: {
          DataHighway: 'wss://spreehafen.datahighway.com'
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
        info: 'rococoEquilibrium',
        // Needs paraId >= 1000, below that is reserved for system parachains
        // Update paraId to new selection, remove this flag to enable
        isDisabled: true,
        paraId: 42,
        text: t('rpc.rococo.equilibrium', 'Equilibrium', { ns: 'apps-config' }),
        providers: {
          Equilibrium: 'wss://rococo.equilibrium.io'
        }
      },
      {
        info: 'rococoGalital',
        paraId: 1230,
        text: t('rpc.rococo.galital', 'Galital PC1', { ns: 'apps-config' }),
        providers: {
          StarkleyTech: 'wss://galital-rpc.starkleytech.com'
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
        info: 'rococoJupiter',
        paraId: 1010,
        text: t('rpc.rococo.jupiter', 'Patract Jupiter PC1', { ns: 'apps-config' }),
        providers: {
          jupiter: 'wss://ws.rococo.jupiter.patract.cn'
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
        info: 'rococoKonomi',
        paraId: 18403,
        text: t('rpc.rococo.konomi', 'Komomi Network', { ns: 'apps-config' }),
        providers: {
          'Konomi Network': 'wss://rococo.konomi.tech'
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
        paraId: 1000,
        text: t('rpc.rococo.acala', 'Mandala PC2', { ns: 'apps-config' }),
        providers: {
          Acala: 'wss://rococo-1.acala.laminar.one'
        }
      },
      {
        info: 'rococoMathChain',
        // Needs paraId >= 1000, below that is reserved for system parachains
        // Update paraId to new selection, remove this flag to enable
        isDisabled: true,
        paraId: 40,
        text: t('rpc.rococo.mathchain', 'MathChain PC1', { ns: 'apps-config' }),
        providers: {
          MathWallet: 'wss://testpara.maiziqianbao.net/ws'
        }
      },
      {
        info: 'rococoManta',
        // Needs paraId >= 1000, below that is reserved for system parachains
        // Update paraId to new selection, remove this flag to enable
        // isDisabled: true,
        paraId: 2021,
        text: t('rpc.rococo.manta', 'Manta PC1', { ns: 'apps-config' }),
        providers: {
          Manta: 'wss://rococo.manta.network'
        }
      },
      {
        info: 'rococoMoonrock',
        paraId: 1286,
        text: t('rpc.rococo.moonrock', 'Moonrock', { ns: 'apps-config' }),
        providers: {
          Moonrock: 'wss://wss-moonrock.gcp.purestake.run'
        }
      },
      {
        info: 'rococoParami',
        paraId: 18888,
        text: t('rpc.rococo.parami', 'Parami PC2', { ns: 'apps-config' }),
        providers: {
          Parami: 'wss://rococo.parami.io'
        }
      },
      {
        info: 'rococoPhala',
        paraId: 1030,
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
        // Needs paraId >= 1000, below that is reserved for system parachains
        // Update paraId to new selection, remove this flag to enable
        isDisabled: true,
        paraId: 21,
        text: t('rpc.rococo.polkabtc', 'PolkaBTC PC1', { ns: 'apps-config' }),
        providers: {
          Interlay: 'wss://rococo.polkabtc.io/api/parachain'
        }
      },
      {
        info: 'rococoPolkaFoundry',
        paraId: 1111,
        text: t('rpc.rococo.polkafoundry', 'PolkaFoundry PC1', { ns: 'apps-config' }),
        providers: {
          PolkaFoundry: 'wss://rococo.polkafoundry.com'
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
        info: 'rococoEave',
        // Needs paraId >= 1000, below that is reserved for system parachains
        // Update paraId to new selection, remove this flag to enable
        isDisabled: true,
        paraId: 77,
        text: t('rpc.rococo.eave', 'Steam PC', { ns: 'apps-config' }),
        providers: {
          EAVE: 'wss://steamcollator.eave.network'
        }
      },
      {
        info: 'rococoSubDAO',
        // Needs paraId >= 1000, below that is reserved for system parachains
        // Update paraId to new selection, remove this flag to enable
        isDisabled: true,
        paraId: 888,
        text: t('rpc.rococo.subdao', 'SubDAO PC1', { ns: 'apps-config' }),
        providers: {
          SubDAONetwork: 'wss://parachain.subdao.network'
        }
      },
      {
        info: 'rococoSubsocial',
        // Needs paraId >= 1000, below that is reserved for system parachains
        // Update paraId to new selection, remove this flag to enable
        isDisabled: true,
        paraId: 28,
        text: t('rpc.rococo.subsocial', 'Subsocial PC1', { ns: 'apps-config' }),
        providers: {
          DappForce: 'wss://roc.subsocial.network'
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
        paraId: 1188,
        text: t('rpc.rococo.zenlink', 'Zenlink PC1', { ns: 'apps-config' }),
        providers: {
          Zenlink: 'wss://rococo-parachain.zenlink.pro'
        }
      },
      {
        info: 'rococoPhoenix',
        paraId: 6806,
        text: t('rpc.rococo.phoenix', 'PHOENIX PC1', { ns: 'apps-config' }),
        providers: {
          'PHOENIX Protocol': 'wss://phoenix-ws.coinid.pro'
        }
      },
      {
        info: 'rococoUnitv',
        // Needs paraId >= 1000, below that is reserved for system parachains
        // Update paraId to new selection, remove this flag to enable
        isDisabled: true,
        paraId: 3,
        text: t('rpc.rococo.unitv', 'Unit Network', { ns: 'apps-config' }),
        providers: {
          'Unit Network': 'wss://unitp.io'
        }
      },
      {
        info: 'rococoVln',
        paraId: 3586,
        text: t('rpc.rococo.vln', 'Valiu Liquidity Network PC', { ns: 'apps-config' }),
        providers: {
          Valiu: 'wss://vln.valiu.dev'
        }
      },
      {
        info: 'rococoZeitgeist',
        paraId: 9123,
        text: t('rpc.rococo.zeitgeist', 'Zeitgeist PC', { ns: 'apps-config' }),
        providers: {
          Zeitgeist: 'wss://roc.zeitgeist.pm'
        }
      }
    ]
  }]);
}
