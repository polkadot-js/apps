// Copyright 2017-2021 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

// overrides based on the actual software node type, valid values are one of -
// polkadot, substrate, beachball, robohash

export const identityNodes: Record<string, string> = [
  ['centrifuge chain', 'polkadot'],
  ['edgeware-node', 'substrate'],
  ['joystream-node', 'beachball'],
  ['node-template', 'substrate'],
  ['parity-polkadot', 'polkadot'],
  ['phala-substrate-node', 'substrate'],
  ['polkadot-js', 'polkadot'],
  ['subsocial-node', 'substrate'],
  ['substrate-node', 'substrate'],
  ['polymesh-node', 'substrate']
].reduce((icons, [node, icon]): Record<string, string> => ({
  ...icons,
  [node.toLowerCase().replace(/-/g, ' ')]: icon
}), {});

export const identitySpec: Record<string, string> = [
  ['rococo', 'polkadot'],
  ['statemine', 'polkadot'],
  ['statemint', 'polkadot'],
  ['westend', 'polkadot'],
  ['westmint', 'polkadot']
].reduce((icons, [spec, icon]): Record<string, string> => ({
  ...icons,
  [spec.toLowerCase().replace(/-/g, ' ')]: icon
}), {});
