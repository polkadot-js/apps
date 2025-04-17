// Copyright 2017-2025 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { EndpointOption } from './types.js';

import {
  chains3dpassSVG,
  chainsAcalaSVG,
  chainsAlephSVG,
  chainsAllfeatSVG,
  chainsAnalogSVG,
  chainsArgonSVG,
  chainsBrainstormPNG,
  chainsChainflipPNG,
  chainsCreditcoinTestPNG,
  chainsDebioSVG,
  chainsEquilibriumSVG,
  chainsFerrumPNG,
  chainsFragnovaPNG,
  chainsJurPNG,
  chainsKintsugiPNG,
  chainsLiberlandPNG,
  chainsLogionPNG,
  chainsMyriadPNG,
  chainsQuantumFusionPNG,
  chainsShidenPNG,
  chainsSkyekiwiPNG,
  chainsTanglePNG,
  chainsVaraTestnetPNG
} from '../ui/logos/chains/index.js';
import { nodesArcticPNG, nodesAresGladiosSVG, nodesAutonomysPNG, nodesBifrostSVG, nodesBitcountryPNG, nodesCereSVG, nodesCessPNG, nodesCloverSVG, nodesCrustMaxwellSVG, nodesCurioSVG, nodesDanceboxSVG, nodesDatahighwayPNG, nodesDockPNG, nodesDolphinSVG, nodesDotmogSVG, nodesEdgewareWhitePNG, nodesEncointerBlueSVG, nodesFantourPNG, nodesGalitalLogoPNG, nodesGamepowerSVG, nodesGeekSVG, nodesInterlaySVG, nodesIpsePNG, nodesJazPNG, nodesJupiterSVG, nodesKarmachainSVG, nodesKhalaSVG, nodesKlugPNG, nodesKylinPNG, nodesLaminarCircleSVG, nodesMantaPNG, nodesMathSVG, nodesMinixPNG, nodesMoonbaseAlphaSVG, nodesMybankPNG, nodesNftmartPNG, nodesNodleSVG, nodesOpalLogoPNG, nodesOpportunityPNG, nodesPhalaSVG, nodesPhoenixPNG, nodesPhykenNetworkPNG, nodesPichiuPNG, nodesPolkadexSVG, nodesPolkafoundrySVG, nodesPolymeshSVG, nodesPontemSVG, nodesPrismPNG, nodesRealisPNG, nodesRiochainSVG, nodesSherpaxPNG, nodesSoonsocialPNG, nodesSoraSubstrateSVG, nodesSubdaoPNG, nodesSubgameSVG, nodesSubspacePNG, nodesSubstrateHexagonSVG, nodesTernoaSVG, nodesThebifrostPNG, nodesUniartsPNG, nodesUniqueSVG, nodesUnitnetworkPNG, nodesWeb3gamesSVG, nodesZCloakSVG, nodesZeroSVG, nodesZkVerifyPNG } from '../ui/logos/nodes/index.js';

export * from './testingRelayPaseo.js';
export * from './testingRelayWestend.js';

// The available endpoints that will show in the dropdown. For the most part (with the exception of
// Polkadot) we try to keep this to live chains only, with RPCs hosted by the community/chain vendor
//   info: The chain logo name as defined in ../ui/logos/index.ts in namedLogos (this also needs to align with @polkadot/networks)
//   text: The text to display on the dropdown
//   providers: The actual hosted secure websocket endpoint
//
// IMPORTANT: Alphabetical based on text
export const testChains: Omit<EndpointOption, 'teleport'>[] = [
  {
    info: 'qf2',
    providers: {
      'Quantum Fusion': 'wss://test.qfnetwork.xyz'
    },
    text: 'QF',
    ui: {
      color: '#000000',
      logo: chainsQuantumFusionPNG
    }
  }
];
