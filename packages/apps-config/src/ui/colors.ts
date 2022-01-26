// Copyright 2017-2022 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* eslint sort-keys: ["error", "asc", { caseSensitive: false }] */

import { sanitize } from './util';

// The mapping here is done on the actual chain name (system.chain RPC) or
// the actual RPC node it is corrected to (system.name RPC)

// defaults
const emptyColor = '#99999';

// based on chain name
// alphabetical
const chainSherpax = '#6bbee8';
const chainAcala = '#645AFF';
const chainAleph = '#00CCAB';
const chainAltair = '#ffb700';
const chainApron = 'linear-gradient(45deg, #0099F7 0%, #2E49EB 100%)';
const chainAstar = '#1b6dc1d9';
const chainAutomata = '#EC7032';
const chainAutomataContextFree = '#EC7032';
const chainBitCountry = '#191a2e';
const chainBitCountryPioneer = '#000000';
const chainBeastEave = '#900048';
const chainCalamari = '#000000';
const chainCoinversation = '#e6017a';
const chainCompetitorsClub = '#213830';
const chainComposable = '#FF8500';
const chainComposableFinance = '#861660';
const chainCrab = '#7C30DD';
const chainCrownSterling = '#13264b';
const chainCrust = '#ff8812';
const chainCrustMaxwell = '#2E333B';
const chainClover = 'linear-gradient(to right, #52ad75, #7cc773)';
const chainChainx = '#F6C94A';
const chainDarwinia = 'linear-gradient(-45deg, #FE3876 0%, #7C30DD 71%, #3A30DD 100%)';
const chainDolphin = '#000000';
const chainDotMog = '#020609';
const chainEfinity = '#496ddb';
const chainEquilibrium = '#1792ff';
const chainFantour = '#5a189a';
const chainGalital = '#00063F';
const chainGamePower = '#5d21a5';
const chainGenshiro = '#e8662d';
const chainHanonycash = '#0099CC';
const chainHeiko = '#42d5de';
const chainHydrate = '#000000';
const chainInterbtc = '#1a0a2d';
const chainInterlay = '#3E96FF';
const chainIpse = '#08a1e8';
const chainKarura = '#ff4c3b';
const chainKhala = '#03f3f3';
const chainKintsugi = '#1a0a2d';
const chainKlug = '#000000';
const chainKulupu = '#003366';
const chainManta = '#2070a6';
const chainMoonrock = '#3d1d5a';
const chainNeumann = '#A8278C';
const chainNFTMart = '#815287';
const chainPangolin = '#5744ff';
const chainPangoro = '#5745de';
const chainParallel = '#ef18ac';
const chainParami = '#ee06e2';
const chainPhala = '#a7e300';
const chainPhoenix = '#d42181';
const chainPlasm = '#2096F3';
const chainPolkadex = '#7C30DD';
const chainPolkadot = '#e6007a';
const chainPolkaFoundry = '#ff527c';
const chainPolkaSmith = '#0DDDFB';
const chainPontem = '#A92FAC';
const chainPrism = 'linear-gradient(45deg, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%)';
const chainKilt = '#8c145a';
const chainKonomi = '#007aff';
const chainKusama = '#000000';
const chainKusari = '#b8860b';
const chainKylin = '#ed007e';
const chainLitentry = 'linear-gradient(45deg, #5cc27c 0%, #6de98f 100%)';
const chainLitmus = '#6822fb';
const chainMybank = '#282736';
const chainOpal = '#3B9C9D';
const chainPichiu = '#ed007e';
const chainQuartz = '#FF4D6A';
const chainRocco = '#6f36dc';
const chainRoccoMandala = '#173DC9';
const chainRoccoAres = '#70FF8B';
const chainAresGladios = '#1295F0';
const chainRoccoBifrost = '#5a25f0';
const chainRococoCanvas = '#000000';
const chainRoccoDarwinia = 'linear-gradient(-45deg, #FE3876 0%, #7C30DD 71%, #3A30DD 100%)';
const chainRoccoDataHighway = 'linear-gradient(-90deg, #9400D3 0%, #5A5CA9 50%, #00BFFF 100%)';
const chainRococoEave = '#900048';
const chainRococoLaminar = '#004FFF';
const chainRoccoTick = '#22bb22';
const chainRoccoTrack = '#bb2222';
const chainRoccoTrick = '#2222bb';
const chainRiochain = '#4d87f6';
const chainSakura = '#ff5995';
const chainShadow = '#ffa940';
const chainShiden = '#5923B2';
const chainSnakenet = '#f653a2';
const chainSora = '#2D2926';
const chainSpanner = '#EC3D3D';
const chainStandard = 'background: radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(42,170,244,1) 35%, rgba(10,10,10,1) 100%)';
const chainWestend = '#da68a7';
const chainWhala = '#03f3f3';
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
const chainUnorthodox = 'radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(42,244,187,1) 35%, rgba(10,10,10,1) 100%)';
const chainVln = '#33cc33';
const chainWeb3games = '#000000';
const chainWestlake = 'linear-gradient(-90deg, #9400D3 0%, #5A5CA9 50%, #00BFFF 100%)';
// based on node name
// alphabetical
const nodeApron = 'linear-gradient(45deg, #0099F7 0%, #2E49EB 100%)';
const nodeAres = '#E56239';
const nodeAstar = '#1b6dc1d9';
const nodeAutomata = '#EC7032';
const nodeAutomataContextFree = '#EC7032';
const nodeBasilisk = '#9eec1b';
const nodeBitCountry = '#191a2e';
const nodeBifrost = '#5a25f0';
const nodeCentrifuge = '#fcc367';
const nodeCoinversation = '#e6017a';
const nodeCompetitorsClub = '#213830';
const nodeCrownSterling = '#13264b';
const nodeDotMog = '#020609';
const nodeEdgeware = '#111111';
const nodeEfinity = '#496ddb';
const nodeEncointer = '#0000cc';
const nodeFantour = '#5a189a';
const nodeGalital = '#00063F;';
const nodeGamePower = '#5d21a5';
const nodeGeek = '#4f46e5';
const nodeHeiko = '#42d5de';
const nodeIntegritee = '#658ea9';
const nodeIpse = '#08a1e8';
const nodeJupiter = '#7143ff';
const nodeKonomi = '#007aff';
const nodeKpron = 'linear-gradient(45deg, #0099F7 0%, #2E49EB 100%)';
const nodeKylin = '#ed007e';
const nodeKlug = '#663399';
const nodeKusari = '#b8860b';
const nodeLitentry = 'linear-gradient(45deg, #5cc27c 0%, #6de98f 100%)';
const nodeManta = '#2070a6';
const nodeMathChain = '#000000';
const nodeMoonbeam = '#53cbc9';
const nodeMoonbase = '#F45B5B';
const nodeMoonriver = '#0E132E';
const nodeMybank = '#282736';
const nodeNFTMart = '#307182';
const nodeNodle = '#1ab394';
const nodeOdyssey = '#1295F0';
const nodeOpportunity = '#6143bc';
const nodeOriginTrail = '#131415';
const nodePangolin = '#5744ff';
const nodePangoro = '#5745de';
const nodeParallel = '#ef18ac';
const nodeParami = '#ee06e2';
const nodePichiu = '#ed007e';
const nodePolkadex = '#7C30DD';
const nodePolymesh = '#1348e4';
const nodePontem = '#A92FAC';
const nodePrism = 'linear-gradient(45deg, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%)';
const nodeRealis = '#000000';
const nodeRiochain = '#1A3BB3';
const nodeRobonomics = '#2949d3';
const nodeSora = '#2D2926';
const nodeStafi = '#00F3AB';
const nodeSubDAO = 'linear-gradient(50deg, #F20092 0%, #FF4D5D 100%)';
const nodeSubsocial = '#b9018c';
const nodeSubspace = '#562b8e';
const nodeTernoa = '#d622ff';
const nodeUniarts = chainUniarts;
const nodeUnique = chainUnique;
const nodeOpal = chainOpal;
const nodeWeb3games = '#000000';
const nodeWestlake = chainWestlake;
const nodeZeitgeist = 'linear-gradient(180deg, rgba(32,90,172,1) 0%, rgba(26,72,138,1) 50%, rgba(13,36,69,1) 100%)';
const nodeZero = '#0099cc';
const nodeZenlink = 'linear-gradient(45deg, #F20082 0%, #FF4D4D 100%)';
const nodeSubGame = '#EB027D';
const nodeZCloak = 'linear-gradient(to right, #E89A76 0%, #C5B8CC 50%, #B0B4D7 100%)';

