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
    info: 'bspNetBsp',
    providers: {
      Local: 'ws://127.0.0.1:9666' as `wss://${string}`
    },
    text: 'BSPNet: BSP',
    ui: {
      color: '#00CCAB',
      logo: chainsStorageHubSVG
    }
  },
  {
    info: 'bspNetUser',
    providers: {
      Local: 'ws://127.0.0.1:9888' as `wss://${string}`
    },
    text: 'BSPNet: User',
    ui: {
      color: '#F5F5F5',
      logo: chainsStorageHubSVG
    }
  },
  {
    info: 'fullNetBsp',
    providers: {
      Local: 'ws://127.0.0.1:9666' as `wss://${string}`
    },
    text: 'FullNet: BSP',
    ui: {
      color: '#00CCAB',
      logo: chainsStorageHubSVG
    }
  },
  {
    info: 'fullNetMsp',
    providers: {
      Local: 'ws://127.0.0.1:9777' as `wss://${string}`
    },
    text: 'FullNet: MSP',
    ui: {
      color: '#03e3fc',
      logo: chainsStorageHubSVG
    }
  },
  {
    info: 'bspNetUser',
    providers: {
      Local: 'ws://127.0.0.1:9888' as `wss://${string}`
    },
    text: 'FullNet: User',
    ui: {
      color: '#F5F5F5',
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
  }
];
