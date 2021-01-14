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
    genesisHash: '0x481550b70e974177e83cff4d554cea7166be3eaeb32f020b86542e76968ccd0e',
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
        info: 'rococoPlasm',
        paraId: 5000,
        text: t('rpc.rococo.plasm', 'Plasm PC2', { ns: 'apps-config' }),
        providers: {
          PlasmNetwork: 'wss://rpc.rococo.plasmnet.io'
        }
      }
    ]
  };
}
