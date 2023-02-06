// Copyright 2017-2023 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* eslint sort-keys: ["error", "asc", { caseSensitive: false }] */

import nodeBasiliskRococo from './logos/nodes/basilisk-rococo-bg.png';
import { sanitize } from './util';

// The mapping here is done on the actual chain name (system.chain RPC) or
// the actual RPC node it is corrected to (system.name RPC)

// based on chain name
// alphabetical
const chainBasiliskTestnet = `url(${String(nodeBasiliskRococo)}) #000`;
const chainBrainstorm = '#161616';
const chainCompetitorsClub = '#213830';
const chainComposableFinance = '#C90E8A';
const chainCrab = '#512DBC';
const chainCrownSterling = '#13264b';
const chainCrust = '#ff8812';
const chainCrustMaxwell = '#2E333B';
const chainDarwinia = '#FF0083';
const chainDorafactory = '#FF761C';
const chainEfinity = '#496ddb';
const chainEquilibrium = '#1792ff';
const chainFerrum = '#b37700';
const chainGalital = '#00063F';
const chainGalois = '#000000';
const chainGenshiro = '#e8662d';
const chainHanonycash = '#0099CC';
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
const chainListen = '#FFAD0A';
const chainLitentry = 'linear-gradient(45deg, #5cc27c 0%, #6de98f 100%)';
const chainLitmus = '#6822fb';
const chainMangata = '#030408';
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
const chainPicasso = '#000000';
const chainPichiu = '#ed007e';
const chainPhala = '#c6fa4c';
const chainPolkadex = '#7C30DD';
const chainPolkaFoundry = '#ff527c';
const chainPolkaSmith = '#0DDDFB';
const chainPontem = '#A92FAC';
const chainPrism = 'linear-gradient(45deg, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%)';
const chainRoccoBifrost = '#5a25f0';
const chainRoccoDarwinia = '#FF0083';
const chainRococoEave = '#900048';
const chainRococoLaminar = '#004FFF';
const chainRiochain = '#4d87f6';
const chainShadow = '#ffa940';
const chainShiden = '#5923B2';
const chainSkyeKiwi = '#6667ab';
const chainSnakenet = '#f653a2';
const chainStandard = 'background: radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(42,170,244,1) 35%, rgba(10,10,10,1) 100%)';
const chainSubDAO = 'linear-gradient(50deg, #F20092 0%, #FF4D5D 100%)';
const chainTotem = 'linear-gradient(158deg, rgba(226,157,0,1) 0%, rgba(234,55,203,1) 100%)';
const chainTrustBase = '#ff43aa';
const chainUniarts = 'linear-gradient(150deg, #333ef7 0%, #55adff 100%)';
const chainUnique = '#40BCFF';
const chainUnitNetwork = '#a351ef';
const chainUnitv = '#1452F0';
const chainUnorthodox = 'radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(42,244,187,1) 35%, rgba(10,10,10,1) 100%)';
const chainVln = '#33cc33';
const chainWeb3games = '#000000';
const chainZero = '#000000';
const chainZenlink = 'linear-gradient(45deg, #F20082 0%, #FF4D4D 100%)';
// based on node name
// alphabetical
const nodeApron = 'linear-gradient(45deg, #0099F7 0%, #2E49EB 100%)';
const nodeAres = '#E56239';
const nodeAstar = '#1b6dc1d9';
const nodeAutomata = '#EC7032';
const nodeAutomataContextFree = '#EC7032';
const nodeBasilisk = '#49E49F';
const nodeBajun = '#161212';
const nodeBitCountry = '#191a2e';
const nodeBifrost = '#5a25f0';
const nodeCentrifuge = '#fcc367';
const nodeCompetitorsClub = '#213830';
const nodeCrownSterling = '#13264b';
const nodeDotMog = '#020609';
const nodeEfinity = '#496ddb';
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
const nodeLitentry = 'linear-gradient(45deg, #5cc27c 0%, #6de98f 100%)';
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
const nodePolkadex = '#7C30DD';
const nodePolymesh = '#1348e4';
const nodePontem = '#A92FAC';
const nodePrism = 'linear-gradient(45deg, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%)';
const nodeRiochain = '#1A3BB3';
const nodeRobonomics = '#2949d3';
const nodeSubDAO = 'linear-gradient(50deg, #F20092 0%, #FF4D5D 100%)';
const nodeSubsocial = '#b9018c';
const nodeSubsocialX = '#69058C';
const nodeSubspace = '#562b8e';
const nodeTernoa = '#d622ff';
const nodeUniarts = chainUniarts;
const nodeUnitNetwork = '#a351ef';
const nodeUnique = chainUnique;
const nodeWeb3games = '#000000';
const nodeZero = '#0099cc';
const nodeZenlink = 'linear-gradient(45deg, #F20082 0%, #FF4D4D 100%)';

