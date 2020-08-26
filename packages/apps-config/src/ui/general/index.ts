// Copyright 2017-2020 @polkadot/apps-config authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

const defaultColor = undefined; // '#f19135'
const emptyColor = '#999';

const chainCrab = '#7C30DD';
const chainKulupu = '#003366';
const chainPolkadot = '#e6007a';
const chainKusama = '#000'; // '#d32e79';
const chainRocco = '#6f36dc';
const chainRoccoTick = '#22bb22';
const chainRoccoTrack = '#bb2222';
const chainRoccoTrick = '#2222bb';
const chainRoccoAcala = '#173DC9';
const chainWestend = '#da68a7';

const nodeCentrifuge = '#fcc367';
const nodeEdgeware = '#0a95df';
const nodeNodle = '#1ab394';
const nodeKilt = '#eb5b2a';

// overrides based on the actual matched chain name
const chainColors: Record<string, any> = [
  ['Crab', chainCrab],
  ['Kulupu', chainKulupu],
  ['Kusama', chainKusama],
  ['Kusama CC1', chainKusama],
  ['Kusama CC2', chainKusama],
  ['Kusama CC3', chainKusama],
  ['Polkadot', chainPolkadot],
  ['Polkadot CC1', chainPolkadot],
  ['Rococo', chainRocco],
  ['Tick', chainRoccoTick],
  ['Track', chainRoccoTrack],
  ['Trick', chainRoccoTrick],
  ['acala mandala pc1', chainRoccoAcala],
  ['Westend', chainWestend]
].reduce((colors, [chain, color]): Record<string, any> => ({
  ...colors,
  [chain.toLowerCase()]: color
}), {});

// overrides based on the actual software node type (all '-' converted to ' ')
const nodeColors: Record<string, any> = [
  ['centrifuge chain', nodeCentrifuge],
  ['edgeware node', nodeEdgeware],
  ['kilt node', nodeKilt],
  ['nodle chain node', nodeNodle]
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
