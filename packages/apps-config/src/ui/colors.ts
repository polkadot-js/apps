// Copyright 2017-2023 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* eslint sort-keys: ["error", "asc", { caseSensitive: false }] */

import { sanitize } from './util';

// The mapping here is done on the actual chain name (system.chain RPC) or
// the actual RPC node it is corrected to (system.name RPC)

// based on chain name
// alphabetical
const chainCrab = '#512DBC';
const chainCrust = '#ff8812';
const chainCrustMaxwell = '#2E333B';
const chainDarwinia = '#FF0083';
const chainDorafactory = '#FF761C';
const chainEquilibrium = '#1792ff';
const chainGalital = '#00063F';
const chainGalois = '#000000';
const chainGenshiro = '#e8662d';
const chainHeiko = '#42d5de';
const chainHydrate = '#000000';
const chainIdavoll = '#ff43ff';
const chainImbue = '#baff36';
const chainInterbtc = '#1a0a2d';
const chainInterlay = '#3E96FF';
const chainKintsugi = '#1a0a2d';
const chainKilt = '#8c145a';
const chainKiltDev = '#f05a27';
const chainKonomi = '#007aff';
const chainKusari = '#b8860b';
const chainKylin = '#ed007e';
const chainLitmus = '#6822fb';
const chainMoonrock = '#3d1d5a';
const chainMyriad = '#7342CC';
const chainNFTMart = '#815287';
const chainOAK = '#A8278C';
const chainOLI = '#8CC63F';
const chainOmniBTC = '#6759E9';
const chainPangolin = '#4B30DD';
const chainPangoro = '#4B30DD';
const chainParallel = '#ef18ac';
const chainParami = '#ee06e2';
const chainPendulum = '#49E2FD';
const chainPichiu = '#ed007e';
const chainPhala = '#c6fa4c';
const chainPolkaFoundry = '#ff527c';
const chainPolkaSmith = '#0DDDFB';
const chainPontem = '#A92FAC';
const chainRoccoBifrost = '#5a25f0';
const chainRoccoDarwinia = '#FF0083';
const chainRococoEave = '#900048';
const chainRiochain = '#4d87f6';
const chainShadow = '#ffa940';
const chainShiden = '#5923B2';
const chainSkyeKiwi = '#6667ab';
const chainSnakenet = '#f653a2';
const chainStandard = 'background: radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(42,170,244,1) 35%, rgba(10,10,10,1) 100%)';
const chainTotem = 'linear-gradient(158deg, rgba(226,157,0,1) 0%, rgba(234,55,203,1) 100%)';
const chainTrustBase = '#ff43aa';
const chainUniarts = 'linear-gradient(150deg, #333ef7 0%, #55adff 100%)';
const chainUnique = '#40BCFF';
const chainUnitNetwork = '#a351ef';
const chainUnitv = '#1452F0';
const chainUnorthodox = 'radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(42,244,187,1) 35%, rgba(10,10,10,1) 100%)';
const chainVln = '#33cc33';
const chainWeb3games = '#000000';
const chainZenlink = 'linear-gradient(45deg, #F20082 0%, #FF4D4D 100%)';
// based on node name
// alphabetical
const nodeAres = '#E56239';
const nodeBajun = '#161212';
const nodeBitCountry = '#191a2e';
const nodeBifrost = '#5a25f0';
const nodeCentrifuge = '#fcc367';
const nodeEncointer = '#0000cc';
const nodeFantour = '#5a189a';
const nodeGalital = '#00063F;';
const nodeGamePower = '#5d21a5';
const nodeHashed = '#59EAF6';
const nodeHeiko = '#42d5de';
const nodeImbue = '#baff36';
const nodeIntegritee = '#658ea9';
const nodeIpse = '#08a1e8';
const nodeJaz = '#121212';
const nodeJoystream = '#4038FF';
const nodeJupiter = '#7143ff';
const nodeKonomi = '#007aff';
const nodeKpron = 'linear-gradient(45deg, #0099F7 0%, #2E49EB 100%)';
const nodeKylin = '#ed007e';
const nodeKusari = '#b8860b';
const nodeLuhn = '#2DCE89';
const nodeManta = '#2070a6';
const nodeMathChain = '#000000';
const nodeMoonbeam = '#53cbc9';
const nodeMoonriver = '#0E132E';
const nodeMybank = '#282736';
const nodeNFTMart = '#307182';
const nodeNodle = '#1ab394';
const nodeOmniBTC = '#6759E9';
const nodeOpportunity = '#6143bc';
const nodePangolin = '#4B30DD';
const nodePangoro = '#4B30DD';
const nodeParallel = '#ef18ac';
const nodeParami = '#ee06e2';
const nodePichiu = '#ed007e';
const nodePolymesh = '#1348e4';
const nodePontem = '#A92FAC';
const nodeRiochain = '#1A3BB3';
const nodeRobonomics = '#2949d3';
const nodeSubsocial = '#b9018c';
const nodeSubsocialX = '#69058C';
const nodeUniarts = chainUniarts;
const nodeUnitNetwork = '#a351ef';
const nodeUnique = chainUnique;
const nodeWeb3games = '#000000';
const nodeZenlink = 'linear-gradient(45deg, #F20082 0%, #FF4D4D 100%)';

