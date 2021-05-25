// Copyright 2017-2021 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { TFunction } from 'i18next';
import type { EndpointOption } from './types';

import { WESTEND_GENESIS } from '../api/constants';

/* eslint-disable sort-keys */

// The available endpoints that will show in the dropdown. For the most part (with the exception of
// Polkadot) we try to keep this to live chains only, with RPCs hosted by the community/chain vendor
//   info: The chain logo name as defined in ../ui/logos/index.ts in namedLogos (this also needs to align with @polkadot/networks)
//   text: The text to display on the dropdown
//   value: The actual hosted secure websocket endpoint

// Based on history, this will expand so keep it as a singular chunk
export function createWestend (t: TFunction): EndpointOption {
  return {
    dnslink: 'westend',
    genesisHash: WESTEND_GENESIS,
    info: 'westend',
    text: t('rpc.westend', 'Westend', { ns: 'apps-config' }),
    providers: {
      Parity: 'wss://westend-rpc.polkadot.io',
      'NodeFactory(Vedran)': 'wss://westend.vedran.nodefactory.io/ws',
      'Patract Elara': 'wss://westend.elara.patract.io',
      OnFinality: 'wss://westend.api.onfinality.io/public-ws'
    },
    linked: [
      // (1) system parachains (none available yet)
      // ...
      // (2) common good, leave as second group
      {
        info: 'shell',
        paraId: 1070,
        text: t('rpc.westend.shell', 'Shell', { ns: 'apps-config' }),
        providers: {
          Parity: 'wss://westend-shell-rpc.parity.io'
        }
      },
      {
        info: 'moonshadow',
        paraId: 2002,
        text: t('rpc.westend.moonshadow', 'Moonshadow', { ns: 'apps-config' }),
        providers: {
          Purestake: 'wss://wss.moonshadow.testnet.moonbeam.network'
        }
      }
      // (3) parachains with id, see Rococo (info here maps to the actual "named icon")
      //
      // NOTE: Added alphabetical based on chain name
    ]
  };
}
