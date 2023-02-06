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
const chainBeastEave = '#900048';
const chainBitgreen = '#224851';
const chainBrainstorm = '#161616';
const chainCollectives = '#e6777a'; // '#dfcdfc';
const chainCompetitorsClub = '#213830';
const chainComposableFinance = '#C90E8A';
const chainCrab = '#512DBC';
const chainCreditcoin = '#2D353F';
const chainCreditcoinTestnet = '#00DF83';
const chainCrownSterling = '#13264b';
const chainCrust = '#ff8812';
const chainCrustMaxwell = '#2E333B';
const chainChainx = '#F6C94A';
const chainDarwinia = '#FF0083';
const chainDali = '#000000';
const chainDeBio = '#FF56E0';
const chainDorafactory = '#FF761C';
const chainDotMog = '#020609';
const chainEfinity = '#496ddb';
const chainEquilibrium = '#1792ff';
const chainEthos = '#203050';
const chainFantour = '#5a189a';
const chainFerrum = '#b37700';
const chainFrequency = '#4b64ff';
const chainFrequencyRococo = '#29fd47';
const chainGalital = '#00063F';
const chainGalois = '#000000';
const chainGamePower = '#5d21a5';
const chainGenshiro = '#e8662d';
const chainGM = '#f47b36';
const chainHanonycash = '#0099CC';
const chainHashed = '#9199A9';
const chainHeiko = '#42d5de';
const chainHydrate = '#000000';
const chainIdavoll = '#ff43ff';
const chainImbue = '#baff36';
const chainInterbtc = '#1a0a2d';
const chainInterlay = '#3E96FF';
const chainIpse = '#08a1e8';
const chainKabocha = 'repeating-radial-gradient(black, black 4px, yellow 5px)';
const chainJupiter = '#7143ff';
const chainKarura = '#ff4c3b';
const chainKhala = '#03f3f3';
const chainKintsugi = '#1a0a2d';
const chainKlug = '#000000';
const chainKulupu = '#003366';
const chainKico = '#29B58D';
const chainKico2 = '#29B58D';
const chainKilt = '#8c145a';
const chainKiltDev = '#f05a27';
const chainKiltPeregrine = `linear-gradient(45deg, ${chainKiltDev} 0%, ${chainKilt} 100%)`;
const chainKiltRilt = `linear-gradient(45deg, ${chainKilt} 0%, ${chainKiltDev} 100%)`;
const chainKonomi = '#007aff';
const chainKusamaDataHighway = 'linear-gradient(-90deg, #9400D3 0%, #5A5CA9 50%, #00BFFF 100%)';
const chainKusari = '#b8860b';
const chainKylin = '#ed007e';
const chainListen = '#FFAD0A';
const chainLitentry = 'linear-gradient(45deg, #5cc27c 0%, #6de98f 100%)';
const chainLitentryRococo = '#0a6a08';
const chainLitmus = '#6822fb';
const chainLogion = 'rgb(21, 38, 101)';
const chainLuhn = '#2F8E85';
const chainMinix = '#5152f7';
const chainMangata = '#030408';
const chainMd5 = '#3584e4';
const chainMoonrock = '#3d1d5a';
const chainMoonsama = '#000000';
const chainMybank = '#282736';
const chainMyriad = '#7342CC';
const chainNFTMart = '#815287';
const chainNodle = '#1ab394';
const chainOAK = '#A8278C';
const chainOLI = '#8CC63F';
const chainOmniBTC = '#6759E9';
const chainOpal = '#3B9C9D';
const chainOriginTrail = '#FB5DEB';
const chainOriginTrailTestnet = '#0C0C0C';
const chainPangolin = '#4B30DD';
const chainPangoro = '#4B30DD';
const chainParallel = '#ef18ac';
const chainParami = '#ee06e2';
const chainPendulum = '#49E2FD';
const chainPicasso = '#000000';
const chainPichiu = '#ed007e';
const chainPhala = '#c6fa4c';
const chainPhoenix = '#d42181';
const chainPolkadex = '#7C30DD';
const chainPolkaFoundry = '#ff527c';
const chainPolkaSmith = '#0DDDFB';
const chainPontem = '#A92FAC';
const chainPrism = 'linear-gradient(45deg, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%)';
const chainQuartz = '#FF4D6A';
const chainRoccoMandala = '#173DC9';
const chainRoccoAres = '#70FF8B';
const chainAresGladios = '#1295F0';
const chainRoccoBifrost = '#5a25f0';
const chainRococoContracts = '#000000';
const chainRoccoDarwinia = '#FF0083';
const chainRoccoDataHighway = 'linear-gradient(-90deg, #9400D3 0%, #5A5CA9 50%, #00BFFF 100%)';
const chainRococoEave = '#900048';
const chainRococoLaminar = '#004FFF';
const chainRoccoTick = '#22bb22';
const chainRoccoTrack = '#bb2222';
const chainRoccoTrick = '#2222bb';
const chainRiochain = '#4d87f6';
const chainShadow = '#ffa940';
const chainShiden = '#5923B2';
const chainSkyeKiwi = '#6667ab';
const chainSnakenet = '#f653a2';
const chainSora = '#2D2926';
const chainSpanner = '#EC3D3D';
const chainStandard = 'background: radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(42,170,244,1) 35%, rgba(10,10,10,1) 100%)';
const chainSwapdex = '#E94082';
const chainSubDAO = 'linear-gradient(50deg, #F20092 0%, #FF4D5D 100%)';
const chainTotem = 'linear-gradient(158deg, rgba(226,157,0,1) 0%, rgba(234,55,203,1) 100%)';
const chainTrustBase = '#ff43aa';
const chainTuring = '#A8278C';
const chainUniarts = 'linear-gradient(150deg, #333ef7 0%, #55adff 100%)';
const chainUnique = '#40BCFF';
const chainUnitNetwork = '#a351ef';
const chainUnitv = '#1452F0';
const chainUnorthodox = 'radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(42,244,187,1) 35%, rgba(10,10,10,1) 100%)';
const chainVara = '#32e37d';
const chainVln = '#33cc33';
const chainWeb3games = '#000000';
const chainWhala = '#03f3f3';
const chainZero = '#000000';
const chainZenlink = 'linear-gradient(45deg, #F20082 0%, #FF4D4D 100%)';
const chainRiodefi = '#4E7AED';
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
const nodeEdgeware = '#111111';
const nodeEfinity = '#496ddb';
const nodeEncointer = '#0000cc';
const nodeFantour = '#5a189a';
const nodeGalital = '#00063F;';
const nodeGamePower = '#5d21a5';
const nodeGeek = '#4f46e5';
const nodeHashed = '#59EAF6';
const nodeHeiko = '#42d5de';
const nodeImbue = '#baff36';
const nodeIntegritee = '#658ea9';
const nodeIpse = '#08a1e8';
const nodeJaz = '#121212';
const nodeJoystream = '#4038FF';
const nodeJupiter = '#7143ff';
const nodeKabocha = 'repeating-radial-gradient(black, black 4px, yellow 5px)';
const nodeKonomi = '#007aff';
const nodeKpron = 'linear-gradient(45deg, #0099F7 0%, #2E49EB 100%)';
const nodeKylin = '#ed007e';
const nodeKlug = '#663399';
const nodeKusari = '#b8860b';
const nodeLitentry = 'linear-gradient(45deg, #5cc27c 0%, #6de98f 100%)';
const nodeLuhn = '#2DCE89';
const nodeManta = '#2070a6';
const nodeMathChain = '#000000';
const nodeMd5 = '#175bae';
const nodeMoonbeam = '#53cbc9';
const nodeMoonbase = '#F45B5B';
const nodeMoonriver = '#0E132E';
const nodeMybank = '#282736';
const nodeNFTMart = '#307182';
const nodeNodle = '#1ab394';
const nodeOdyssey = '#1295F0';
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
const nodeRealis = '#000000';
const nodeRiochain = '#1A3BB3';
const nodeRobonomics = '#2949d3';
const nodeSora = '#2D2926';
const nodeStafi = '#00F3AB';
const nodeSubDAO = 'linear-gradient(50deg, #F20092 0%, #FF4D5D 100%)';
const nodeSubsocial = '#b9018c';
const nodeSubsocialX = '#69058C';
const nodeSubspace = '#562b8e';
const nodeSwapdex = '#E94082';
const nodeTernoa = '#d622ff';
const nodeUniarts = chainUniarts;
const nodeUnitNetwork = '#a351ef';
const nodeUnique = chainUnique;
const nodeOpal = chainOpal;
const nodeWeb3games = '#000000';
const nodeZero = '#0099cc';
const nodeZenlink = 'linear-gradient(45deg, #F20082 0%, #FF4D4D 100%)';