// Alphabetical overrides based on the actual matched chain name
// NOTE: This is as retrieved via the system.chain RPC
export const chainColors: Record<string, string> = Object.entries({
  bifrost: chainRoccoBifrost,
  'Bifrost Asgard CC4': chainRoccoBifrost,
  'Bifrost K Rococo': chainRoccoBifrost,
  'Bifrost Kusama': chainRoccoBifrost,
  'Bifrost PC1': chainRoccoBifrost,
  'Bifrost Polkadot': chainRoccoBifrost,
  'Bifrost Stage Testnet': chainRoccoBifrost,
  Centrifuge: nodeCentrifuge,
  ChainOLI: chainOLI,
  'Crab Parachain': chainCrab,
  crust: chainCrust,
  'crust maxwell': chainCrustMaxwell,
  'Crust PC1': chainCrust,
  'Crust Testnet': chainCrust,
  Darwinia: chainDarwinia,
  'darwinia cc1': chainDarwinia,
  'Darwinia Crab': chainCrab,
  'Darwinia Crab Redirect': chainCrab,
  'Darwinia Parachain': chainDarwinia,
  'Darwinia PC2': chainRoccoDarwinia,
  'Dora Factory': chainDorafactory,
  Equilibrium: chainEquilibrium,
  'Equilibrium parachain': chainEquilibrium,
  EquilibriumTestnet: chainGenshiro,
  Galital: chainGalital,
  'Galois-PoC-1': chainGalois,
  Genshiro: chainGenshiro,
  'Genshiro Rococo Testnet': chainGenshiro,
  'Halongbay PC1': chainPolkaFoundry,
  HydraDX: chainSnakenet,
  'HydraDX testnet': chainHydrate,
  Idavoll: chainIdavoll,
  'Imbue Testnet': chainImbue,
  InterBTC: chainInterbtc,
  'InterBTC Staging': chainInterbtc,
  Interlay: chainInterlay,
  Kapex: chainTotem,
  KILT: chainKilt,
  'KILT Local': chainKiltDev,
  'KILT Peregrine Stagenet': chainKiltDev,
  'KILT Spiritnet': chainKilt,
  'KILT Spiritnet Development': chainKiltDev,
  'KILT Testnet': chainKiltDev,
  Kintsugi: chainKintsugi,
  Konomi: chainKonomi,
  Kpron: nodeKpron,
  kusari: chainKusari,
  'Kylin Testnet': chainKylin,
  Litmus: chainLitmus,
  Mars: nodeAres,
  MathChain: nodeMathChain,
  'MathChain PC1': chainGalois,
  Moonbeam: nodeMoonbeam,
  Moonriver: nodeMoonriver,
  Moonrock: chainMoonrock,
  Moonshadow: nodeMoonbeam,
  Myriad: chainMyriad,
  'Myriad Testnet': chainMyriad,
  'NFTMart Staging': chainNFTMart,
  'NFTMart Testnet': chainNFTMart,
  'OAK Network': chainOAK,
  'OLI Parachain': chainOLI,
  OmniBTC: chainOmniBTC,
  Pangolin: chainPangolin,
  'Pangolin Parachain': chainPangolin,
  Pangoro: chainPangoro,
  Parallel: chainParallel,
  'Parallel Heiko': chainHeiko,
  'Parami PC2': chainParami,
  Pendulum: chainPendulum,
  Phala: chainPhala,
  'Pichiu Testnet': chainPichiu,
  PolkaBTC: chainInterbtc,
  PolkaSmith: chainPolkaSmith,
  'Pontem Testnet': chainPontem,
  'RioChain CC-1': chainRiochain,
  'Riochain Staging': chainRiochain,
  Robonomics: nodeRobonomics,
  Shadow: chainShadow,
  Shiden: chainShiden,
  'SkyeKiwi Testnet Alpha': chainSkyeKiwi,
  Stagex: chainTotem,
  Standard: chainStandard,
  'Standard Kusama Parachain': chainUnorthodox,
  'Steam PC': chainRococoEave,
  'TrustBase PC1': chainTrustBase,
  'uni arts staging network': chainUniarts,
  'UniArts Mainnet': chainUniarts,
  'Unique Node': chainUnique,
  UNIT: chainUnitv,
  UnitNetwork: chainUnitNetwork,
  'VLN PC': chainVln,
  Wapex: chainTotem,
  'Web3Games Plum': chainWeb3games,
  'Zenlink PC1': chainZenlink
}).reduce<Record<string, string>>((colors, [chain, color]) => ({
  ...colors,
  [sanitize(chain)]: color
}), {});

