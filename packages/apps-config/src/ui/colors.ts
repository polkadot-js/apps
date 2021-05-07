// Copyright 2017-2021 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

// The mapping here is done on the actual chain name (system.chain RPC) or
// the actual RPC node it is corrected to (system.name RPC)

// defaults
const emptyColor = '#99999';

// based on chain name
// alphabetical
const chainApron = 'linear-gradient(45deg, #0099F7 0%, #2E49EB 100%)';
const chainBitCountry = '#191a2e';
const chainBeastEave = '#900048';
const chainCrab = '#7C30DD';
const chainCrust = '#ff8812';
const chainClover = 'linear-gradient(to right, #52ad75, #7cc773)';
const chainChainx = '#F6C94A';
const chainDarwinia = 'linear-gradient(-45deg, #FE3876 0%, #7C30DD 71%, #3A30DD 100%)';
const chainDotMog = '#020609';
const chainGalital = '#00063F';
const chainGamePower = '#5d21a5';
const chainHanonycash = '#0099CC';
const chainHydrate = '#000000';
const chainIntegritee = '#15bcff';
const chainIpse = '#08a1e8';
const chainKulupu = '#003366';
const chainManta = '#2070a6';
const chainMoonrock = '#3d1d5a';
const chainNFTMart = '#815287';
const chainParami = '#ee06e2';
const chainPhala = '#a7e300';
const chainPhoenix = '#d42181';
const chainPlasm = '#2096F3';
const chainPolkabtc = '#510101';
const chainPolkadex = '#7C30DD';
const chainPolkadot = '#e6007a';
const chainPolkaFoundry = '#ff527c';
const chainPrism = 'linear-gradient(45deg, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%)';
const chainKilt = '#8c175b';
const chainKonomi = '#007aff';
const chainKusama = '#000000';
const chainLitentry = 'linear-gradient(45deg, #5cc27c 0%, #6de98f 100%)';
const chainMybank = '#282736';
const chainRocco = '#6f36dc';
const chainRoccoAcala = '#173DC9';
const chainRoccoAres = '#70FF8B';
const chainRoccoBifrost = '#002cc3';
const chainRoccoDarwinia = 'linear-gradient(-45deg, #FE3876 0%, #7C30DD 71%, #3A30DD 100%)';
const chainRoccoDataHighway = 'linear-gradient(-90deg, #9400D3 0%, #5A5CA9 50%, #00BFFF 100%)';
const chainRococoEave = '#900048';
const chainRococoLaminar = '#004FFF';
const chainRoccoTick = '#22bb22';
const chainRoccoTrack = '#bb2222';
const chainRoccoTrick = '#2222bb';
const chainRiochain = '#4d87f6';
const chainSnakenet = '#f653a2';
const chainWestend = '#da68a7';
const chainGalois = '#000000';
const chainZero = '#000000';
const chainZenlink = 'linear-gradient(45deg, #F20082 0%, #FF4D4D 100%)';
const chainJupiter = '#7143ff';
const chainUniarts = 'linear-gradient(150deg, #333ef7 0%, #55adff 100%)';
const chainUnique = '#40BCFF';
const chainIdavoll = '#ff43ff';
const chainSubDAO = 'linear-gradient(50deg, #F20092 0%, #FF4D5D 100%)';
const chainSubsocial = '#b9018c';
const chainTrustBase = '#ff43aa';
const chainUnitv = '#1452F0';
const chainVln = '#33cc33';
const chainWeb3games = 'linear-gradient(45deg, #0099F7 0%, #F11712 100%)';
const chainWestlake = 'linear-gradient(-90deg, #9400D3 0%, #5A5CA9 50%, #00BFFF 100%)';
// based on node name
// alphabetical
const nodeApron = 'linear-gradient(45deg, #0099F7 0%, #2E49EB 100%)';
const nodeBitCountry = '#191a2e';
const nodeBifrost = '#002cc3';
const nodeCanvas = '#c77cff';
const nodeCentrifuge = '#fcc367';
const nodeDotMog = '#020609';
const nodeEdgeware = '#0a95df';
const nodeEncointerNotee = '#cc0000';
const nodeEncointerTeeproxy = '#0000cc';
const nodeEquilibrium = '#1792ff';
const nodeGalital = '#00063F;';
const nodeGamePower = '#5d21a5';
const nodeIpse = '#08a1e8';
const nodeJupiter = '#7143ff';
const nodeKonomi = '#007aff';
const nodeLitentry = 'linear-gradient(45deg, #5cc27c 0%, #6de98f 100%)';
const nodeManta = '#2070a6';
const nodeMoonbeam = '#53cbc9';
const nodeMybank = '#282736';
const nodeNFTMart = '#307182';
const nodeNodle = '#1ab394';
const nodeParami = '#ee06e2';
const nodePolkadex = '#7C30DD';
const nodePrism = 'linear-gradient(45deg, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%)';
const nodeRealis = 'linear-gradient(45deg, #E8AAC9 0%, #C4D9E7 50%, #EFD6E0 100%)';
const nodeRiochain = '#1A3BB3';
const nodeSora = '#2D2926';
const nodeStafi = '#00F3AB';
const nodeStatemint = '#86e62a'; // '#98ff98';
const nodeSubDAO = 'linear-gradient(50deg, #F20092 0%, #FF4D5D 100%)';
const nodeSubsocial = '#b9018c';
const nodeTernoa = '#d622ff';
const nodeUniarts = chainUniarts;
const nodeUnique = chainUnique;
const nodeWeb3games = 'linear-gradient(45deg, #0099F7 0%, #F11712 100%)';
const nodeWestlake = chainWestlake;
const nodeZeitgeist = 'linear-gradient(180deg, rgba(32,90,172,1) 0%, rgba(26,72,138,1) 50%, rgba(13,36,69,1) 100%)';
const nodeZero = '#0099cc';
const nodeZenlink = 'linear-gradient(45deg, #F20082 0%, #FF4D4D 100%)';