// Alphabetical overrides based on the actual matched chain name
// NOTE: This is as retrieved via the system.chain RPC
export const chainColors: Record<string, string> = Object.entries({
  'acala mandala pc1': chainRoccoMandala,
  'acala mandala pc2': chainRoccoMandala,
  'Ares Gladios': chainAresGladios,
  'Ares Odyssey': nodeOdyssey,
  'Ares PC1': chainRoccoAres,
  'Basilisk testnet': chainBasiliskTestnet,
  'Beast Developer': chainBeastEave,
  bifrost: chainRoccoBifrost,
  'Bifrost Asgard CC4': chainRoccoBifrost,
  'Bifrost K Rococo': chainRoccoBifrost,
  'Bifrost Kusama': chainRoccoBifrost,
  'Bifrost PC1': chainRoccoBifrost,
  'Bifrost Polkadot': chainRoccoBifrost,
  'Bifrost Stage Testnet': chainRoccoBifrost,
  Bitgreen: chainBitgreen,
  BitgreenRococo: chainBitgreen,
  Centrifuge: nodeCentrifuge,
  ChainOLI: chainOLI,
  ChainX: chainChainx,
  Collectives: chainCollectives,
  'Competitors Club': chainCompetitorsClub,
  'Composable Finance': chainComposableFinance,
  'Contracts on Rococo': chainRococoContracts,
  'Crab Parachain': chainCrab,
  Creditcoin: chainCreditcoin,
  'Creditcoin Testnet': chainCreditcoinTestnet,
  'Crown Sterling': chainCrownSterling,
  crust: chainCrust,
  'crust maxwell': chainCrustMaxwell,
  'Crust PC1': chainCrust,
  'Crust Testnet': chainCrust,
  'Dali Rococo': chainDali,
  'Dali Westend': chainDali,
  Darwinia: chainDarwinia,
  'darwinia cc1': chainDarwinia,
  'Darwinia Crab': chainCrab,
  'Darwinia Crab Redirect': chainCrab,
  'Darwinia Parachain': chainDarwinia,
  'Darwinia PC2': chainRoccoDarwinia,
  'DataHighway Spreehafen Rococo Parachain Testnet': chainRoccoDataHighway,
  'DataHighway Tanganika Kusama Parachain': chainKusamaDataHighway,
  DeBio: chainDeBio,
  'DeBio Testnet': chainDeBio,
  'Dora Factory': chainDorafactory,
  'DOTMog.com NET': chainDotMog,
  Efinity: chainEfinity,
  Equilibrium: chainEquilibrium,
  'Equilibrium parachain': chainEquilibrium,
  EquilibriumTestnet: chainGenshiro,
  'Ethos Testnet': chainEthos,
  'Fantour Development': chainFantour,
  'Ferrum Testnet': chainFerrum,
  Frequency: chainFrequency,
  'Frequency Rococo': chainFrequencyRococo,
  Galital: chainGalital,
  'Galois-PoC-1': chainGalois,
  'GamePower Network': chainGamePower,
  Genshiro: chainGenshiro,
  'Genshiro Rococo Testnet': chainGenshiro,
  'GM Parachain': chainGM,
  'Halongbay PC1': chainPolkaFoundry,
  hanonycash: chainHanonycash,
  'Hashed Network': chainHashed,
  HydraDX: chainSnakenet,
  'HydraDX testnet': chainHydrate,
  Idavoll: chainIdavoll,
  'Imbue Testnet': chainImbue,
  InterBTC: chainInterbtc,
  'InterBTC Staging': chainInterbtc,
  Interlay: chainInterlay,
  'InvArch Brainstorm Testnet': chainBrainstorm,
  IpseTestnet: chainIpse,
  'Jupiter A1': chainJupiter,
  'Jupiter PC1': chainJupiter,
  Kabocha: chainKabocha,
  'Kabocha (kabsoup)': nodeKabocha,
  Kapex: chainTotem,
  Karura: chainKarura,
  Khala: chainKhala,
  KICO: chainKico,
  KICO2: chainKico2,
  KILT: chainKilt,
  'KILT Local': chainKiltDev,
  'KILT Peregrine': chainKiltPeregrine,
  'KILT Peregrine Stagenet': chainKiltDev,
  'KILT Spiritnet': chainKilt,
  'KILT Spiritnet Development': chainKiltDev,
  'KILT Testnet': chainKiltDev,
  Kintsugi: chainKintsugi,
  'KLUGDOSSIER.NET': chainKlug,
  Konomi: chainKonomi,
  Kpron: nodeKpron,
  Kulupu: chainKulupu,
  kusari: chainKusari,
  'Kylin Testnet': chainKylin,
  'laminar turbulence pc1': chainRococoLaminar,
  'Listen Network': chainListen,
  Litentry: chainLitentry,
  'Litentry-rococo': chainLitentryRococo,
  Litmus: chainLitmus,
  'Luhn Network': chainLuhn,
  'Mangata Kusama Mainnet': chainMangata,
  'Mangata Public Testnet': chainMangata,
  Mars: nodeAres,
  MathChain: nodeMathChain,
  'MathChain PC1': chainGalois,
  'MD5 Network': chainMd5,
  Minix: chainMinix,
  'Minix Testnet': chainMinix,
  'Moonbase Alpha': nodeMoonbase,
  'Moonbase Development Testnet': nodeMoonbase,
  'Moonbase Stage': nodeMoonbase,
  Moonbeam: nodeMoonbeam,
  Moonriver: nodeMoonriver,
  Moonrock: chainMoonrock,
  'Moonsama Development': chainMoonsama,
  Moonshadow: nodeMoonbeam,
  'mybank.network Testnet': chainMybank,
  Myriad: chainMyriad,
  'Myriad Testnet': chainMyriad,
  'NFTMart Staging': chainNFTMart,
  'NFTMart Testnet': chainNFTMart,
  'Nodle Parachain': chainNodle,
  'Nodle Testing Parachain': chainNodle,
  'OAK Network': chainOAK,
  Odyssey: nodeOdyssey,
  'OLI Parachain': chainOLI,
  OmniBTC: chainOmniBTC,
  'Opal Node': chainOpal,
  'OriginTrail Parachain': chainOriginTrail,
  'OriginTrail Parachain Testnet': chainOriginTrailTestnet,
  Pangolin: chainPangolin,
  'Pangolin Parachain': chainPangolin,
  Pangoro: chainPangoro,
  Parallel: chainParallel,
  'Parallel Heiko': chainHeiko,
  'Parami PC2': chainParami,
  Pendulum: chainPendulum,
  Phala: chainPhala,
  PHOENIX: chainPhoenix,
  Picasso: chainPicasso,
  'Pichiu Testnet': chainPichiu,
  PolkaBTC: chainInterbtc,
  'Polkadex Testnet': chainPolkadex,
  PolkaSmith: chainPolkaSmith,
  'Pontem Testnet': chainPontem,
  'Prism PC1': chainPrism,
  'Prism Testnet': chainPrism,
  'QUARTZ by UNIQUE': chainQuartz,
  'ReAlis Network': nodeRealis,
  RILT: chainKiltRilt,
  'RioChain CC-1': chainRiochain,
  'Riochain Staging': chainRiochain,
  Riodefi: chainRiodefi,
  Robonomics: nodeRobonomics,
  Shadow: chainShadow,
  Shiden: chainShiden,
  'SkyeKiwi Testnet Alpha': chainSkyeKiwi,
  'SORA Kusama': chainSora,
  'SORA Rococo': chainSora,
  Spanner: chainSpanner,
  Stagex: chainTotem,
  Standard: chainStandard,
  'Standard Kusama Parachain': chainUnorthodox,
  'Steam PC': chainRococoEave,
  SubDAO: chainSubDAO,
  'SubDAO PC1': chainSubDAO,
  'SubDAO Staging': chainSubDAO,
  Subspace: nodeSubspace,
  Subzero: chainZero,
  swapdex: chainSwapdex,
  Tick: chainRoccoTick,
  Track: chainRoccoTrack,
  Trick: chainRoccoTrick,
  'TrustBase PC1': chainTrustBase,
  'Turing Network': chainTuring,
  'Turing Network (Staging)': chainTuring,
  'uni arts staging network': chainUniarts,
  'UniArts Mainnet': chainUniarts,
  'Unique Node': chainUnique,
  UNIT: chainUnitv,
  UnitNetwork: chainUnitNetwork,
  'Vara Network': chainVara,
  'VLN PC': chainVln,
  Wapex: chainTotem,
  'Web3Games Plum': chainWeb3games,
  Whala: chainWhala,
  WILT: chainKilt,
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
  'Bitgreen Node': chainBitgreen,
  centrifuge: nodeCentrifuge,
  'centrifuge chain': nodeCentrifuge,
  'Centrifuge Chain Node': nodeCentrifuge,
  'Competitors Club': nodeCompetitorsClub,
  'Crown Sterling': nodeCrownSterling,
  'DataHighway Spreehafen Rococo Parachain Testnet': chainRoccoDataHighway,
  'DataHighway Tanganika Kusama Parachain': chainKusamaDataHighway,
  DeBio: chainDeBio,
  'Dora Factory': chainDorafactory,
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
  'GM Collator': chainGM,
  'Hashed Network': nodeHashed,
  'Imbue Parachain Collator': nodeImbue,
  'Integritee Collator': nodeIntegritee,
  'Integritee Node': nodeIntegritee,
  'InvArch Brainstorm Node': chainBrainstorm,
  IpseTestnet: nodeIpse,
  'Jaz Node': nodeJaz,
  'Joystream Node': nodeJoystream,
  Kabocha: chainKabocha,
  'Kabocha (kabsoup)': nodeKabocha,
  KICO: chainKico,
  KICO2: chainKico2,
  'Klug Dossier Node': nodeKlug,
  'Konomi Collator': nodeKonomi,
  'Kpron Collator': nodeKpron,
  kusari: nodeKusari,
  'Kylin Parachain Collator': nodeKylin,
  'Listen Network': chainListen,
  'Litentry node': nodeLitentry,
  'logion Collator': chainLogion,
  'Logion Node': chainLogion,
  'Luhn Collator': nodeLuhn,
  'Manta Collator': nodeManta,
  'Manta Node': nodeManta,
  MathChain: nodeMathChain,
  'MD5 Collator': nodeMd5,
  'Moonsama Development': chainMoonsama,
  'mybank.network node': nodeMybank,
  Myriad: chainMyriad,
  'NFTMart Staging': nodeNFTMart,
  'NFTMart Testnet': nodeNFTMart,
  'nodle chain node': nodeNodle,
  OmniBTC: nodeOmniBTC,
  'Opal Node': nodeOpal,
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
  'ReAlis Network': nodeRealis,
  'Rio Defi Chain Node': nodeRiochain,
  'Riochain Staging': nodeRiochain,
  'Shiden Collator': chainShiden,
  SORA: nodeSora,
  'Stafi node': nodeStafi,
  SubDAO: nodeSubDAO,
  'SubDAO Collator': nodeSubDAO,
  'SubDAO Staging': nodeSubDAO,
  'Subsocial Collator': nodeSubsocialX,
  'subsocial node': nodeSubsocial,
  Subspace: nodeSubspace,
  'subzero node': nodeZero,
  swapdex: nodeSwapdex,
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