// based on the spec name
const specShell = '#2e86ab'; // '#0596FC';
const specStatemine = '#113911';
const specStatemint = '#86e62a';
const specWestmint = '#77bb77';

export { emptyColor };

// Alphabetical overrides based on the actual matched chain name
// NOTE: This is as retrieved via the system.chain RPC
export const chainColors: Record<string, string> = Object.entries({
  Acala: chainAcala,
  'Acala Dev': chainAcala,
  'acala mandala pc1': chainRoccoMandala,
  'acala mandala pc2': chainRoccoMandala,
  'Aleph Zero': chainAleph,
  'Aleph Zero Testnet': chainAleph,
  Altair: chainAltair,
  'Apron PC1': chainApron,
  'Ares Gladios': chainAresGladios,
  'Ares Odyssey': nodeOdyssey,
  'Ares PC1': chainRoccoAres,
  Astar: chainAstar,
  Automata: chainAutomata,
  'Automata ContextFree': chainAutomataContextFree,
  'Beast Developer': chainBeastEave,
  bifrost: chainRoccoBifrost,
  'Bifrost Asgard CC4': chainRoccoBifrost,
  'Bifrost PC1': chainRoccoBifrost,
  'Bit.Country Tewai Chain': chainBitCountry,
  'Calamari Parachain': chainCalamari,
  'Calamari Parachain Development': chainCalamari,
  'Calamari Parachain Local': chainCalamari,
  'Calamari Parachain Testnet': chainCalamari,
  Canvas: chainRococoCanvas,
  ChainX: chainChainx,
  Clover: chainClover,
  Coinversation: chainCoinversation,
  'Competitors Club': chainCompetitorsClub,
  Composable: chainComposable,
  'Composable Finance': chainComposableFinance,
  'Crown Sterling': chainCrownSterling,
  crust: chainCrust,
  'crust maxwell': chainCrustMaxwell,
  'Crust PC1': chainCrust,
  'darwinia cc1': chainDarwinia,
  'Darwinia Crab': chainCrab,
  'Darwinia Crab Redirect': chainCrab,
  'Darwinia PC2': chainRoccoDarwinia,
  DataHighway: chainRoccoDataHighway,
  'Dolphin Testnet': chainDolphin,
  'DOTMog.com NET': chainDotMog,
  Efinity: chainEfinity,
  Equilibrium: chainEquilibrium,
  EquilibriumTestnet: chainGenshiro,
  'Fantour Development': chainFantour,
  Galital: chainGalital,
  'Galois-PoC-1': chainGalois,
  'GamePower Network': chainGamePower,
  Genshiro: chainGenshiro,
  'Genshiro Rococo Testnet': chainGenshiro,
  'Halongbay PC1': chainPolkaFoundry,
  hanonycash: chainHanonycash,
  HydraDX: chainSnakenet,
  'HydraDX Hydrate': chainHydrate,
  'HydraDX Snakenet': chainSnakenet,
  'HydraDX Snakenet Gen2': chainSnakenet,
  'HydraDX Snakenet Gen3': chainSnakenet,
  Idavoll: chainIdavoll,
  InterBTC: chainInterbtc,
  'InterBTC Staging': chainInterbtc,
  Interlay: chainInterlay,
  IpseTestnet: chainIpse,
  'Jupiter A1': chainJupiter,
  'Jupiter PC1': chainJupiter,
  Karura: chainKarura,
  Khala: chainKhala,
  KILT: chainKilt,
  'KILT Local': chainKilt,
  'KILT Peregrine': chainKilt,
  'KILT Spiritnet': chainKilt,
  'KILT Testnet': chainKilt,
  Kintsugi: chainKintsugi,
  'KLUGDOSSIER.NET': chainKlug,
  Konomi: chainKonomi,
  Kpron: nodeKpron,
  Kulupu: chainKulupu,
  Kusama: chainKusama,
  'Kusama CC1': chainKusama,
  'Kusama CC2': chainKusama,
  'Kusama CC3': chainKusama,
  kusari: chainKusari,
  'Kylin Testnet': chainKylin,
  'laminar turbulence pc1': chainRococoLaminar,
  Litentry: chainLitentry,
  Litmus: chainLitmus,
  'Manta Parachain': chainManta,
  'Manta Parachain Development': chainManta,
  'Manta Parachain Local': chainManta,
  'Manta Parachain Testnet': chainManta,
  Mars: nodeAres,
  MathChain: nodeMathChain,
  'MathChain PC1': chainGalois,
  'Moonbase Alpha': nodeMoonbase,
  'Moonbase Development Testnet': nodeMoonbase,
  'Moonbase Stage': nodeMoonbase,
  Moonbeam: nodeMoonbeam,
  Moonriver: nodeMoonriver,
  Moonrock: chainMoonrock,
  Moonshadow: nodeMoonbeam,
  'mybank.network Testnet': chainMybank,
  'Neumann Network': chainNeumann,
  'NFTMart Staging': chainNFTMart,
  'NFTMart Testnet': chainNFTMart,
  'Opal Node': chainOpal,
  'OriginTrail Parachain': nodeOriginTrail,
  'OriginTrail Parachain Testnet': nodeOriginTrail,
  Pangolin: chainPangolin,
  Pangoro: chainPangoro,
  Parallel: chainParallel,
  'Parallel Heiko': chainHeiko,
  'Parami PC2': chainParami,
  'Phala PC1': chainPhala,
  'Phala PoC 4': chainPhala,
  PHOENIX: chainPhoenix,
  'Pichiu Testnet': chainPichiu,
  'Pioneer Network': chainBitCountryPioneer,
  Plasm: chainPlasm,
  'Plasm PC2': chainPlasm,
  PolkaBTC: chainInterbtc,
  'Polkadex Testnet': chainPolkadex,
  Polkadot: chainPolkadot,
  'Polkadot CC1': chainPolkadot,
  PolkaSmith: chainPolkaSmith,
  'Pontem Testnet': chainPontem,
  'Prism PC1': chainPrism,
  'Prism Testnet': chainPrism,
  'QUARTZ by UNIQUE': chainQuartz,
  'ReAlis Network': nodeRealis,
  'RioChain CC-1': chainRiochain,
  'Riochain Staging': chainRiochain,
  Robonomics: nodeRobonomics,
  Rococo: chainRocco,
  Sakura: chainSakura,
  Shadow: chainShadow,
  Sherpax: chainSherpax,
  'Sherpax Testnet': chainSherpax,
  Shiden: chainShiden,
  'SORA Kusama': chainSora,
  Spanner: chainSpanner,
  Standard: chainStandard,
  'Standard Kusama Parachain': chainUnorthodox,
  Statemine: specStatemine,
  'Statemine Test': specStatemine,
  Statemint: specStatemint,
  'Statemint Test': specStatemint,
  'Steam PC': chainRococoEave,
  SubDAO: chainSubDAO,
  'SubDAO PC1': chainSubDAO,
  'SubDAO Staging': chainSubDAO,
  subgame: nodeSubGame,
  'SubGame Gamma': nodeSubGame,
  'SubGame Staging': nodeSubGame,
  'Subsocial PC1': chainSubsocial,
  Subspace: nodeSubspace,
  Tick: chainRoccoTick,
  Track: chainRoccoTrack,
  Trick: chainRoccoTrick,
  'TrustBase PC1': chainTrustBase,
  'uni arts staging network': chainUniarts,
  'UniArts Mainnet': chainUniarts,
  'Unique Node': chainUnique,
  UNIT: chainUnitv,
  'VLN PC': chainVln,
  'Web3Games Plum': chainWeb3games,
  Westend: chainWestend,
  Westlake: chainWestlake,
  Westmint: specWestmint,
  'Westmint Test': specWestmint,
  Whala: chainWhala,
  WILT: chainKilt,
  'zcloak poc1': nodeZCloak,
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
  Basilisk: nodeBasilisk,
  'Bifrost Node': nodeBifrost,
  'Bit.Country Node': nodeBitCountry,
  'centrifuge chain': nodeCentrifuge,
  'Centrifuge Chain Node': nodeCentrifuge,
  Coinversation: nodeCoinversation,
  'Competitors Club': nodeCompetitorsClub,
  'Crown Sterling': nodeCrownSterling,
  'DOTMog Node': nodeDotMog,
  'edgeware node': nodeEdgeware,
  Efinity: nodeEfinity,
  'Encointer collator': nodeEncointer,
  'Encointer Node noTEE': nodeEncointer,
  'Fantour Development': nodeFantour,
  Galital: nodeGalital,
  'Galital Parachain Collator': nodeGalital,
  'GamePower Node': nodeGamePower,
  GEEK: nodeGeek,
  'Integritee Collator': nodeIntegritee,
  'Integritee Node': nodeIntegritee,
  IpseTestnet: nodeIpse,
  'Klug Dossier Node': nodeKlug,
  'Konomi Collator': nodeKonomi,
  'Kpron Collator': nodeKpron,
  kusari: nodeKusari,
  'Kylin Parachain Collator': nodeKylin,
  'Litentry Collator': nodeLitentry,
  'Manta Collator': nodeManta,
  'Manta Node': nodeManta,
  MathChain: nodeMathChain,
  'mybank.network node': nodeMybank,
  'NFTMart Staging': nodeNFTMart,
  'NFTMart Testnet': nodeNFTMart,
  'nodle chain node': nodeNodle,
  'Opal Node': nodeOpal,
  'Opportunity Standalone Testnet': nodeOpportunity,
  'OriginTrail Parachain': nodeOriginTrail,
  Pangolin: nodePangolin,
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
  'ReAlis Network': nodeRealis,
  'Rio Defi Chain Node': nodeRiochain,
  'Riochain Staging': nodeRiochain,
  'Shiden Collator': chainShiden,
  SORA: nodeSora,
  'Stafi node': nodeStafi,
  'Statemine Collator': specStatemint,
  'Statemint Collator': specStatemint,
  SubDAO: nodeSubDAO,
  'SubDAO Collator': nodeSubDAO,
  'SubDAO Staging': nodeSubDAO,
  subgame: nodeSubGame,
  'SubGame Gamma': nodeSubGame,
  'SubGame Staging': nodeSubGame,
  'subsocial node': nodeSubsocial,
  Subspace: nodeSubspace,
  'subzero node': nodeZero,
  'Ternoa Node': nodeTernoa,
  'uni arts node': nodeUniarts,
  'UniArts Node': nodeUniarts,
  'Unique Node': nodeUnique,
  'Web3Games Node': nodeWeb3games,
  Westlake: nodeWestlake,
  'Westmint Collator': specWestmint,
  'zcloak node': nodeZCloak,
  'Zeitgeist Collator': nodeZeitgeist,
  'Zeitgeist Node': nodeZeitgeist,
  'Zenlink Collator': nodeZenlink
}).reduce<Record<string, string>>((colors, [node, color]) => ({
  ...colors,
  [sanitize(node)]: color
}), {});

// Alphabetical overrides based on the actual software node type
// NOTE: This is as retrieved via the system.name RPC
export const specColors = Object.entries({
  shell: specShell,
  statemine: specStatemine,
  statemint: specStatemint,
  westmint: specWestmint
}).reduce<Record<string, string>>((colors, [spec, color]) => ({
  ...colors,
  [sanitize(spec)]: color
}), {});