// Alphabetical overrides based on the actual software node type
// NOTE: This is as retrieved via the system.name RPC
export const nodeColors = Object.entries({
  'Bajun Node': nodeBajun,
  'Bifrost Node': nodeBifrost,
  'Bifrost Stage Testnet': nodeBifrost,
  'Bit.Country Node': nodeBitCountry,
  centrifuge: nodeCentrifuge,
  'centrifuge chain': nodeCentrifuge,
  'Centrifuge Chain Node': nodeCentrifuge,
  'Dora Factory': chainDorafactory,
  'Encointer collator': nodeEncointer,
  'Encointer Node noTEE': nodeEncointer,
  'Fantour Development': nodeFantour,
  Galital: nodeGalital,
  'Galital Parachain Collator': nodeGalital,
  'GamePower Node': nodeGamePower,
  'Hashed Network': nodeHashed,
  'Imbue Parachain Collator': nodeImbue,
  'Integritee Collator': nodeIntegritee,
  'Integritee Node': nodeIntegritee,
  IpseTestnet: nodeIpse,
  'Jaz Node': nodeJaz,
  'Joystream Node': nodeJoystream,
  'Konomi Collator': nodeKonomi,
  'Kpron Collator': nodeKpron,
  kusari: nodeKusari,
  'Kylin Parachain Collator': nodeKylin,
  'Luhn Collator': nodeLuhn,
  'Manta Collator': nodeManta,
  'Manta Node': nodeManta,
  MathChain: nodeMathChain,
  'mybank.network node': nodeMybank,
  Myriad: chainMyriad,
  'NFTMart Staging': nodeNFTMart,
  'NFTMart Testnet': nodeNFTMart,
  'nodle chain node': nodeNodle,
  OmniBTC: nodeOmniBTC,
  'Opportunity Standalone Testnet': nodeOpportunity,
  Pangolin: nodePangolin,
  'Pangolin Parachain': nodePangolin,
  Pangoro: nodePangoro,
  Parallel: nodeParallel,
  'Parallel Heiko': nodeHeiko,
  'Parami Collator': nodeParami,
  'Patract Node': nodeJupiter,
  'Pichiu Parachain Collator': nodePichiu,
  'Polymesh Node': nodePolymesh,
  'Pontem Node': nodePontem,
  'Rio Defi Chain Node': nodeRiochain,
  'Riochain Staging': nodeRiochain,
  'Shiden Collator': chainShiden,
  'Subsocial Collator': nodeSubsocialX,
  'subsocial node': nodeSubsocial,
  'uni arts node': nodeUniarts,
  'UniArts Node': nodeUniarts,
  'Unique Node': nodeUnique,
  'UnitNetwork Node': nodeUnitNetwork,
  'Web3Games Node': nodeWeb3games,
  'Zenlink Collator': nodeZenlink
}).reduce<Record<string, string>>((colors, [node, color]) => ({
  ...colors,
  [sanitize(node)]: color
}), {});
