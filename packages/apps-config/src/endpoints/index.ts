// Copyright 2017-2025 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0
import type { TFunction, TOptions } from '../types.js';
import type { LinkOption } from './types.js';
import type { EndpointOption } from './types.js';
import { expandEndpoints } from './util.js';

// Remove ALL development imports to avoid ws:// endpoints
// export { CUSTOM_ENDPOINT_KEY } from './development.js';

// ESX Only Configuration
const ESX: EndpointOption = {
  info: 'ESX Testnet',
  text: 'ESX Testnet',
  providers: {
    'ESX': 'wss://rpc1-weu-testnet.esx.network'
  }
};

// Export empty arrays for all other chains
export const prodRelayPolkadot: EndpointOption[] = [ESX];
export const prodRelayKusama: EndpointOption[] = [];
export const prodParasPolkadot: EndpointOption[] = [];
export const prodParasKusama: EndpointOption[] = [];
export const prodParasPolkadotCommon: EndpointOption[] = [];
export const prodParasKusamaCommon: EndpointOption[] = [];
export const testRelayRococo: EndpointOption[] = [];
export const testRelayWestend: EndpointOption[] = [];
export const testRelayPaseo: EndpointOption[] = [];
export const testParasRococo: EndpointOption[] = [];
export const testParasWestend: EndpointOption[] = [];
export const testParasRococoCommon: EndpointOption[] = [];
export const testParasWestendCommon: EndpointOption[] = [];
export const prodChains: EndpointOption[] = [];
export const testChains: EndpointOption[] = [];
export const prodParas: EndpointOption[] = [];
export const testParas: EndpointOption[] = [];

function defaultT (keyOrText: string, text?: string | TOptions, options?: TOptions): string {
  return (
    (options?.replace?.host as string) ||
    text?.toString() ||
    keyOrText
  );
}

export function createWsEndpoints (t: TFunction = defaultT, firstOnly = false, withSort = true): LinkOption[] {
  // Only return ESX endpoint - nothing else
  return [{
    info: 'esx',
    text: 'ESX Testnet',
    textBy: 'ESX Network',
    value: 'wss://rpc1-weu-testnet.esx.network',
    ui: {
      color: '#011a22',
      logo: 'substrate'
    }
  }];
}

// Export a dummy CUSTOM_ENDPOINT_KEY to prevent errors
export const CUSTOM_ENDPOINT_KEY = 'polkadot-apps-custom-endpoints';
