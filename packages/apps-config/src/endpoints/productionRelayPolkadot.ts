// Copyright 2017-2021 @polkadot/apps-config authors & contributors
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
      'Patract Elara': 'wss://pub.elara.patract.io/polkadot',
      'Geometry Labs': 'wss://polkadot.geometry.io/websockets',
      // Dwellir: 'wss://polkadot-rpc.dwellir.com',
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
        text: t('rpc.polkadot.statemint-shell', 'Statemint (Shell)', { ns: 'apps-config' }),
        providers: {
          Parity: 'wss://statemint-shell.polkadot.io'
        }
      },
      /// (3) parachains with id, see Rococo (info here maps to the actual "named icon")
      //
      // NOTE: Added alphabetical based on chain name
      {
        info: 'bifrost',
        homepage: 'https://dot.bifrost.app/?ref=polkadotjs',
        paraId: 2001,
        isUnreachable: true,
        text: t('rpc.polkadot.bifrost', 'Bifrost', { ns: 'apps-config' }),
        providers: {
          Liebi: 'wss://bifrost-rpc.liebi.com/ws',
          OnFinality: 'wss://bifrost-parachain.api.onfinality.io/public-ws',
          'Patract Elara': 'wss://pub.elara.patract.io/bifrost'
        }
      },

      {
        info: 'parallel',
        homepage: 'https://parallel.fi',
        isUnreachable: true,
        paraId: 2085,
        text: t('rpc.polkadot.parallel', 'Parallel', { ns: 'apps-config' }),
        providers: {
          OnFinality: 'wss://parallel.api.onfinality.io/public-ws',
          Parallel: 'wss://rpc.parallel.fi'
        }
      }
    ]
  };
}
