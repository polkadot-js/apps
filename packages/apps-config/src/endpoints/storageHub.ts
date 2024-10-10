// Copyright 2017-2024 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { EndpointOption } from './types.js';

import { chainsStorageHubSVG } from '../ui/logos/chains/generated/storage-hubSVG.js';

// The available endpoints that will show in the dropdown. For the most part (with the exception of
// Polkadot) we try to keep this to live chains only, with RPCs hosted by the community/chain vendor
//   info: The chain logo name as defined in ../ui/logos/index.ts in namedLogos (this also needs to align with @polkadot/networks)
//   text: The text to display on the dropdown
//   providers: The actual hosted secure websocket endpoint
//
// IMPORTANT: Alphabetical based on text
export const storageHubChains: Omit<EndpointOption, 'teleport'>[] = [
  {
    info: 'bsp',
    providers: {
      Local: 'ws://127.0.0.1:9666' as `wss://${string}`
    },
    text: 'BSP',
    ui: {
      color: '#00CCAB',
      logo: chainsStorageHubSVG
    }
  },
  {
    info: 'devNet',
    providers: {
      Local: 'ws://127.0.0.1:9944' as `wss://${string}`
    },
    text: 'DevNet',
    ui: {
      color: '#00CCAB',
      logo: chainsStorageHubSVG
    }
  },
  {
    info: 'msp',
    providers: {
      Local: 'ws://127.0.0.1:9777' as `wss://${string}`
    },
    text: 'MSP',
    ui: {
      color: '#03e3fc',
      logo: chainsStorageHubSVG
    }
  },
  {
    info: 'user',
    providers: {
      Local: 'ws://127.0.0.1:9888' as `wss://${string}`
    },
    text: 'User',
    ui: {
      color: '#F5F5F5',
      logo: chainsStorageHubSVG
    }
  }
];
