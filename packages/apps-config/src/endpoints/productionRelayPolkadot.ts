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
      'Patract Elara': 'wss://polkadot.elara.patract.io'
    },
    linked: [
      // parachains with id, see Rococo
      // alphabetical based on chain name
    ]
  };
}
