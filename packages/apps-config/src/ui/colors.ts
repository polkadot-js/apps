// Copyright 2017-2021 @polkadot/apps-config authors & contributors
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
const chainPolkabtc = '#510101';
const chainPolkadex = '#7C30DD';
const chainPolkadot = '#e6007a';
const chainKusama = '#000000';
const chainRocco = '#6f36dc';
const chainRoccoAcala = '#173DC9';
const chainRoccoBifrost = '#002cc3';
const chainRoccoDarwinia = '#7C30DD';
const chainRococoLaminar = '#004FFF';
const chainRoccoTick = '#22bb22';
const chainRoccoTrack = '#bb2222';
const chainRoccoTrick = '#2222bb';
const chainWestend = '#da68a7';
const chainGalois = '#000000';
const chainZero = '#000000';
const chainJupiter = '#7143ff';
const chainUniarts = '#b39ef7';

// based on node name
// alphabetical
const nodeBifrost = '#002cc3';
const nodeCanvas = '#c77cff';
const nodeCentrifuge = '#fcc367';
const nodeEdgeware = '#0a95df';
const nodeEncointerNotee = '#cc0000';
const nodeEncointerTeeproxy = '#0000cc';
const nodeEquilibrium = '#1792ff';
const nodeJupiter = '#7143ff';
const nodeMoonbeam = '#53cbc9';
const nodeNodle = '#1ab394';
const nodeKilt = '#eb5b2a';
const nodePolkadex = '#7C30DD';
const nodeSora = '#2D2926';
const nodeStafi = '#00F3AB';
const nodeSubsocial = '#b9018c';
const nodeZero = '#0099cc';

export { emptyColor };

// Alphabetical overrides based on the actual matched chain name
// NOTE: This is as retrieved via the system.chain RPC
export const chainColors: Record<string, any> = [
  ['acala mandala pc1', chainRoccoAcala],
  ['acala mandala pc2', chainRoccoAcala],
  ['Bifrost PC1', chainRoccoBifrost],
  ['Darwinia Crab', chainCrab],
  ['crust maxwell cc2', chainCrust],
  ['darwinia cc1', chainDarwinia],
  ['darwinia parachain', chainRoccoDarwinia],
  ['hanonycash', chainHanonycash],
  ['Jupiter Testnet', chainJupiter],
  ['Kulupu', chainKulupu],
  ['Kusama', chainKusama],
  ['Kusama CC1', chainKusama],
  ['Kusama CC2', chainKusama],
  ['Kusama CC3', chainKusama],
  ['laminar turbulence pc1', chainRococoLaminar],
  ['Moonbase Alpha', nodeMoonbeam],
  ['Phala poc 3', chainPhala],
  ['Plasm', chainPlasm],
  ['Plasm PC2', chainPlasm],
  ['PolkaBTC', chainPolkabtc],
  ['Polkadex Testnet', chainPolkadex],
  ['Polkadot', chainPolkadot],
  ['Polkadot CC1', chainPolkadot],
  ['Rococo', chainRocco],
  ['Tick', chainRoccoTick],
  ['Track', chainRoccoTrack],
  ['Trick', chainRoccoTrick],
  ['Westend', chainWestend],
  ['Galois', chainGalois],
  ['ZΞRO Alphaville', chainZero],
  ['Uniarts', chainUniarts]
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
  ['Encointer Node', nodeEncointerNotee],
  ['Encointer Node noTEE', nodeEncointerNotee],
  ['Encointer Node TEE proxy', nodeEncointerTeeproxy],
  ['Equilibrium node', nodeEquilibrium],
  ['Jupiter Node', nodeJupiter],
  ['kilt node', nodeKilt],
  ['nodle chain node', nodeNodle],
  ['Polkadex Node', nodePolkadex],
  ['SORA-staging Node', nodeSora],
  ['Stafi node', nodeStafi],
  ['subsocial node', nodeSubsocial],
  ['SUBZΞRO', nodeZero]
  // ['node template', emptyColor],
  // ['parity polkadot', emptyColor],
  // ['substrate node', emptyColor]
].reduce((colors, [node, color]): Record<string, any> => ({
  ...colors,
  [node.toLowerCase().replace(/-/g, ' ')]: color
}), {});
