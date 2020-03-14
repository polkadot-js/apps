// Copyright 2017-2020 @polkadot/apps-config authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

const defaultColor = undefined; // '#f19135'
const emptyColor = '#999';

const chainKulupu = '#003366';
const chainKusama = '#d32e79';
const chainWestend = '#da68a7';

const nodeCentrifuge = '#fcc367';
const nodeEdgeware = '#0a95df';

// overrides based on the actual matched chain name
const chainColors: Record<string, any> = [
  ['Kulupu', chainKulupu],
  ['Kusama', chainKusama], // new name after CC3
  ['Kusama CC1', chainKusama],
  ['Kusama CC2', chainKusama],
  ['Kusama CC3', chainKusama],
  ['Westend', chainWestend]
].reduce((colors, [chain, color]): Record<string, any> => ({
  ...colors,
  [chain.toLowerCase()]: color
}), {});

// overrides based on the actual software node type (all '-' converted to ' ')
const nodeColors: Record<string, any> = [
  ['centrifuge chain', nodeCentrifuge],
  ['edgeware node', nodeEdgeware]
  // ['node template', emptyColor],
  // ['parity polkadot', emptyColor],
  // ['substrate node', emptyColor]
].reduce((colors, [node, color]): Record<string, any> => ({
  ...colors,
  [node.toLowerCase().replace(/-/g, ' ')]: color
}), {});

export {
  defaultColor,
  chainColors,
  emptyColor,
  nodeColors
};
