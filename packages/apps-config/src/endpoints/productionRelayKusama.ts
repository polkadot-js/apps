// Copyright 2017-2024 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { EndpointOption } from './types.js';

import { KUSAMA_GENESIS } from '../api/constants.js';
import { chainsKusamaSVG } from '../ui/logos/chains/index.js';
import { nodesEncointerBlueSVG, nodesIntegriteeSVG } from '../ui/logos/nodes/index.js';
import { getTeleports } from './util.js';

// The available endpoints that will show in the dropdown. For the most part (with the exception of
// Polkadot) we try to keep this to live chains only, with RPCs hosted by the community/chain vendor
//   info: The chain logo name as defined in ../ui/logos/index.ts in namedLogos (this also needs to align with @polkadot/networks)
//   text: The text to display on the dropdown
//   providers: The actual hosted secure websocket endpoint
//
// IMPORTANT: Alphabetical based on text
export const prodParasKusama: Omit<EndpointOption, 'teleport'>[] = [
  {
    homepage: 'https://integritee.network',
    info: 'integritee',
    paraId: 2015,
    providers: {
      brenzi: 'wss://integritee-kusama.chainbricks.synology.me:4210',
      Integritee: 'wss://kusama.api.integritee.network',
    },
    text: 'Integritee Network',
    ui: {
      color: '#2e154b',
      logo: nodesIntegriteeSVG
    }
  }
];

export const prodParasKusamaCommon: EndpointOption[] = [
  {
    homepage: 'https://encointer.org/',
    info: 'encointer',
    paraId: 1001,
    providers: {
      'Encointer Association': 'wss://kusama.api.encointer.org',
      brenzi: 'wss://encointer-kusama.chainbricks.synology.me:4220'
    },
    teleport: [], // teleport is temporarily disabled until xcm V3 is supported
    text: 'Encointer Network',
    ui: {
      color: '#0000cc',
      logo: nodesEncointerBlueSVG
    }
  }
];

export const prodRelayKusama: EndpointOption = {
  dnslink: 'kusama',
  genesisHash: KUSAMA_GENESIS,
  info: 'kusama',
  linked: [
    ...prodParasKusamaCommon,
    ...prodParasKusama
  ],
  providers: {
    brenzi1: 'wss://kusama.chainbricks.synology.me:4200',
    brenzi2: 'wss://kusama2.chainbricks.synology.me:4201',
    'light client': 'light://substrate-connect/kusama'
  },
  teleport: getTeleports(prodParasKusamaCommon),
  text: 'Kusama',
  ui: {
    color: '#000000',
    identityIcon: 'polkadot',
    logo: chainsKusamaSVG
  }
};
