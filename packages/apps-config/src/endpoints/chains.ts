// SPDX-License-Identifier: Apache-2.0
// Copyright 2017-2022 @polkadot/apps-config authors & contributors

import type { EndpointOption } from './types.js';

import { nodesPolymeshSVG } from '../ui/logos/nodes/index.js';


/* eslint-disable sort-keys */

// The available endpoints that will show in the dropdown. For the most part (with the exception of
// Polkadot) we try to keep this to live chains only, with RPCs hosted by the community/chain vendor
//   info: The chain logo name as defined in ../ui/logos/index.ts in namedLogos (this also needs to align with @polkadot/networks)
//   text: The text to display on the dropdown
//   providers: The actual hosted secure websocket endpoint
//
// IMPORTANT: Alphabetical based on text
export const chains: EndpointOption[] = [
  {
    info: 'polymesh',
    text: 'Polymesh Staging',
    providers: {
      Polymath: 'wss://staging-rpc.polymesh.live'
    },
    ui: {
      color: 'linear-gradient(197deg, #FF2E72, #4A125E)',
      logo: nodesPolymeshSVG
    }
  }
];
