// Copyright 2017-2021 @polkadot/app-config authors & contributors
// and @canvas-ui/app-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

// overrides based on the actual software node type
const identityNodes: Record<string, string> = [
  ['centrifuge chain', 'polkadot'],
  ['edgeware-node', 'substrate'],
  ['joystream-node', 'beachball'],
  ['node-template', 'substrate'],
  ['parity-polkadot', 'polkadot'],
  ['polkadot-js', 'polkadot'],
  ['substrate-node', 'substrate']
].reduce((icons, [spec, icon]): Record<string, string> => ({
  ...icons,
  [spec.toLowerCase().replace(/-/g, ' ')]: icon
}), {});

export {
  identityNodes
};
