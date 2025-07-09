// Copyright 2017-2025 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

// overrides based on the actual software node type, valid values are one of -
// polkadot, substrate, beachball, robohash

export const identityNodes: Record<string, string> = [
  ['centrifuge chain', 'polkadot'],
  ['joystream-node', 'beachball'],
  ['litentry-node', 'polkadot'],
  ['parity-polkadot', 'polkadot']
].reduce((icons, [node, icon]): Record<string, string> => ({
  ...icons,
  [node.toLowerCase().replace(/-/g, ' ')]: icon
}), {});

export const identitySpec: Record<string, string> = [
  ['kusama', 'polkadot'],
  ['polkadot', 'polkadot'],
  ['rococo', 'polkadot'],
  ['westend', 'polkadot'],
  ['paseo', 'polkadot']
].reduce((icons, [spec, icon]): Record<string, string> => ({
  ...icons,
  [spec.toLowerCase().replace(/-/g, ' ')]: icon
}), {});