export { emptyColor };

// Alphabetical overrides based on the actual matched chain name
// NOTE: This is as retrieved via the system.chain RPC
export const chainColors: Record<string, any> = [
  ['acala mandala pc1', chainRoccoAcala],
  ['acala mandala pc2', chainRoccoAcala],
  ['Apron PC1', chainApron],
  ['Ares PC1', chainRoccoAres],
  ['Bifrost PC1', chainRoccoBifrost],
  ['Bit.Country Tewai Chain', chainBitCountry],
  ['Beast Developer', chainBeastEave],
  ['ChainX', chainChainx],
  ['Clover', chainClover],
  ['crust maxwell', chainCrust],
  ['Crust PC1', chainCrust],
  ['darwinia cc1', chainDarwinia],
  ['Darwinia Crab', chainCrab],
  ['Darwinia PC2', chainRoccoDarwinia],
  ['DataHighway', chainRoccoDataHighway],
  ['DOTMog.com NET', chainDotMog],
  ['Steam PC', chainRococoEave],
  ['Encointer PC1', nodeEncointerNotee],
  ['Galital', chainGalital],
  ['Galois', chainGalois],
  ['GamePower Network', chainGamePower],
  ['hanonycash', chainHanonycash],
  ['HydraDX Hydrate', chainHydrate],
  ['HydraDX Snakenet', chainSnakenet],
  ['HydraDX Snakenet Gen2', chainSnakenet],
  ['Idavoll', chainIdavoll],
  ['IntegriTEE PC1', chainIntegritee],
  ['IpseTestnet', chainIpse],
  ['Jupiter A1', chainJupiter],
  ['Jupiter PC1', chainJupiter],
  ['KILT Collator Rococo', chainKilt],
  ['KILT Testnet', chainKilt],
  ['Konomi', chainKonomi],
  ['Kulupu', chainKulupu],
  ['Kusama CC1', chainKusama],
  ['Kusama CC2', chainKusama],
  ['Kusama CC3', chainKusama],
  ['Kusama', chainKusama],
  ['laminar turbulence pc1', chainRococoLaminar],
  ['Litentry', chainLitentry],
  ['MantaChain PC1', chainManta],
  ['MathChain PC1', chainGalois],
  ['Moonbase Alpha', nodeMoonbeam],
  ['Moonbase Stage', nodeMoonbeam],
  ['Moonbase Development Testnet', nodeMoonbeam],
  ['Moonrock', chainMoonrock],
  ['mybank.network Testnet', chainMybank],
  ['NFTMart Testnet', chainNFTMart],
  ['NFTMart Staging', chainNFTMart],
  ['Parami PC2', chainParami],
  ['Phala PC1', chainPhala],
  ['Phala PoC 4', chainPhala],
  ['Plasm', chainPlasm],
  ['Plasm PC2', chainPlasm],
  ['PolkaBTC', chainPolkabtc],
  ['PolkaBTC Staging', chainPolkabtc],
  ['Polkadex Testnet', chainPolkadex],
  ['Polkadot CC1', chainPolkadot],
  ['Polkadot', chainPolkadot],
  ['Prism Testnet', chainPrism],
  ['Prism PC1', chainPrism],
  ['Halongbay Testnet', chainPolkaFoundry],
  ['ReAlis Network', nodeRealis],
  ['Rococo', chainRocco],
  ['RioChain CC-1', chainRiochain],
  ['Riochain Staging', chainRiochain],
  ['Statemint Test', nodeStatemint],
  ['SubDAO PC1', chainSubDAO],
  ['Subsocial PC1', chainSubsocial],
  ['Tick', chainRoccoTick],
  ['Track', chainRoccoTrack],
  ['Trick', chainRoccoTrick],
  ['TrustBase PC1', chainTrustBase],
  ['uni arts staging network', chainUniarts],
  ['Unique Node', chainUnique],
  ['VLN PC', chainVln],
  ['Web3games ', chainWeb3games],
  ['Westend', chainWestend],
  ['Westlake', chainWestlake],
  ['Zenlink PC1', chainZenlink],
  ['ZERO.IO', chainZero],
  ['PHOENIX', chainPhoenix],
  ['UNIT', chainUnitv]
].reduce((colors, [chain, color]): Record<string, any> => ({
  ...colors,
  [chain.toLowerCase()]: color
}), {});

