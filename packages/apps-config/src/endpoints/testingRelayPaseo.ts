// Copyright 2017-2025 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { EndpointOption } from './types.js';

import { chainsCoretimeKusamaSVG, chainsPaseoPNG, chainsPeoplePolkadotSVG, chainsQuantumFusionPNG } from '@polkadot/apps-config/ui/logos/chains';
import { nodesAjunaPNG, nodesAssetHubSVG, nodesAventusSVG, nodesBajunPNG, nodesBifrostSVG, nodesBridgeHubSVG, nodesDarwiniaKoiSVG, nodesHeimaPaseoPNG, nodesHyperbridgePNG, nodesIdealNetworkSVG, nodesIntegriteeSVG, nodesKiltIconSVG, nodesMandalaPNG, nodesMusePNG, nodesMyriadPaseoSVG, nodesNodleSVG, nodesRegionxPNG, nodesRexSVG, nodesXodePNG, nodesZeitgeistPNG } from '@polkadot/apps-config/ui/logos/nodes';

import { PASEO_GENESIS } from '../api/constants.js';
// import { testnetParachainSVG } from '../ui/logos/nodes/index.js';
import { getTeleports } from './util.js';

// The available endpoints that will show in the dropdown. For the most part (with the exception of
// Polkadot) we try to keep this to live chains only, with RPCs hosted by the community/chain vendor
//   info: The chain logo name as defined in ../ui/logos/index.ts in namedLogos (this also needs to align with @polkadot/networks)
//   text: The text to display on the dropdown
//   providers: The actual hosted secure websocket endpoint
//
export const devChains: Omit<EndpointOption, 'teleport'>[] = [
  {
    info: 'qf',
    providers: {
      'Quantum Fusion': 'wss://test.qfnetwork.xyz'
    },
    text: 'QF',
    ui: {
      color: '#000000',
      logo: chainsQuantumFusionPNG
    }
  },
];