// Alphabetical overrides based on the actual matched chain name
// NOTE: This is as retrieved via the system.chain RPC
export const chainColors: Record<string, string> = Object.entries({
  'Basilisk testnet': chainBasiliskTestnet,
  bifrost: chainRoccoBifrost,
  'Bifrost Asgard CC4': chainRoccoBifrost,
  'Bifrost K Rococo': chainRoccoBifrost,
  'Bifrost Kusama': chainRoccoBifrost,
  'Bifrost PC1': chainRoccoBifrost,
  'Bifrost Polkadot': chainRoccoBifrost,
  'Bifrost Stage Testnet': chainRoccoBifrost,
  Centrifuge: nodeCentrifuge,
  ChainOLI: chainOLI,
  'Competitors Club': chainCompetitorsClub,
  'Composable Finance': chainComposableFinance,
  'Crab Parachain': chainCrab,
  'Crown Sterling': chainCrownSterling,
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
  Efinity: chainEfinity,
  Equilibrium: chainEquilibrium,
  'Equilibrium parachain': chainEquilibrium,
  EquilibriumTestnet: chainGenshiro,
  'Ferrum Testnet': chainFerrum,
  Galital: chainGalital,
  'Galois-PoC-1': chainGalois,
  Genshiro: chainGenshiro,
  'Genshiro Rococo Testnet': chainGenshiro,
  'Halongbay PC1': chainPolkaFoundry,
  hanonycash: chainHanonycash,
  HydraDX: chainSnakenet,
  'HydraDX testnet': chainHydrate,
  Idavoll: chainIdavoll,
  'Imbue Testnet': chainImbue,
  InterBTC: chainInterbtc,
  'InterBTC Staging': chainInterbtc,
  Interlay: chainInterlay,
  'InvArch Brainstorm Testnet': chainBrainstorm,
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
  'laminar turbulence pc1': chainRococoLaminar,
  'Listen Network': chainListen,
  Litentry: chainLitentry,
  Litmus: chainLitmus,
  'Mangata Kusama Mainnet': chainMangata,
  'Mangata Public Testnet': chainMangata,
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
  Picasso: chainPicasso,
  'Pichiu Testnet': chainPichiu,
  PolkaBTC: chainInterbtc,
  'Polkadex Testnet': chainPolkadex,
  PolkaSmith: chainPolkaSmith,
  'Pontem Testnet': chainPontem,
  'Prism PC1': chainPrism,
  'Prism Testnet': chainPrism,
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
  SubDAO: chainSubDAO,
  'SubDAO PC1': chainSubDAO,
  'SubDAO Staging': chainSubDAO,
  Subspace: nodeSubspace,
  Subzero: chainZero,
  'TrustBase PC1': chainTrustBase,
  'uni arts staging network': chainUniarts,
  'UniArts Mainnet': chainUniarts,
  'Unique Node': chainUnique,
  UNIT: chainUnitv,
  UnitNetwork: chainUnitNetwork,
  'VLN PC': chainVln,
  Wapex: chainTotem,
  'Web3Games Plum': chainWeb3games,
  'Zenlink PC1': chainZenlink,
  'ZERO.IO': chainZero
}).reduce<Record<string, string>>((colors, [chain, color]) => ({
  ...colors,
  [sanitize(chain)]: color
}), {});

// Alphabetical overrides based on the actual software node type
// NOTE: This is as retrieved via the system.name RPC
export const nodeColors = Object.entries({
  'Apron Node': nodeApron,
  Astar: nodeAstar,
  'Automata ContextFree Node': nodeAutomataContextFree,
  'Automata Node': nodeAutomata,
  'Bajun Node': nodeBajun,
  Basilisk: nodeBasilisk,
  'Bifrost Node': nodeBifrost,
  'Bifrost Stage Testnet': nodeBifrost,
  'Bit.Country Node': nodeBitCountry,
  centrifuge: nodeCentrifuge,
  'centrifuge chain': nodeCentrifuge,
  'Centrifuge Chain Node': nodeCentrifuge,
  'Competitors Club': nodeCompetitorsClub,
  'Crown Sterling': nodeCrownSterling,
  'Dora Factory': chainDorafactory,
  'DOTMog Node': nodeDotMog,
  Efinity: nodeEfinity,
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
  'InvArch Brainstorm Node': chainBrainstorm,
  IpseTestnet: nodeIpse,
  'Jaz Node': nodeJaz,
  'Joystream Node': nodeJoystream,
  'Konomi Collator': nodeKonomi,
  'Kpron Collator': nodeKpron,
  kusari: nodeKusari,
  'Kylin Parachain Collator': nodeKylin,
  'Listen Network': chainListen,
  'Litentry node': nodeLitentry,
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
  'Polkadex Node': nodePolkadex,
  'Polymesh Node': nodePolymesh,
  'Pontem Node': nodePontem,
  'Prism Collator': nodePrism,
  'Prism Node': nodePrism,
  'Rio Defi Chain Node': nodeRiochain,
  'Riochain Staging': nodeRiochain,
  'Shiden Collator': chainShiden,
  SubDAO: nodeSubDAO,
  'SubDAO Collator': nodeSubDAO,
  'SubDAO Staging': nodeSubDAO,
  'Subsocial Collator': nodeSubsocialX,
  'subsocial node': nodeSubsocial,
  Subspace: nodeSubspace,
  'subzero node': nodeZero,
  'Ternoa Node': nodeTernoa,
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
