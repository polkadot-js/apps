// Copyright 2017-2020 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

// defaults
const emptyColor = '#99999';

// based on chain name
// alphabetical
const chainCrab = '#7C30DD';
const chainCrust = '#ff8812';
const chainKulupu = '#003366';
const chainPhala = '#4dc56a';
const chainPlasm = '#2096F3';
const chainPolkadot = '#e6007a';
const chainKusama = '#000000';
const chainRocco = '#6f36dc';
const chainRoccoAcala = '#173DC9';
const chainRoccoDarwinia = '#7C30DD';
const chainRococoLaminar = '#004FFF';
const chainRoccoTick = '#22bb22';
const chainRoccoTrack = '#bb2222';
const chainRoccoTrick = '#2222bb';
const chainWestend = '#da68a7';

// based on node name
// alphabetical
const nodeCanvas = '#c77cff';
const nodeCentrifuge = '#fcc367';
const nodeEdgeware = '#0a95df';
const nodeEquilibrium = '#1792ff';
const nodeNodle = '#1ab394';
const nodeKilt = '#eb5b2a';
const nodeStafi = '#00F3AB';
const nodeSubsocial = '#b9018c';

// overrides based on the actual matched chain name
// alphabetical
const chainColors: Record<string, any> = [
  ['acala mandala pc1', chainRoccoAcala],
  ['Crab', chainCrab],
  ['crust maxwell cc2', chainCrust],
  ['darwinia parachain', chainRoccoDarwinia],
  ['Kulupu', chainKulupu],
  ['Kusama', chainKusama],
  ['Kusama CC1', chainKusama],
  ['Kusama CC2', chainKusama],
  ['Kusama CC3', chainKusama],
  ['laminar turbulence pc1', chainRococoLaminar],
  ['phala poc 2', chainPhala],
  ['Plasm', chainPlasm],
  ['Polkadot', chainPolkadot],
  ['Polkadot CC1', chainPolkadot],
  ['Rococo', chainRocco],
  ['Tick', chainRoccoTick],
  ['Track', chainRoccoTrack],
  ['Trick', chainRoccoTrick],
  ['Westend', chainWestend]
].reduce((colors, [chain, color]): Record<string, any> => ({
  ...colors,
  [chain.toLowerCase()]: color
}), {});

// overrides based on the actual software node type (all '-' converted to ' ')
// alphabetical
const nodeColors: Record<string, any> = [
  ['Canvas Node', nodeCanvas],
  ['centrifuge chain', nodeCentrifuge],
  ['Centrifuge Chain Node', nodeCentrifuge],
  ['edgeware node', nodeEdgeware],
  ['Equilibrium node', nodeEquilibrium],
  ['kilt node', nodeKilt],
  ['nodle chain node', nodeNodle],
  ['Stafi node', nodeStafi],
  ['subsocial node', nodeSubsocial]
  // ['node template', emptyColor],
  // ['parity polkadot', emptyColor],
  // ['substrate node', emptyColor]
].reduce((colors, [node, color]): Record<string, any> => ({
  ...colors,
  [node.toLowerCase().replace(/-/g, ' ')]: color
}), {});

export {
  chainColors,
  emptyColor,
  nodeColors
};
