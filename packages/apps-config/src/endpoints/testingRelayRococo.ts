// Copyright 2017-2021 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { TFunction } from 'i18next';
import type { EndpointOption } from './types';

import { createProviderUrl } from './util';
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
      Parity: createProviderUrl('wss://rococo-rpc.polkadot.io'),
      OnFinality: createProviderUrl('wss://rococo.api.onfinalit.io/public-ws'),
      'Patract Elara': createProviderUrl('wss://rococo.elara.patract.io'),
      'Ares Protocol': createProviderUrl('wss://rococo.aresprotocol.com'),
      Pinknode:  createProviderUrl('wss://rpc.pinknode.io/rococo/explorer')
    },
    linked: [
      // these are the base chains
      {
        info: 'rococoTick',
        paraId: 100,
        text: t('rpc.rococo.tick', 'Tick', { ns: 'apps-config' }),
        providers: {
          Parity: createProviderUrl('wss://tick-rpc.polkadot.io')
        }
      },
      {
        info: 'rococoTrick',
        paraId: 110,
        text: t('rpc.rococo.trick', 'Trick', { ns: 'apps-config' }),
        providers: {
          Parity: createProviderUrl('wss://trick-rpc.polkadot.io')
        }
      },
      {
        info: 'rococoTrack',
        paraId: 120,
        text: t('rpc.rococo.track', 'Track', { ns: 'apps-config' }),
        providers: {
          Parity: createProviderUrl('wss://track-rpc.polkadot.io')
        }
      },
      {
        info: 'rococoStatemint',
        paraId: 1000,
        text: t('rpc.rococo.statemint', 'Statemint', { ns: 'apps-config' }),
        providers: {
          Parity: createProviderUrl('wss://statemint-rococo-rpc.parity.io')
        }
      },
      // add any additional parachains here, alphabetical
      {
        info: 'rococoApron',
        isDisabled: true, // Rococo reset
        paraId: 2048,
        text: t('rpc.rococo.apron', 'Apron PC1', { ns: 'apps-config' }),
        providers: {
          'Apron Network': createProviderUrl('wss://rococo.apron.network')
        }
      },
      {
        info: 'rococoAres',
        isDisabled: true, // Rococo reset
        paraId: 1006,
        text: t('rpc.rococo.ares', 'Ares PC1', { ns: 'apps-config' }),
        providers: {
          'Ares Protocol': createProviderUrl('wss://rococo.parachain.aresprotocol.com')
        }
      },
      {
        info: 'rococoBifrost',
        isDisabled: true, // Rococo reset
        paraId: 1024,
        text: t('rpc.rococo.bifrost', 'Bifrost PC1', { ns: 'apps-config' }),
        providers: {
          Bifrost: createProviderUrl('wss://rococo-1.testnet.liebi.com')
        }
      },
      {
        info: 'rococoBitCountry',
        isDisabled: true, // Rococo reset
        paraId: 1008,
        text: t('rpc.rococo.bitcountry', 'Bit.Country PC1', { ns: 'apps-config' }),
        providers: {
          BitCountry: createProviderUrl('wss://tewai-parachain.bit.country:9955')
        }
      },
      {
        info: 'rococoClover',
        isDisabled: true, // Rococo reset
        paraId: 229,
        text: t('rpc.rococo.clover', 'Clover PC1', { ns: 'apps-config' }),
        providers: {
          Clover: createProviderUrl('wss://api-rococo.clover.finance')
        }
      },
      {
        info: 'rococoCrab',
        isDisabled: true, // Rococo reset
        paraId: 9,
        text: t('rpc.rococo.crab', 'Darwinia Crab PC2', { ns: 'apps-config' }),
        providers: {
          Darwinia: createProviderUrl('wss://crab-pc2-rpc.darwinia.network')
        }
      },
      {
        info: 'rococoCrust',
        isDisabled: true, // Rococo reset
        paraId: 2001,
        text: t('rpc.rococo.crust', 'Crust PC1', { ns: 'apps-config' }),
        providers: {
          Crust: createProviderUrl('wss://api-rococo.crust.network')
        }
      },
      {
        info: 'rococoChainX',
        isDisabled: true, // Rococo reset
        paraId: 1059,
        text: t('rpc.rococo.chainx', 'ChainX PC1', { ns: 'apps-config' }),
        providers: {
          ChainX: createProviderUrl('wss://sherpax.chainx.org')
        }
      },
      {
        info: 'rococoDarwinia',
        isDisabled: true, // Rococo reset
        paraId: 18,
        text: t('rpc.rococo.darwinia', 'Darwinia PC2', { ns: 'apps-config' }),
        providers: {
          Darwinia: createProviderUrl('wss://pc2-rpc.darwinia.network')
        }
      },
      {
        info: 'rococoDataHighway',
        isDisabled: true, // Rococo reset
        paraId: 2,
        text: t('rpc.rococo.datahighway', 'DataHighway', { ns: 'apps-config' }),
        providers: {
          DataHighway: createProviderUrl('wss://spreehafen.datahighway.com')
        }
      },
      {
        info: 'rococoEave',
        isDisabled: true, // Rococo reset
        paraId: 2003,
        text: t('rpc.rococo.eave', 'Steam PC', { ns: 'apps-config' }),
        providers: {
          EAVE: createProviderUrl('wss://steamcollator.eave.network')
        }
      },
      {
        info: 'rococoEncointer',
        isDisabled: true, // Rococo reset
        paraId: 1862,
        text: t('rpc.rococo.encointer', 'Encointer PC1', { ns: 'apps-config' }),
        providers: {
          Encointer: createProviderUrl('wss://rococo.encointer.org')
        }
      },
      {
        info: 'rococoGalital',
        isDisabled: true, // Rococo reset
        paraId: 1230,
        text: t('rpc.rococo.galital', 'Galital PC1', { ns: 'apps-config' }),
        providers: {
          StarkleyTech: createProviderUrl('wss://galital-rpc.starkleytech.com')
        }
      },
      {
        info: 'rococoGenshiro',
        paraId: 2021,
        text: t('rpc.rococo.genshiro', 'Genshiro', { ns: 'apps-config' }),
        providers: {
          Equilibrium: createProviderUrl('wss://gens-rococo.equilibrium.io')
        }
      },
      {
        info: 'rococoHalongbay',
        paraId: 2018,
        text: t('rpc.rococo.halongbay', 'Halongbay', { ns: 'app-config' }),
        providers: {
          Halongbay: createProviderUrl('wss://halongbay.polkafoundry.com')
        }
      },
      {
        info: 'rococoHydrate',
        isDisabled: true, // Rococo reset
        paraId: 82406,
        text: t('rpc.rococo.hydrate', 'Hydrate', { ns: 'apps-config' }),
        providers: {
          HydraDX: createProviderUrl('wss://hydrate-rpc.hydradx.io:9944')
        }
      },
      {
        info: 'rococoIdavoll',
        isDisabled: true, // Rococo reset
        paraId: 7766,
        text: t('rpc.rococo.idavoll', 'Idavoll', { ns: 'apps-config' }),
        providers: {
          Idavoll: createProviderUrl('wss://rococo.idavoll.network')
        }
      },
      {
        info: 'rococoIntegritee',
        isDisabled: true, // Rococo reset
        paraId: 1983,
        text: t('rpc.rococo.integritee', 'IntegriTEE PC1', { ns: 'apps-config' }),
        providers: {
          SCS: createProviderUrl('wss://rococo.integritee.network')
        }
      },
      {
        info: 'rococoKilt',
        isDisabled: true, // Rococo reset
        paraId: 12623,
        text: t('rpc.rococo.kilt', 'KILT PC1', { ns: 'apps-config' }),
        providers: {
          'KILT Protocol': createProviderUrl('wss://para.rococo-v1.kilt.io')
        }
      },
      {
        info: 'rococoKonomi',
        isDisabled: true, // Rococo reset
        paraId: 18403,
        text: t('rpc.rococo.konomi', 'Komomi Network', { ns: 'apps-config' }),
        providers: {
          'Konomi Network': createProviderUrl('wss://rococo.konomi.tech')
        }
      },
      {
        info: 'rococoKylin',
        paraId: 2013,
        text: t('rpc.kylin-node.co.uk', 'Kylin Network', { ns: 'apps-config' }),
        providers: {
          'Kylin Network': createProviderUrl('wss://rpc.kylin-node.co.uk')
        }
      },
      {
        info: 'rococoLitentry',
        isDisabled: true, // Rococo reset
        paraId: 1984,
        text: t('rpc.rocco.litentry', 'Litentry Rostock', { ns: 'apps-config' }),
        providers: {
          Litentry: createProviderUrl('wss://rococov1.litentry.io')
        }
      },
      {
        info: 'rococoAcala',
        isDisabled: true, // Rococo reset
        paraId: 1000,
        text: t('rpc.rococo.acala', 'Mandala PC2', { ns: 'apps-config' }),
        providers: {
          Acala: createProviderUrl('wss://rococo-1.acala.laminar.one')
        }
      },
      {
        info: 'rococoMathChain',
        isDisabled: true, // Rococo reset
        paraId: 40,
        text: t('rpc.rococo.mathchain', 'MathChain PC1', { ns: 'apps-config' }),
        providers: {
          MathWallet: createProviderUrl('wss://testpara.maiziqianbao.net/ws')
        }
      },
      {
        info: 'rococoManta',
        isDisabled: true, // Rococo reset
        paraId: 2021,
        text: t('rpc.rococo.manta', 'Manta PC1', { ns: 'apps-config' }),
        providers: {
          Manta: createProviderUrl('wss://rococo.manta.network')
        }
      },
      {
        info: 'rococoMoonrock',
        isDisabled: true, // Rococo reset
        paraId: 1286,
        text: t('rpc.rococo.moonrock', 'Moonrock', { ns: 'apps-config' }),
        providers: {
          Moonrock: createProviderUrl('wss://wss-moonrock.gcp.purestake.run')
        }
      },
      {
        info: 'rococoOriginTrail',
        paraId: 2024,
        text: t('rpc.origintrail', 'OriginTrail Parachain', { ns: 'apps-config' }),
        providers: {
          'Trace Labs': createProviderUrl('wss://parachain-rpc.origin-trail.network')
        }
      },
      {
        info: 'rococoParami',
        isDisabled: true, // Rococo reset
        paraId: 18888,
        text: t('rpc.rococo.parami', 'Parami PC2', { ns: 'apps-config' }),
        providers: {
          Parami: createProviderUrl('wss://rococo.parami.io')
        }
      },
      {
        info: 'rococoJupiter',
        isDisabled: true, // Rococo reset
        paraId: 1010,
        text: t('rpc.rococo.jupiter', 'Patract Jupiter PC1', { ns: 'apps-config' }),
        providers: {
          jupiter: createProviderUrl('wss://ws.rococo.jupiter.patract.cn')
        }
      },
      {
        info: 'rococoPhala',
        isDisabled: true, // Rococo reset
        paraId: 1030,
        text: t('rpc.rococo.phala', 'Phala PC1', { ns: 'apps-config' }),
        providers: {
          Phala: createProviderUrl('wss://rococov1.phala.network/ws')
        }
      },
      {
        info: 'rococoPhoenix',
        isDisabled: true, // Rococo reset
        paraId: 6806,
        text: t('rpc.rococo.phoenix', 'PHOENIX PC1', { ns: 'apps-config' }),
        providers: {
          'PHOENIX Protocol': createProviderUrl('wss://phoenix-ws.coinid.pro')
        }
      },
      {
        info: 'rococoPlasm',
        isDisabled: true, // Rococo reset
        paraId: 5000,
        text: t('rpc.rococo.plasm', 'Plasm PC2', { ns: 'apps-config' }),
        providers: {
          PlasmNetwork: createProviderUrl('wss://rpc.rococo.plasmnet.io')
        }
      },
      {
        info: 'rococoPolkabtc',
        isDisabled: true, // Rococo reset
        paraId: 21,
        text: t('rpc.rococo.polkabtc', 'PolkaBTC PC1', { ns: 'apps-config' }),
        providers: {
          Interlay: createProviderUrl('wss://rococo.polkabtc.io/api/parachain')
        }
      },
      {
        info: 'rococoPolkaFoundry',
        isDisabled: true, // Rococo reset
        paraId: 1111,
        text: t('rpc.rococo.polkafoundry', 'PolkaFoundry PC1', { ns: 'apps-config' }),
        providers: {
          PolkaFoundry: createProviderUrl('wss://rococo.polkafoundry.com')
        }
      },
      {
        info: 'rococoPrism',
        isDisabled: true, // Rococo reset
        paraId: 2002,
        text: t('rpc.rococo.prism', 'Prism PC1', { ns: 'apps-config' }),
        providers: {
          Prism: createProviderUrl('wss://rococo.psm.link')
        }
      },
      {
        info: 'rococoRobonomics',
        isDisabled: true, // Rococo reset
        paraId: 3000,
        text: t('rpc.rococo.robonomics', 'Robonomics PC2', { ns: 'apps-config' }),
        providers: {
          Airalab: createProviderUrl('wss://rococo.parachain.robonomics.network')
        }
      },
      {
        info: 'rococoSubDAO',
        isDisabled: true, // Rococo reset
        paraId: 888,
        text: t('rpc.rococo.subdao', 'SubDAO PC1', { ns: 'apps-config' }),
        providers: {
          SubDAONetwork: createProviderUrl('wss://parachain.subdao.network')
        }
      },
      {
        info: 'rococoSubsocial',
        isDisabled: true, // Rococo reset
        paraId: 28,
        text: t('rpc.rococo.subsocial', 'Subsocial PC1', { ns: 'apps-config' }),
        providers: {
          DappForce: createProviderUrl('wss://roc.subsocial.network')
        }
      },
      {
        info: 'rococoTrustBase',
        isDisabled: true, // Rococo reset
        paraId: 6633,
        text: t('rpc.rococo.trustbase', 'TrustBase PC1', { ns: 'apps-config' }),
        providers: {
          TrustBase: createProviderUrl('wss://rococo.trustednodes.net')
        }
      },
      {
        info: 'rococoUnitv',
        isDisabled: true, // Rococo reset
        paraId: 3,
        text: t('rpc.rococo.unitv', 'Unit Network', { ns: 'apps-config' }),
        providers: {
          'Unit Network': createProviderUrl('wss://unitp.io')
        }
      },
      {
        info: 'rococoVln',
        paraId: 2007,
        text: t('rpc.rococo.vln', 'Valibre Network PC', { ns: 'apps-config' }),
        providers: {
          Valibre:  createProviderUrl('wss://testnet.valibre.dev')
        }
      },
      {
        info: 'rococoZeitgeist',
        isDisabled: true, // Rococo reset
        paraId: 9123,
        text: t('rpc.rococo.zeitgeist', 'Zeitgeist PC', { ns: 'apps-config' }),
        providers: {
          Zeitgeist: createProviderUrl('wss://roc.zeitgeist.pm')
        }
      },
      {
        info: 'rococoZenlink',
        isDisabled: true, // Rococo reset
        paraId: 1188,
        text: t('rpc.rococo.zenlink', 'Zenlink PC1', { ns: 'apps-config' }),
        providers: {
          Zenlink: createProviderUrl('wss://rococo-parachain.zenlink.pro')
        }
      }
    ]
  };
}
