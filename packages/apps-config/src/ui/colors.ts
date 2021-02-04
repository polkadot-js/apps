// Copyright 2017-2021 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

// The mapping here is done on the actual chain name (system.chain RPC) or
// the actual RPC node it is corrected to (system.name RPC)

// defaults
const emptyColor = '#99999';

// based on chain name
// alphabetical
const chainBitCountry = '#191a2e';
const chainCrab = '#7C30DD';
const chainCrust = '#ff8812';
const chainClover = 'linear-gradient(to right, #52ad75, #7cc773)';
const chainChainx = '#F6C94A';
const chainDarwinia = 'linear-gradient(-45deg, #FE3876 0%, #7C30DD 71%, #3A30DD 100%)';
const chainHanonycash = '#0099CC';
const chainHydrate = '#000000';
const chainIntegritee = '#080808';
const chainKulupu = '#003366';
const chainPhala = '#a7e300';
const chainPlasm = '#2096F3';
const chainPolkabtc = '#510101';
const chainPolkadex = '#7C30DD';
const chainPolkadot = '#e6007a';
const chainKilt = '#8c175b';
const chainKusama = '#000000';
const chainRocco = '#6f36dc';
const chainRoccoAcala = '#173DC9';
const chainRoccoAres = '#70FF8B';
const chainRoccoBifrost = '#002cc3';
const chainRoccoDarwinia = 'linear-gradient(-45deg, #FE3876 0%, #7C30DD 71%, #3A30DD 100%)';
const chainRoccoDataHighway = '#000000';
const chainRococoLaminar = '#004FFF';
const chainRoccoTick = '#22bb22';
const chainRoccoTrack = '#bb2222';
const chainRoccoTrick = '#2222bb';
const chainWestend = '#da68a7';
const chainGalois = '#000000';
const chainZero = '#000000';
const chainZenlink = 'linear-gradient(45deg, #F20082 0%, #FF4D4D 100%)';
const chainJupiter = '#7143ff';
const chainUniarts = '#b39ef7';
const chainIdavoll = '#ff43ff';
const chainSubDAO = 'linear-gradient(50deg, #F20092 0%, #FF4D5D 100%)';

// based on node name
// alphabetical
const nodeBitCountry = '#191a2e';
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
const nodePolkadex = '#7C30DD';
const nodeSora = '#2D2926';
const nodeStafi = '#00F3AB';
const nodeSubDAO = 'linear-gradient(50deg, #F20092 0%, #FF4D5D 100%)';
const nodeSubsocial = '#b9018c';
const nodeTernoa = '#d622ff';
const nodeZero = '#0099cc';
const nodeZenlink = 'linear-gradient(45deg, #F20082 0%, #FF4D4D 100%)';

export { emptyColor };

// Alphabetical overrides based on the actual matched chain name
// NOTE: This is as retrieved via the system.chain RPC
export const chainColors: Record<string, any> = [
  ['acala mandala pc1', chainRoccoAcala],
  ['acala mandala pc2', chainRoccoAcala],
  ['Ares PC1', chainRoccoAres],
  ['Bit.Country Tewai Chain', chainBitCountry],
  ['Bifrost PC1', chainRoccoBifrost],
  ['Darwinia Crab', chainCrab],
  ['Clover', chainClover],
  ['crust maxwell', chainCrust],
  ['Crust PC1', chainCrust],
  ['ChainX', chainChainx],
  ['darwinia cc1', chainDarwinia],
  ['Darwinia PC2', chainRoccoDarwinia],
  ['DataHighway', chainRoccoDataHighway],
  ['Encointer PC1', nodeEncointerNotee],
  ['hanonycash', chainHanonycash],
  ['HydraDX Hydrate', chainHydrate],
  ['IntegriTEE PC1', chainIntegritee],
  ['Idavoll', chainIdavoll],
  ['Jupiter Testnet', chainJupiter],
  ['KILT Testnet', chainKilt],
  ['KILT Collator Rococo', chainKilt],
  ['Kulupu', chainKulupu],
  ['Kusama', chainKusama],
  ['Kusama CC1', chainKusama],
  ['Kusama CC2', chainKusama],
  ['Kusama CC3', chainKusama],
  ['laminar turbulence pc1', chainRococoLaminar],
  ['Moonbase Alpha', nodeMoonbeam],
  ['Phala poc 3', chainPhala],
  ['Phala PC1', chainPhala],
  ['Plasm', chainPlasm],
  ['Plasm PC2', chainPlasm],
  ['PolkaBTC', chainPolkabtc],
  ['PolkaBTC Staging', chainPolkabtc],
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
  ['Zenlink PC1', chainZenlink],
  ['Uniarts', chainUniarts],
  ['SubDAO PC1', chainSubDAO]
].reduce((colors, [chain, color]): Record<string, any> => ({
  ...colors,
  [chain.toLowerCase()]: color
}), {});

// Alphabetical overrides based on the actual software node type
// NOTE: This is as retrieved via the system.name RPC
export const nodeColors: Record<string, any> = [
  ['Bit.Country Node', nodeBitCountry],
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
  ['nodle chain node', nodeNodle],
  ['Polkadex Node', nodePolkadex],
  ['SORA-staging Node', nodeSora],
  ['Stafi node', nodeStafi],
  ['subsocial node', nodeSubsocial],
  ['SUBZΞRO', nodeZero],
  ['Ternoa Node', nodeTernoa],
  ['Zenlink Collator', nodeZenlink],
  ['SubDAO Collator', nodeSubDAO]
  // ['node template', emptyColor],
  // ['parity polkadot', emptyColor],
  // ['substrate node', emptyColor]
].reduce((colors, [node, color]): Record<string, any> => ({
  ...colors,
  [node.toLowerCase().replace(/-/g, ' ')]: color
}), {});