// Alphabetical overrides based on the actual software node type
// NOTE: This is as retrieved via the system.name RPC
export const nodeColors: Record<string, any> = [
  ['Apron Node', nodeApron],
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
  ['Galital', nodeGalital],
  ['Galital Parachain Collator', nodeGalital],
  ['GamePower Node', nodeGamePower],
  ['IpseTestnet', nodeIpse],
  ['Konomi Collator', nodeKonomi],
  ['Litentry Collator', nodeLitentry],
  ['Manta Collator', nodeManta],
  ['mybank.network node', nodeMybank],
  ['NFTMart Testnet', nodeNFTMart],
  ['NFTMart Staging', nodeNFTMart],
  ['nodle chain node', nodeNodle],
  ['Parami Collator', nodeParami],
  ['Patract Node', nodeJupiter],
  ['Polkadex Node', nodePolkadex],
  ['Prism Node', nodePrism],
  ['Prism Collator', nodePrism],
  ['ReAlis Network', nodeRealis],
  ['Rio Defi Chain Node', nodeRiochain],
  ['Riochain Staging', nodeRiochain],
  ['SORA', nodeSora],
  ['Stafi node', nodeStafi],
  ['Statemint Collator', nodeStatemint],
  ['subsocial node', nodeSubsocial],
  ['subzero node', nodeZero],
  ['Ternoa Node', nodeTernoa],
  ['uni arts node', nodeUniarts],
  ['Unique Node', nodeUnique],
  ['Web3games', nodeWeb3games],
  ['Westlake', nodeWestlake],
  ['Zeitgeist Node', nodeZeitgeist],
  ['Zeitgeist Collator', nodeZeitgeist],
  ['Zenlink Collator', nodeZenlink],
  ['SubDAO Collator', nodeSubDAO]
  // ['node template', emptyColor],
  // ['parity polkadot', emptyColor],
  // ['substrate node', emptyColor]
].reduce((colors, [node, color]): Record<string, any> => ({
  ...colors,
  [node.toLowerCase().replace(/-/g, ' ')]: color
}), {});
