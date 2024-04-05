// Copyright 2017-2024 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { EndpointOption } from './types.js';

import { chainsFrequencyPaseoSVG, chainsPaseoBgPNG, chainsPaseoPNG } from '@polkadot/apps-config/ui/logos/chains';
import { nodesIntegriteeSVG } from '@polkadot/apps-config/ui/logos/nodes';

import { PASEO_GENESIS } from '../api/constants.js';
// import { testnetParachainSVG } from '../ui/logos/nodes/index.js';
import { getTeleports } from './util.js';

// The available endpoints that will show in the dropdown. For the most part (with the exception of
// Polkadot) we try to keep this to live chains only, with RPCs hosted by the community/chain vendor
//   info: The chain logo name as defined in ../ui/logos/index.ts in namedLogos (this also needs to align with @polkadot/networks)
//   text: The text to display on the dropdown
//   providers: The actual hosted secure websocket endpoint
//
// IMPORTANT: Alphabetical based on text
export const testParasPaseo: Omit<EndpointOption, 'teleport'>[] = [
  // {
  //   homepage: 'https://testPaseoParachainExample.com',
  //   info: 'paseoparachain',
  //   paraId: 2345,
  //   providers: {
  //     Acurast: 'wss://paseo-parachain-testnet-ws.prod.gke.papers.tech'
  //   },
  //   text: 'Testnet Parachain',
  //   ui: {
  //     color: '#000000',
  //     logo: testnetParachainSVG
  //   }
  // }
  {
    homepage: 'https://www.frequency.xyz',
    info: 'Frequency',
    paraId: 4000,
    providers: {
      Integritee: 'wss://0.rpc.testnet.amplica.io'
    },
    text: 'Frequency',
    ui: {
      color: '#19455E',
      logo: chainsFrequencyPaseoSVG
    }
  },
  {
    homepage: 'https://integritee.network',
    info: 'integritee',
    paraId: 2039,
    providers: {
      Integritee: 'wss://paseo.api.integritee.network'
    },
    text: 'Integritee Network (Paseo)',
    ui: {
      color: '#658ea9',
      logo: nodesIntegriteeSVG
    }
  }
];

export const testParasPaseoCommon: EndpointOption[] = [
  // {
  //   info: 'PaseoAssetHub',
  //   paraId: 1000,
  //   providers: {
  //     Dwellir: 'wss://paseo-asset-hub-rpc.dwellir.com',
  //     Parity: 'wss://paseo-asset-hub-rpc.polkadot.io'
  //   },
  //   teleport: [-1],
  //   text: 'AssetHub',
  //   ui: {
  //     color: '#77bb77',
  //     logo: nodesAssetHubSVG
  //   }
  // }
];

export const testRelayPaseo: EndpointOption = {
  dnslink: 'paseo',
  genesisHash: PASEO_GENESIS,
  info: 'paseo',
  linked: [
    ...testParasPaseoCommon,
    ...testParasPaseo
  ],
  providers: {
    Amforc: 'wss://paseo.rpc.amforc.com',
    'IBP-GeoDNS1': 'wss://rpc.ibp.network/paseo',
    'IBP-GeoDNS2': 'wss://rpc.dotters.network/paseo'
    // 'light client': 'light://substrate-connect/paseo'
  },
  teleport: getTeleports(testParasPaseoCommon),
  text: 'Paseo',
  ui: {
    color: `url(${chainsPaseoBgPNG}) #A0FED4`,
    identityIcon: 'polkadot',
    logo: chainsPaseoPNG
  }
};
