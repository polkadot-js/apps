// Copyright 2017-2021 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { TFunction } from 'i18next';
import type { EndpointOption } from './types';

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
    genesisHash: '0xe2bcff61f49d41ef837b92331a3f02dee14fa59723bc850697f516c5376cde1c',
    info: 'rococo',
    text: t('rpc.rococo', 'Rococo', { ns: 'apps-config' }),
    providers: {
      Parity: 'wss://rococo-rpc.polkadot.io',
      OnFinality: 'wss://rococo.api.onfinality.io/public-ws',
      'Patract Elara': 'wss://rococo.elara.patract.io'
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
        info: 'rococoBifrost',
        paraId: 107,
        text: t('rpc.rococo.bifrost', 'Bifrost PC1', { ns: 'apps-config' }),
        providers: {
          Bifrost: 'wss://rococo-1.testnet.liebi.com'
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
        info: 'rococoAcala',
        paraId: 666,
        text: t('rpc.rococo.acala', 'Mandala PC2', { ns: 'apps-config' }),
        providers: {
          Acala: 'wss://rococo-1.acala.laminar.one/ws'
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
        info: 'rococoRobonomics',
        paraId: 3000,
        text: t('rpc.rococo.robonomics', 'Robonomics PC2', { ns: 'apps-config' }),
        providers: {
          Airalab: 'wss://rococo.parachain.robonomics.network'
        }
      }
    ]
  };
}
