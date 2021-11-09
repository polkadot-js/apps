// Copyright 2017-2021 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* eslint sort-keys: ["error", "asc", { caseSensitive: false }] */

// The mapping here is done on the actual chain name (system.chain RPC) or
// the actual RPC node it is corrected to (system.name RPC)

// anything for a specific chain, most would probably fit into the node category (but allow for chain-specific)
// alphabetical
import { sanitize } from '../util';
import chainCord from './chains/cord-v2-test.svg';
import chainRoyalBlue from './chains/cord-studio.svg';
import chainIndianTeal from './chains/cord-teal.svg';
import chainCordDev from './chains/cord-dev.svg';
import chainCordLocal from './chains/cord-dev.svg';
import chainCordStaging from './chains/cord-v2-test.svg';
import extensionPolkadotJs from './extensions/polkadot-js.svg';

import emptyLogo from './chains/cord-empty.svg';
// last-resort fallback, just something empty

// Alphabetical overrides based on the actual matched chain name
// NOTE: This is as retrieved via system.chain RPC
export const chainLogos = Object.entries({
  'Dev. Node': chainCordDev,
  'Local': chainCordLocal,
  'Staging': chainCordStaging,
  'Amber Glow': chainCordStaging,
  'Royal Blue': chainRoyalBlue,
  'Indian Teal': chainIndianTeal
}).reduce<Record<string, unknown>>((logos, [chain, logo]) => ({
  ...logos,
  [sanitize(chain)]: logo
}), {});

// Alphabetical overrides based on the actual software node type
// NOTE: This is as retrieved via system.name RPC
export const nodeLogos = Object.entries({

  // 'Zenlink Collator': nodeZenlink
}).reduce<Record<string, unknown>>((logos, [node, logo]) => ({
  ...logos,
  [sanitize(node)]: logo
}), {});

// Alphabetical overrides based on the actual specName
export const specLogos = Object.entries({
  // shell: nodeShell,
  // statemine: nodeStatemine,
  // statemint: nodeStatemine,
  // westmint: nodeStatemine
}).reduce<Record<string, unknown>>((logos, [spec, logo]) => ({
  ...logos,
  [sanitize(spec)]: logo
}), {});

// Alphabetical overrides when we pass an explicit logo name
// NOTE: Matches with what is defined as "info" in settings/endpoints.ts
// (Generally would be the 'network' key in the known ss58 as per
// https://github.com/polkadot-js/common/blob/master/packages/networks/src/index.ts)
export const namedLogos: Record<string, unknown> = {
  cord: chainCord,
  'Dev. Node': chainCordDev,
  'Local': chainCordLocal,
  'Staging': chainCordStaging,
  'Amber Glow': chainCordStaging,
  'Royal Blue (Studio)': chainRoyalBlue,
  'Indian Teal': chainIndianTeal,
  empty: emptyLogo,
};

// extension logos
export const extensionLogos: Record<string, unknown> = {
  'polkadot-js': extensionPolkadotJs
};

// external logos, i.e. for explorers
export const externalLogos: Record<string, unknown> = {
  // commonwealth: externalCommonwealth,
  // dotreasury: externalDotreasury,
  // dotscanner: externalDotScanner,
  // polkascan: externalPolkascan,
  // polkassembly: externalPolkassembly,
  // polkastats: externalPolkastats,
  // statescan: externalStatescan,
  // subid: externalSubId,
  // subscan: externalSubscan
};

// empty logos
export const emptyLogos: Record<string, unknown> = {
  empty: emptyLogo
};

// preload all
[chainLogos, extensionLogos, externalLogos, namedLogos, nodeLogos, emptyLogos].forEach((imageSet): void => {
  Object.values(imageSet).forEach((src): void => {
    new Image().src = src as string;
  });
});
