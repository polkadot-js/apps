// Copyright 2017-2023 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { EndpointOption } from './types.js';

import { chainsAlephSVG } from '../ui/logos/chains/index.js';

// The available endpoints that will show in the dropdown. For the most part (with the exception of
// Polkadot) we try to keep this to live chains only, with RPCs hosted by the community/chain vendor
//   info: The chain logo name as defined in ../ui/logos/index.ts in namedLogos (this also needs to align with @polkadot/networks)
//   text: The text to display on the dropdown
//   providers: The actual hosted secure websocket endpoint
//
// IMPORTANT: Alphabetical based on text
export const prodChains: Omit<EndpointOption, 'teleport'>[] = [{
  info: 'aleph',
  providers: {
    'Aleph Zero Foundation': 'wss://ws.azero.dev'
  },
  text: 'Aleph Zero',
  ui: {
    color: '#00CCAB',
    logo: chainsAlephSVG
  }
}];
