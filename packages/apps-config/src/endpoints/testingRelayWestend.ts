// Copyright 2017-2022 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { EndpointOption } from './types';

import { WESTEND_GENESIS } from '../api/constants';
import { getTeleports } from './util';

/* eslint-disable sort-keys */

// The available endpoints that will show in the dropdown. For the most part (with the exception of
// Polkadot) we try to keep this to live chains only, with RPCs hosted by the community/chain vendor
//   info: The chain logo name as defined in ../ui/logos/index.ts in namedLogos (this also needs to align with @polkadot/networks)
//   text: The text to display on the dropdown
//   providers: The actual hosted secure websocket endpoint
//
// IMPORTANT: Alphabetical based on text
export const testParasWestend: EndpointOption[] = [];

export const testParasWestendCommon: EndpointOption[] = [];

export const testRelayWestend: EndpointOption = {
  dnslink: 'westend',
  genesisHash: WESTEND_GENESIS,
  info: 'westend',
  text: 'Westend',
  providers: {
    Parity: 'wss://westend-rpc.polkadot.io',
    OnFinality: 'wss://westend.api.onfinality.io/public-ws',
    Pinknode: 'wss://rpc.pinknode.io/westend/explorer',
    Dwellir: 'wss://westend-rpc.dwellir.com',
    // 'NodeFactory(Vedran)': 'wss://westend.vedran.nodefactory.io/ws', // https://github.com/polkadot-js/apps/issues/5580
    // NOTE: Keep this as the last entry, nothing after it
    'light client': 'light://substrate-connect/westend' // NOTE: Keep last
  },
  teleport: [],
  linked: [
    ...testParasWestendCommon,
    ...testParasWestend
  ]
};
