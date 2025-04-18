// Copyright 2017-2025 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type {EndpointOption} from './types.js';

import {
  chainsQuantumFusionPNG,
} from '../ui/logos/chains/index.js';

export * from './testingRelayWestend.js';

export const mainChains: Omit<EndpointOption, 'teleport'>[] = [
  {
    info: 'qf2',
    providers: {
      'Quantum Fusion': 'wss://main.qfnetwork.xyz'
    },
    text: 'Quantum Fusion',
    ui: {
      color: '#000000',
      logo: chainsQuantumFusionPNG
    }
  }
];

export const devChains: Omit<EndpointOption, 'teleport'>[] = [
  {
    info: 'qf',
    providers: {
      'Quantum Fusion': 'wss://dev.qfnetwork.xyz'
    },
    text: 'QF Devnet',
    ui: {
      color: '#000000',
      logo: chainsQuantumFusionPNG
    }
  },
];

export const testChains: Omit<EndpointOption, 'teleport'>[] = [
  {
    info: 'qf',
    providers: {
      'Quantum Fusion': 'wss://test.qfnetwork.xyz'
    },
    text: 'QF Testnet',
    ui: {
      color: '#000000',
      logo: chainsQuantumFusionPNG
    }
  }
];


export const mainParaChains: Omit<EndpointOption, 'teleport'>[] = [
  {
    info: 'qf',
    providers: {
      'Quantum Fusion': 'wss://para.main.qfnetwork.xyz'
    },
    text: 'Quantum Fusion',
    ui: {
      color: '#000000',
      logo: chainsQuantumFusionPNG
    }
  }
];

export const devParaChains: Omit<EndpointOption, 'teleport'>[] = [
  {
    info: 'qf',
    providers: {
      'Quantum Fusion': 'wss://para-dev.qfnetwork.xyz'
    },
    isDisabled: true,
    text: 'QF Devnet Parachain (Paseo)',
    ui: {
      color: '#000000',
      logo: chainsQuantumFusionPNG
    }
  }
];

export const testParaChains: Omit<EndpointOption, 'teleport'>[] = [
  {
    info: 'qf',
    providers: {
      'Quantum Fusion': 'wss://para-test.qfnetwork.xyz'
    },
    text: 'QF Testnet Parachain (Paseo)',
    ui: {
      color: '#000000',
      logo: chainsQuantumFusionPNG
    }
  }
];
