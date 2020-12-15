// Copyright 2017-2020 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

// The mapping here is done on the actual chain name (system.chain RPC) or
// the actual RPC node it is corrected to (system.name RPC)

// defaults
const emptyColor = '#99999';

// based on chain name
// alphabetical
const chainCrab = '#7C30DD';
const chainCrust = '#ff8812';
const chainDarwinia = 'linear-gradient(-45deg, #FE3876 0%, #7C30DD 71%, #3A30DD 100%)';
const chainHanonycash = '#0099CC';
const chainKulupu = '#003366';
const chainPhala = '#a7e300';
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
const chainGalois = '#000000';
const chainZero = '#000000';

// based on node name
// alphabetical
const nodeBifrost = '#002cc3';
const nodeCanvas = '#c77cff';
const nodeCentrifuge = '#fcc367';
const nodeEdgeware = '#0a95df';
const nodeEquilibrium = '#1792ff';
const nodeMoonbeam = '#53cbc9';
const nodeNodle = '#1ab394';
const nodeKilt = '#eb5b2a';
const nodeSora = '#2D2926';
const nodeStafi = '#00F3AB';
const nodeSubsocial = '#b9018c';
const nodeZero = '#0099cc';

export { emptyColor };

// Alphabetical overrides based on the actual matched chain name
// NOTE: This is as retrieved via the system.chain RPC
export const chainColors: Record<string, any> = [
  ['acala mandala pc1', chainRoccoAcala],
  ['Darwinia Crab', chainCrab],
  ['crust maxwell cc2', chainCrust],
  ['darwinia cc1', chainDarwinia],
  ['darwinia parachain', chainRoccoDarwinia],
  ['hanonycash', chainHanonycash],
  ['Kulupu', chainKulupu],
  ['Kusama', chainKusama],
  ['Kusama CC1', chainKusama],
  ['Kusama CC2', chainKusama],
  ['Kusama CC3', chainKusama],
  ['laminar turbulence pc1', chainRococoLaminar],
  ['Moonbase Alpha', nodeMoonbeam],
  ['Phala poc 3', chainPhala],
  ['Plasm', chainPlasm],
  ['Polkadot', chainPolkadot],
  ['Polkadot CC1', chainPolkadot],
  ['Rococo', chainRocco],
  ['Tick', chainRoccoTick],
  ['Track', chainRoccoTrack],
  ['Trick', chainRoccoTrick],
  ['Westend', chainWestend],
  ['Galois', chainGalois],
  ['ZΞRO Alphaville', chainZero],
].reduce((colors, [chain, color]): Record<string, any> => ({
  ...colors,
  [chain.toLowerCase()]: color
}), {});

// Alphabetical overrides based on the actual software node type
// NOTE: This is as retrieved via the system.name RPC
export const nodeColors: Record<string, any> = [
  ['Bifrost Node', nodeBifrost],
  ['Canvas Node', nodeCanvas],
  ['centrifuge chain', nodeCentrifuge],
  ['Centrifuge Chain Node', nodeCentrifuge],
  ['edgeware node', nodeEdgeware],
  ['Equilibrium node', nodeEquilibrium],
  ['kilt node', nodeKilt],
  ['nodle chain node', nodeNodle],
  ['SORA-Substrate Node', nodeSora],
  ['Stafi node', nodeStafi],
  ['subsocial node', nodeSubsocial],
  ['SUBZΞRO', nodeZero],
  // ['node template', emptyColor],
  // ['parity polkadot', emptyColor],
  // ['substrate node', emptyColor]
].reduce((colors, [node, color]): Record<string, any> => ({
  ...colors,
  [node.toLowerCase().replace(/-/g, ' ')]: color
}), {});
