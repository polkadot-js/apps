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
const chainDotMog = '#020609';
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
const chainRoccoDataHighway = 'linear-gradient(-90deg, #9400D3 0%, #5A5CA9 50%, #00BFFF 100%)';
const chainRococoLaminar = '#004FFF';
const chainRoccoTick = '#22bb22';
const chainRoccoTrack = '#bb2222';
const chainRoccoTrick = '#2222bb';
const chainSgc = 'linear-gradient(45deg, #0099F7 0%, #F11712 100%)';
const chainSnakenet = '#f653a2';
const chainWestend = '#da68a7';
const chainGalois = '#000000';
const chainZero = '#000000';
const chainZenlink = 'linear-gradient(45deg, #F20082 0%, #FF4D4D 100%)';
const chainJupiter = '#7143ff';
const chainUniarts = '#b39ef7';
const chainUnique = '#40BCFF';
const chainIdavoll = '#ff43ff';
const chainSubDAO = 'linear-gradient(50deg, #F20092 0%, #FF4D5D 100%)';
const chainTrustBase = '#ff43aa';

// based on node name
// alphabetical
const nodeBitCountry = '#191a2e';
const nodeBifrost = '#002cc3';
const nodeCanvas = '#c77cff';
const nodeCentrifuge = '#fcc367';
const nodeDotMog = '#020609';
const nodeEdgeware = '#0a95df';
const nodeEncointerNotee = '#cc0000';
const nodeEncointerTeeproxy = '#0000cc';
const nodeEquilibrium = '#1792ff';
const nodeJupiter = '#7143ff';
const nodeLitentry = 'linear-gradient(45deg, #5cc27c 0%, #6de98f 100%)';
const nodeMoonbeam = '#53cbc9';
const nodeNodle = '#1ab394';
const nodePolkadex = '#7C30DD';
const nodeRealis = '#FFD700';
const nodeSgc = 'linear-gradient(45deg, #0099F7 0%, #F11712 100%)';
const nodeSora = '#2D2926';
const nodeStafi = '#00F3AB';
const nodeSubDAO = 'linear-gradient(50deg, #F20092 0%, #FF4D5D 100%)';
const nodeSubsocial = '#b9018c';
const nodeTernoa = '#d622ff';
const nodeUnique = chainUnique;
const nodeZero = '#0099cc';
const nodeZenlink = 'linear-gradient(45deg, #F20082 0%, #FF4D4D 100%)';

export { emptyColor };

// Alphabetical overrides based on the actual matched chain name
// NOTE: This is as retrieved via the system.chain RPC
export const chainColors: Record<string, any> = [
  ['acala mandala pc1', chainRoccoAcala],
  ['acala mandala pc2', chainRoccoAcala],
  ['Ares PC1', chainRoccoAres],
  ['Bifrost PC1', chainRoccoBifrost],
  ['Bit.Country Tewai Chain', chainBitCountry],
  ['ChainX', chainChainx],
  ['Clover', chainClover],
  ['crust maxwell', chainCrust],
  ['Crust PC1', chainCrust],
  ['darwinia cc1', chainDarwinia],
  ['Darwinia Crab', chainCrab],
  ['Darwinia PC2', chainRoccoDarwinia],
  ['DataHighway', chainRoccoDataHighway],
  ['DOTMog.com NET', chainDotMog],
  ['Encointer PC1', nodeEncointerNotee],
  ['Galois', chainGalois],
  ['hanonycash', chainHanonycash],
  ['HydraDX Hydrate', chainHydrate],
  ['HydraDX Snakenet', chainSnakenet],
  ['Idavoll', chainIdavoll],
  ['IntegriTEE PC1', chainIntegritee],
  ['Jupiter A1', chainJupiter],
  ['Jupiter PC1', chainJupiter],
  ['KILT Collator Rococo', chainKilt],
  ['KILT Testnet', chainKilt],
  ['Kulupu', chainKulupu],
  ['Kusama CC1', chainKusama],
  ['Kusama CC2', chainKusama],
  ['Kusama CC3', chainKusama],
  ['Kusama', chainKusama],
  ['laminar turbulence pc1', chainRococoLaminar],
  ['MathChain PC1', chainGalois],
  ['Moonbase Alpha', nodeMoonbeam],
  ['Moonbase Stage', nodeMoonbeam],
  ['Moonbase Development Testnet', nodeMoonbeam],
  ['Phala PC1', chainPhala],
  ['Phala poc 3', chainPhala],
  ['Plasm', chainPlasm],
  ['Plasm PC2', chainPlasm],
  ['PolkaBTC', chainPolkabtc],
  ['PolkaBTC Staging', chainPolkabtc],
  ['Polkadex Testnet', chainPolkadex],
  ['Polkadot CC1', chainPolkadot],
  ['Polkadot', chainPolkadot],
  ['ReAlis Network', nodeRealis],
  ['Rococo', chainRocco],
  ['Sgc ', chainSgc],
  ['SubDAO PC1', chainSubDAO],
  ['Tick', chainRoccoTick],
  ['Track', chainRoccoTrack],
  ['Trick', chainRoccoTrick],
  ['TrustBase PC1', chainTrustBase],
  ['Uniarts', chainUniarts],
  ['Unique Node', chainUnique],
  ['Westend', chainWestend],
  ['Zenlink PC1', chainZenlink],
  ['ZΞRO Alphaville', chainZero]
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
  ['DOTMog Node', nodeDotMog],
  ['edgeware node', nodeEdgeware],
  ['Encointer Node', nodeEncointerNotee],
  ['Encointer Node noTEE', nodeEncointerNotee],
  ['Encointer Node TEE proxy', nodeEncointerTeeproxy],
  ['Equilibrium node', nodeEquilibrium],
  ['Litentry Collator', nodeLitentry],
  ['nodle chain node', nodeNodle],
  ['Patract Node', nodeJupiter],
  ['Polkadex Node', nodePolkadex],
  ['ReAlis Network', nodeRealis],
  ['Sgc', nodeSgc],
  ['SORA-staging Node', nodeSora],
  ['Stafi node', nodeStafi],
  ['subsocial node', nodeSubsocial],
  ['SUBZΞRO', nodeZero],
  ['Ternoa Node', nodeTernoa],
  ['Unique Node', nodeUnique],
  ['Zenlink Collator', nodeZenlink],
  ['SubDAO Collator', nodeSubDAO]
  // ['node template', emptyColor],
  // ['parity polkadot', emptyColor],
  // ['substrate node', emptyColor]
].reduce((colors, [node, color]): Record<string, any> => ({
  ...colors,
  [node.toLowerCase().replace(/-/g, ' ')]: color
}), {});
