// Copyright 2017-2024 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { EndpointOption } from './types.js';

import { POLKADOT_GENESIS } from '../api/constants.js';
import { chainsAcalaSVG, chainsBitgreenPNG, chainsComposableFinancePNG, chainsEquilibriumSVG, chainsFrequencySVG, chainsGeminisPNG, chainsInvarchJPEG, chainsLogionPNG, chainsNeurowebPNG, chainsOakPNG, chainsPeaqPNG, chainsPendulumSVG, chainsPolkadotCircleSVG, chainsSnakenetSVG, chainsTotemSVG, chainsWatrPNG } from '../ui/logos/chains/index.js';
import { nodesAjunaPNG, nodesAresOdysseySVG, nodesAssetHubSVG, nodesAstarPNG, nodesAventusSVG, nodesBifrostSVG, nodesBridgeHubSVG, nodesCentrifugePNG, nodesCloverSVG, nodesCoinversationPNG, nodesContinuumPNG, nodesCrustParachainSVG, nodesDarwiniaSVG, nodesEfinitySVG, nodesEwxSVG, nodesHashedPNG, nodesHyperbridgeSVG, nodesIntegriteeSVG, nodesInterlaySVG, nodesKiltPNG, nodesKylinPNG, nodesLitentryPNG, nodesMantaPNG, nodesMoonbeamSVG, nodesMoonsamaSVG, nodesMythosPNG, nodesNodleSVG, nodesOmnibtcSVG, nodesParallelSVG, nodesPhalaSVG, nodesPolimecSVG, nodesPolkadexSVG, nodesSoraSubstrateSVG, nodesSubdaoPNG, nodesSubgameSVG, nodesSubsocialSVG, nodesT3rnPNG, nodesUniqueSVG, nodesZeitgeistPNG } from '../ui/logos/nodes/index.js';
import { getTeleports } from './util.js';

// The available endpoints that will show in the dropdown. For the most part (with the exception of
// Polkadot) we try to keep this to live chains only, with RPCs hosted by the community/chain vendor
//   info: The chain logo name as defined in ../ui/logos/index.ts in namedLogos (this also needs to align with @polkadot/networks)
//   text: The text to display on the dropdown
//   providers: The actual hosted secure websocket endpoint
//
// IMPORTANT: Alphabetical based on text
export const prodParasPolkadot: Omit<EndpointOption, 'teleport'>[] = [
  {
    homepage: 'https://integritee.network',
    info: 'integritee',
    paraId: 2039,
    providers: {
      brenzi: 'wss://integritee-polkadot.chainbricks.synology.me:4110',
      Integritee: 'wss://polkadot.api.integritee.network'
    },
    text: 'Integritee Network',
    ui: {
      color: '#658ea9',
      logo: nodesIntegriteeSVG
    }
  },
  {
    homepage: 'https://integritee.network',
    info: 'integritee',
    paraId: 2039,
    providers: {
      // Dwellir: 'wss://integritee-rpc.dwellir.com',
      // Integritee: 'wss://polkadot.api.integritee.network'
    },
    text: 'Integritee Network',
    ui: {
      color: '#2e154b',
      logo: nodesIntegriteeSVG
    }
  }
];

export const prodParasPolkadotCommon: EndpointOption[] = [
];

export const prodRelayPolkadot: EndpointOption = {
  dnslink: 'polkadot',
  genesisHash: POLKADOT_GENESIS,
  info: 'polkadot',
  linked: [
    ...prodParasPolkadotCommon,
    ...prodParasPolkadot
  ],
  providers: {
    // 'Geometry Labs': 'wss://polkadot.geometry.io/websockets', // https://github.com/polkadot-js/apps/pull/6746
    // 'Automata 1RPC': 'wss://1rpc.io/dot',
    brenzi: 'wss://polkadot.chainbricks.synology.me:4100',
    'light client': 'light://substrate-connect/polkadot'
  },
  teleport: getTeleports(prodParasPolkadotCommon),
  text: 'Polkadot',
  ui: {
    color: '#e6007a',
    identityIcon: 'polkadot',
    logo: chainsPolkadotCircleSVG
  }
};
