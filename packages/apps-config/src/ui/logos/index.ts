// Copyright 2017-2022 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* eslint sort-keys: ["error", "asc", { caseSensitive: false }] */

// The mapping here is done on the actual chain name (system.chain RPC) or
// the actual RPC node it is corrected to (system.name RPC)

// anything for a specific chain, most would probably fit into the node category (but allow for chain-specific)
// alphabetical
import { sanitize } from '../util';
import chainAcala from './chains/acala.svg';
import chainAleph from './chains/aleph.svg';
import chainAltair from './chains/altair.svg';
import chainAstar from './chains/astar.png';
import chainCoinversation from './chains/coinversation.png';
import chainCompetitorsClub from './chains/competitors-club.png';
import chainComposableFinance from './chains/composableFinance.png';
import chainCrownSterling from './chains/crown-sterling.png';
import chainDusty from './chains/dusty.png';
import chainEfinity from './chains/efinity.svg';
import chainEquilibrium from './chains/equilibrium.svg';
import chainGenshiro from './chains/genshiro.svg';
import chainHydrate from './chains/hydrate.png';
import chainInterlay from './chains/interlay.svg';
import chainKarura from './chains/karura.svg';
import chainKintsugi from './chains/kintsugi.png';
import chainKusama from './chains/kusama-128.gif';
import chainOpal from './chains/opal-logo.png';
import chainParallel from './chains/parallel.svg';
import chainComposable from './chains/picasso.svg';
import chainQuartz from './chains/quartz.png';
import chainRococo from './chains/rococo.svg';
import chainRococoCanvas from './chains/rococo-canvas.svg';
import chainRococoTick from './chains/rococo-tick.svg';
import chainRococoTrack from './chains/rococo-track.svg';
import chainRococoTrick from './chains/rococo-trick.svg';
import chainShiden from './chains/shiden.png';
import chainSnakenet from './chains/snakenet.svg';
import chainSpanner from './chains/spanner.png';
import chainStandard from './chains/standard.png';
import chainUnique from './chains/unique.svg';
import chainUnorthodox from './chains/unorthodox.png';
import extensionPolkadotJs from './extensions/polkadot-js.svg';
import externalCommonwealth from './external/commonwealth.png';
import externalDotreasury from './external/dotreasury.svg';
import externalDotScanner from './external/dotscanner.png';
import externalPolkascan from './external/polkascan.png';
import externalPolkassembly from './external/polkassembly.png';
import externalPolkastats from './external/polkastats.png';
import externalSingular from './external/singular.svg';
import externalStatescan from './external/statescan.svg';
import externalSubId from './external/subid.svg';
import externalSubscan from './external/subscan.svg';
import externalSubsquare from './external/subsquare.svg';
import nodeApron from './nodes/apron.png';
import nodeAres from './nodes/ares.png';
import nodeAresGladios from './nodes/ares-gladios.svg';
import nodeAresMars from './nodes/ares-mars.png';
import nodeAstar from './nodes/astar.png';
import nodeAutomata from './nodes/automata.png';
import nodeBasilisk from './nodes/basilisk.png';
import nodeBeast from './nodes/beast.svg';
import nodeBifrost from './nodes/bifrost.svg';
import nodeBitCountry from './nodes/bitcountry.svg';
import nodeCalamari from './nodes/calamari.png';
import nodeCentrifuge from './nodes/centrifuge.png';
import nodeChainx from './nodes/chainx.svg';
import nodeClover from './nodes/clover.svg';
import nodeCoinversation from './nodes/coinversation.png';
import nodeCompetitorsClub from './nodes/competitors-club.png';
import nodeCrab from './nodes/crab.svg';
import nodeCrownSterling from './nodes/crown-sterling.png';
import nodeCrust from './nodes/crust.svg';
import nodeCrustMaxwell from './nodes/crust-maxwell.svg';
import nodeCrustParachain from './nodes/crustParachain.svg';
import nodeDarwinia from './nodes/darwinia.png';
import nodeDataHighway from './nodes/datahighway.png';
import nodeDockMainnet from './nodes/dock-mainnet.png';
import nodeDockTestnet from './nodes/dock-testnet.png';
import nodeDolphin from './nodes/dolphin.svg';
import nodeDotMog from './nodes/dotmog.svg';
import nodeEave from './nodes/eave.svg';
import nodeEdgeware from './nodes/edgeware-white.png';
import nodeEfinity from './nodes/efinity.svg';
import nodeEncointer from './nodes/encointer-blue.svg';
import nodeFantour from './nodes/fantour.png';
import nodeGalital from './nodes/galital-logo.png';
import nodeGamePower from './nodes/gamepower.svg';
import nodeGeek from './nodes/geek.svg';
import nodeHanonycash from './nodes/hanonycash.svg';
import nodeIdavoll from './nodes/idavoll.png';
import nodeIntegritee from './nodes/integritee.svg';
import nodeInterBTC from './nodes/interlay.svg';
import nodeIpse from './nodes/ipse.png';
import nodeJupiter from './nodes/jupiter.svg';
import nodeKhala from './nodes/khala.svg';
import nodeKilt from './nodes/kilt.png';
import nodeKlug from './nodes/klug.png';
import nodeKonomi from './nodes/konomi.png';
import nodeKulupu from './nodes/kulupu.svg';
import nodeKusari from './nodes/kusari.svg';
import nodeKylin from './nodes/kylin.png';
import nodeLaminar from './nodes/laminar-circle.svg';
import nodeLitentry from './nodes/litentry.png';
import nodeLitmus from './nodes/litmus.png';
import nodeLoomNetwork from './nodes/loom_network.png';
import nodeManta from './nodes/manta.png';
import nodeMath from './nodes/math.svg';
import moonbase from './nodes/moonbase_alpha.png';
import moonbeam from './nodes/moonbeam.png';
import moonriver from './nodes/moonriver.svg';
import nodeMoonrock from './nodes/moonrock.png';
import moonshadow from './nodes/moonshadow.png';
import mybank from './nodes/mybank.png';
import nodeNFTMart from './nodes/nftmart.png';
import nodeNodle from './nodes/nodle.svg';
import oak from './nodes/oak.png';
import nodeUniqueWestend from './nodes/opal-logo.png';
import nodeOpportunity from './nodes/opportunity.png';
import nodeOriginTrail from './nodes/origintrail.png';
import nodePangolin from './nodes/pangolin.svg';
import nodePangoro from './nodes/pangoro.svg';
import nodeParallel from './nodes/parallel.svg';
import nodeParami from './nodes/parami.png';
import nodePhala from './nodes/phala.svg';
import nodePhoenix from './nodes/phoenix.png';
import nodePichiu from './nodes/pichiu.png';
import nodePioneerNetwork from './nodes/pioneer.png';
import nodePlasm from './nodes/plasm.png';
import nodePolkadex from './nodes/polkadex.svg';
import nodePolkadot from './nodes/polkadot-circle.svg';
import nodePolkadotJs from './nodes/polkadot-js.svg';
import nodePolkaFoundry from './nodes/polkafoundry.svg';
import nodePolkaSmith from './nodes/polkasmith.svg';
import nodePolymesh from './nodes/polymesh.svg';
import nodePontem from './nodes/pontem.svg';
import nodePrism from './nodes/prism.png';
import nodeQuartz from './nodes/quartz.png';
import nodeRealis from './nodes/realis.png';
import nodeRiochain from './nodes/riochain.svg';
import nodeRobonomics from './nodes/robonomics.svg';
import nodeSakura from './nodes/sakura.svg';
import nodeShadow from './nodes/shadow.svg';
import nodeShell from './nodes/shell.svg';
import nodeSherpax from './nodes/sherpax.png';
import nodeSingLavender from './nodes/singlavender.svg';
import nodeSora from './nodes/sora-substrate.svg';
import nodeStafi from './nodes/stafi.png';
import nodeStatemine from './nodes/statemine.svg';
import nodeSubDAO from './nodes/subdao.png';
import nodeSubGame from './nodes/subgame.svg';
import nodeSubsocial from './nodes/subsocial.svg';
import nodeSubspace from './nodes/subspace.png';
import nodeSubstrateContractsNode from './nodes/substrate-contracts-node.png';
import nodeSubstrate from './nodes/substrate-hexagon.svg';
import nodeTernoa from './nodes/ternoa.svg';
import nodeTrustBase from './nodes/trustbase.png';
import nodeUniarts from './nodes/uniarts.png';
import nodeUnique from './nodes/unique.svg';
import nodeUnitv from './nodes/unitv.png';
import nodeVln from './nodes/valiu.png';
import nodeWeb3games from './nodes/web3games.svg';
import nodeWestend from './nodes/westend_colour.svg';
import nodeWestlake from './nodes/westlake.png';
import nodeWhala from './nodes/whala.svg';
import nodeZCloak from './nodes/zCloak.svg';
import nodeZeitgeist from './nodes/zeitgeist.png';
import nodeZenlink from './nodes/zenlink.svg';
import nodeZero from './nodes/zero.svg';
import emptyLogo from './empty.svg';
// last-resort fallback, just something empty

// Alphabetical overrides based on the actual matched chain name
// NOTE: This is as retrieved via system.chain RPC
export const chainLogos = Object.entries({
  'Aleph Zero': chainAleph,
  'Aleph Zero Testnet': chainAleph,
  Altair: chainAltair,
  'Apron PC1': nodeApron,
  'Ares Gladios': nodeAresGladios,
  'Ares Odyssey': nodeAresGladios,
  'Ares PC1': nodeAres,
  Astar: chainAstar,
  Automata: nodeAutomata,
  'Automata ContextFree': nodeAutomata,
  'Beast Developer': nodeBeast,
  Bifrost: nodeBifrost,
  'Bifrost Asgard CC4': nodeBifrost,
  'Calamari Parachain': nodeCalamari,
  'Calamari Parachain Development': nodeCalamari,
  'Calamari Parachain Local': nodeCalamari,
  'Calamari Parachain Testnet': nodeCalamari,
  Canvas: chainRococoCanvas,
  ChainX: nodeChainx,
  'Charcoal Testnet': nodeCentrifuge,
  Coinversation: chainCoinversation,
  'Competitors Club': chainCompetitorsClub,
  'Crown Sterling': chainCrownSterling,
  'Crust Maxwell': nodeCrustMaxwell,
  'Crust PC1': nodeCrust,
  'darwinia crab': nodeCrab,
  'Darwinia Crab PC2': nodeCrab,
  'Darwinia PC2': nodeDarwinia,
  DataHighway: nodeDataHighway,
  'Dolphin Testnet': nodeDolphin,
  Dusty: chainDusty,
  Efinity: chainEfinity,
  Equilibrium: chainEquilibrium,
  EquilibriumTestnet: chainEquilibrium,
  Galital: nodeGalital,
  'GamePower Network': nodeGamePower,
  GEEK: nodeGeek,
  Genshiro: chainGenshiro,
  'Genshiro Rococo Testnet': chainEquilibrium,
  HydraDX: chainSnakenet,
  'HydraDX Hydrate': chainHydrate,
  'HydraDX Snakenet': chainSnakenet,
  'HydraDX Snakenet Gen2': chainSnakenet,
  'HydraDX Snakenet Gen3': chainSnakenet,
  Idavoll: nodeIdavoll,
  InterBTC: nodeInterBTC,
  'InterBTC Staging': nodeInterBTC,
  Interlay: chainInterlay,
  IpseTestnet: nodeIpse,
  'Jupiter A1': nodeJupiter,
  'Jupiter PC1': nodeJupiter,
  Karura: chainKarura,
  KILT: nodeKilt,
  'KILT Local': nodeKilt,
  'KILT Peregrine': nodeKilt,
  'KILT Testnet': nodeKilt,
  Kintsugi: chainKintsugi,
  KlugDossier: nodeKlug,
  Konomi: nodeKonomi,
  Kpron: nodeApron,
  Kusama: chainKusama, // new name after CC3
  'Kusama CC1': chainKusama,
  'Kusama CC2': chainKusama,
  'Kusama CC3': chainKusama,
  kusari: nodeKusari,
  'Kylin Testnet': nodeKylin,
  Litentry: nodeLitentry,
  Litmus: nodeLitmus,
  'Loom Network Local': nodeLoomNetwork,
  LoomNetwork: nodeLoomNetwork,
  'Manta Parachain': nodeManta,
  'Manta Parachain Development': nodeManta,
  'Manta Parachain Local': nodeManta,
  'Manta Parachain Testnet': nodeManta,
  Mars: nodeAresMars,
  MathChain: nodeMath,
  'MathChain PC1': nodeMath,
  'mathchain-galois': nodeMath,
  'Moonbase Alpha': moonbase,
  'Moonbase Development Testnet': moonbase,
  'Moonbase Stage': moonbase,
  Moonbeam: moonbeam,
  Moonriver: moonriver,
  Moonrock: nodeMoonrock,
  Moonshadow: moonshadow,
  'mybank.network PC1': mybank,
  'Neumann Network': oak,
  NFTMart: nodeNFTMart,
  'NFTMart Staging': nodeNFTMart,
  'NFTMart Testnet': nodeNFTMart,
  'OPAL by UNIQUE': chainOpal,
  'OriginTrail Parachain': nodeOriginTrail,
  'OriginTrail Parachain Testnet': nodeOriginTrail,
  Pangolin: nodePangolin,
  Pangoro: nodePangoro,
  Parallel: chainParallel,
  'Parallel Heiko': chainParallel,
  'Parami PC2': nodeParami,
  'Phala PC1': nodePhala,
  'PHOENIX PC1': nodePhoenix,
  'Pichiu Mainnet': nodePichiu,
  'Pichiu Testnet': nodePichiu,
  'Pioneer Network': nodePioneerNetwork,
  'Polkadex Mainnet': nodePolkadex,
  'Polkadex Testnet': nodePolkadex,
  'PolkaFoundry PC1': nodePolkaFoundry,
  'Pontem Testnet': nodePontem,
  'Prism PC1': nodePrism,
  'Prism Testnet': nodePrism,
  'QUARTZ by UNIQUE': chainQuartz,
  'ReAlis Network': nodeRealis,
  'RioChain CC-1': nodeRiochain,
  'RioChain Staging': nodeRiochain,
  Robonomics: nodeRobonomics,
  Rococo: chainRococo,
  Sherpax: nodeSherpax,
  'Sherpax Testnet': nodeSherpax,
  Shiden: chainShiden,
  SingLavender: nodeSingLavender,
  SORA: nodeSora,
  'SORA Kusama': nodeSora,
  Spanner: chainSpanner,
  Statemine: nodeStatemine,
  'Statemine Test': nodeStatemine,
  'Statemint Test': nodeStatemine,
  'Steam PC': nodeEave,
  subdao: nodeSubDAO,
  'SubDAO PC1': nodeSubDAO,
  'SubDAO Staging': nodeSubDAO,
  subgame: nodeSubGame,
  'SubGame Gamma': nodeSubGame,
  'SubGame Staging': nodeSubGame,
  Subsocial: nodeSubsocial,
  'Subsocial PC': nodeSubsocial,
  subspace: nodeSubspace,
  Tick: chainRococoTick,
  Track: chainRococoTrack,
  Trick: chainRococoTrick,
  trustbase: nodeTrustBase,
  'TrustBase PC1': nodeTrustBase,
  'uni arts staging network': nodeUniarts,
  'UniArts Mainnet': nodeUniarts,
  Unique: chainUnique,
  'Unit Network': nodeUnitv,
  Unorthodox: chainUnorthodox,
  Vln: nodeVln,
  'VLN PC': nodeVln,
  'Web3Games Plum': nodeWeb3games,
  Westend: nodeWestend,
  Westlake: nodeWestlake,
  Westmint: nodeStatemine,
  'Westmint Test': nodeStatemine,
  WILT: nodeKilt,
  'zcloak poc1': nodeZCloak
}).reduce<Record<string, unknown>>((logos, [chain, logo]) => ({
  ...logos,
  [sanitize(chain)]: logo
}), {});

// Alphabetical overrides based on the actual software node type
// NOTE: This is as retrieved via system.name RPC
export const nodeLogos = Object.entries({
  'Acala Node': chainAcala,
  'Apron Node': nodeApron,
  'Apron Parachain Collator': nodeApron,
  'Ares Gladios': nodeAresGladios,
  'Ares Node': nodeAres,
  'Ares Parachain Collator': nodeAres,
  Astar: nodeAstar,
  'Automata ContextFree Node': nodeAutomata,
  'Automata Node': nodeAutomata,
  Basilisk: nodeBasilisk,
  'Beast Node': nodeBeast,
  Bifrost: nodeBifrost,
  'Bifrost Node': nodeBifrost,
  'Bit Country Tewai Parachain Collator': nodeBitCountry,
  'Bit.Country': nodeBitCountry,
  'BitCountry Node': nodeBitCountry,
  'Calamari Parachain Collator': nodeCalamari,
  Centrifuge: nodeCentrifuge,
  'centrifuge chain': nodeCentrifuge,
  'Centrifuge Chain Node': nodeCentrifuge,
  'ChainX Node': nodeChainx,
  'Clover Node': nodeClover,
  Coinversation: nodeCoinversation,
  'Competitors Club': nodeCompetitorsClub,
  'Crown Sterling': nodeCrownSterling,
  crust: nodeCrust,
  'Crust Collator': nodeCrust,
  'Crust Maxwell': nodeCrustMaxwell,
  darwinia: nodeDarwinia,
  'darwinia crab': nodeCrab,
  'darwinia parachain': nodeDarwinia,
  'Darwinia Runtime Module Library': nodeDarwinia,
  DataHighway: nodeDataHighway,
  'DataHighway Node': nodeDataHighway,
  'DataHighway Parachain Collator': nodeDataHighway,
  'Dock Full Node': nodeDockMainnet,
  'DOTMog Node': nodeDotMog,
  'Eave Node': nodeEave,
  'Edgeware Node': nodeEdgeware,
  'Efinity Node': nodeEfinity,
  'Encointer collator': nodeEncointer,
  'Encointer Node noTEE': nodeEncointer,
  'Fantour Node': nodeFantour,
  'Galital Parachain Collator': nodeGalital,
  'GamePower Node': nodeGamePower,
  GEEK: nodeGeek,
  'Halongbay Parachain Collator': nodePolkaFoundry,
  hanonycash: nodeHanonycash,
  'Idavoll Node': nodeIdavoll,
  'Integritee Collator': nodeIntegritee,
  'Integritee Node': nodeIntegritee,
  Interlay: chainInterlay,
  IpseTestnet: nodeIpse,
  Khala: nodeKhala,
  'Khala Node': nodeKhala,
  KILT: nodeKilt,
  'KILT Local': nodeKilt,
  'KILT Peregrine': nodeKilt,
  Kintsugi: chainKintsugi,
  'Klug Dossier Node': nodeKlug,
  'Kpron Collator': nodeApron,
  kulupu: nodeKulupu,
  kusari: nodeKusari,
  'Kylin Node': nodeKylin,
  'Laminar Node': nodeLaminar,
  // Litentry: nodeLitentry,
  // 'Litentry Collator': nodeLitentry,
  'mandala node': chainAcala,
  'Manta Node': nodeManta,
  'Manta Parachain Collator': nodeManta,
  MathChain: nodeMath,
  'mathChain-galois': nodeMath,
  Moonrock: nodeMoonrock,
  'mybank.network': mybank,
  'Neumann Network': oak,
  NFTMart: nodeNFTMart,
  'NFTMart Staging': nodeNFTMart,
  'NFTMart Testnet': nodeNFTMart,
  'node-template': nodeSubstrate,
  'Nodle Chain Node': nodeNodle,
  'Opal Node': nodeUniqueWestend,
  'Opportunity Standalone Testnet': nodeOpportunity,
  'OriginTrail Parachain': nodeOriginTrail,
  'OriginTrail Parachain Testnet': nodeOriginTrail,
  Pangolin: nodePangolin,
  Pangoro: nodePangoro,
  Parallel: nodeParallel,
  'Parallel Heiko': nodeParallel,
  Parami: nodeParami,
  'parity-polkadot': nodePolkadot,
  'Patract Node': nodeJupiter,
  'Phala Collator': nodePhala,
  'phala-substrate-node': nodePhala,
  'PHOENIX Collator': nodePhoenix,
  'PHOENIX Node': nodePhoenix,
  'Pichiu Node': nodePichiu,
  'Pioneer Network Collator Node': nodePioneerNetwork,
  Plasm: nodePlasm,
  'Plasm Node': nodePlasm,
  'Plasm Parachain Collator': nodePlasm,
  'Polkadex Node': nodePolkadex,
  'polkadot-js': nodePolkadotJs,
  'PolkaFoundry Node': nodePolkaFoundry,
  'PolkaFoundry Parachain Collator': nodePolkaFoundry,
  'PolkaSmith Parachain Collator': nodePolkaSmith,
  'Pontem Testnet': nodePontem,
  'Prism Collator': nodePrism,
  'Prism Node': nodePrism,
  'Quartz Node': nodeQuartz,
  'ReAlis Network': nodeRealis,
  'Rio Defi Chain Node': nodeRiochain,
  'RioChain Staging': nodeRiochain,
  robonomics: nodeRobonomics,
  Sakura: nodeSakura,
  Shadow: nodeShadow,
  sherpax: nodeSherpax,
  'Shiden Collator': chainShiden,
  'SingLavender Parachain Collator': nodeSingLavender,
  Sora: nodeSora,
  Stafi: nodeStafi,
  'Stafi Node': nodeStafi,
  'Statemine Collator': nodeStatemine,
  'Statemint Collator': nodeStatemine,
  subdao: nodeSubDAO,
  'SubDAO Collator': nodeSubDAO,
  'SubDAO Staging': nodeSubDAO,
  subgame: nodeSubGame,
  'SubGame Gamma': nodeSubGame,
  'SubGame Staging': nodeSubGame,
  'Subsocial Node': nodeSubsocial,
  'Subsocial PC': nodeSubsocial,
  'subsocial-node': nodeSubsocial,
  subspace: nodeSubspace,
  'substrate-contracts-node': nodeSubstrateContractsNode,
  'substrate-node': nodeSubstrate,
  'subzero node': nodeZero,
  'Ternoa Node': nodeTernoa,
  'TrustBase Collator': nodeTrustBase,
  'TrustBase Node': nodeTrustBase,
  'uni arts node': nodeUniarts,
  'UniArts Node': nodeUniarts,
  'Unique Node': nodeUnique,
  'Unit Collator': nodeUnitv,
  'Unit Node': nodeUnitv,
  Vln: nodeVln,
  'VLN PC': nodeVln,
  'Web3Games Node': nodeWeb3games,
  Westend: nodeWestend,
  Westlake: nodeWestlake,
  'Westmint Collator': nodeStatemine,
  Whala: nodeWhala,
  'Whala Node': nodeWhala,
  WILT: nodeKilt,
  'zcloak node': nodeZCloak,
  'Zeitgeist Collator': nodeZeitgeist,
  'Zeitgeist Node': nodeZeitgeist,
  Zenlink: nodeZenlink,
  'Zenlink Collator': nodeZenlink
}).reduce<Record<string, unknown>>((logos, [node, logo]) => ({
  ...logos,
  [sanitize(node)]: logo
}), {});

// Alphabetical overrides based on the actual specName
export const specLogos = Object.entries({
  shell: nodeShell,
  statemine: nodeStatemine,
  statemint: nodeStatemine,
  westmint: nodeStatemine
}).reduce<Record<string, unknown>>((logos, [spec, logo]) => ({
  ...logos,
  [sanitize(spec)]: logo
}), {});

// Alphabetical overrides when we pass an explicit logo name
// NOTE: Matches with what is defined as "info" in settings/endpoints.ts
// (Generally would be the 'network' key in the known ss58 as per
// https://github.com/polkadot-js/common/blob/master/packages/networks/src/index.ts)
export const namedLogos: Record<string, unknown> = {
  acala: chainAcala,
  aleph: chainAleph,
  alexander: nodePolkadot,
  altair: chainAltair,
  'Ares Gladios': nodeAresGladios,
  astar: chainAstar,
  automata: nodeAutomata,
  'automata-contextfree': nodeAutomata,
  basilisk: nodeBasilisk,
  beast: nodeBeast,
  bifrost: nodeBifrost,
  bitcountry: nodeBitCountry,
  bitcountryPioneer: nodePioneerNetwork,
  calamari: nodeCalamari,
  centrifuge: nodeCentrifuge,
  chainx: nodeChainx,
  charcoal: nodeCentrifuge,
  clover: nodeClover,
  coinversation: chainCoinversation,
  'competitors-club': chainCompetitorsClub,
  composableFinance: chainComposableFinance,
  crab: nodeCrab,
  'crown-sterling': chainCrownSterling,
  crust: nodeCrust,
  'Crust Maxwell': nodeCrustMaxwell,
  crustParachain: nodeCrustParachain,
  darwinia: nodeDarwinia,
  datahighway: nodeDataHighway,
  'dock-pos-mainnet': nodeDockMainnet,
  'dock-pos-testnet': nodeDockTestnet,
  dolphin: nodeDolphin,
  dotmog: nodeDotMog,
  dusty: chainDusty,
  eave: nodeEave,
  edgeware: nodeEdgeware,
  efinity: nodeEfinity,
  empty: emptyLogo,
  encointer: nodeEncointer,
  equilibrium: chainEquilibrium,
  fantour: nodeFantour,
  galital: nodeGalital,
  galois: nodeMath,
  gamepower: nodeGamePower,
  geek: nodeGeek,
  genshiro: chainGenshiro,
  halongbay: nodePolkaFoundry,
  hanonycash: nodeHanonycash,
  heiko: chainParallel,
  hydra: chainSnakenet,
  idavoll: nodeIdavoll,
  integritee: nodeIntegritee,
  interbtc: nodeInterBTC,
  interlay: chainInterlay,
  ipse: nodeIpse,
  jupiter: nodeJupiter,
  karura: chainKarura,
  khala: nodeKhala,
  kilt: nodeKilt,
  kintsugi: chainKintsugi,
  klugdossier: nodeKlug,
  kpron: nodeApron,
  kulupu: nodeKulupu,
  kusama: chainKusama,
  kusari: nodeKusari,
  kylin: nodeKylin,
  laminar: nodeLaminar,
  litentry: nodeLitentry,
  litmus: nodeLitmus,
  loomNetwork: nodeLoomNetwork,
  manta: nodeManta,
  mars: nodeAresMars,
  mathchain: nodeMath,
  moonbaseAlpha: moonbase,
  moonbeam: moonbeam,
  moonriver: moonriver,
  moonrock: nodeMoonrock,
  moonshadow: moonshadow,
  mybank: mybank,
  neumann: oak,
  nftmart: nodeNFTMart,
  nodle: nodeNodle,
  odyssey: nodeAresGladios,
  opal: nodeUniqueWestend,
  opportunity: nodeOpportunity,
  'origintrail-parachain-testnet': nodeOriginTrail,
  pangolin: nodePangolin,
  pangoro: nodePangoro,
  parallel: chainParallel,
  phala: nodePhala,
  phoenix: nodePhoenix,
  picasso: chainComposable,
  pichiu: nodePichiu,
  plasm: nodePlasm,
  polkadex: nodePolkadex,
  polkadot: nodePolkadot,
  polkafoundry: nodePolkaFoundry,
  polkasmith: nodePolkaSmith,
  polymesh: nodePolymesh,
  pontem: nodePontem,
  prism: nodePrism,
  quartz: nodeQuartz,
  realis: nodeRealis,
  riochain: nodeRiochain,
  robonomics: nodeRobonomics,
  rocky: nodeCrust,
  rococo: chainRococo,
  rococoAcala: chainAcala,
  rococoApron: nodeApron,
  rococoAres: nodeAres,
  rococoBifrost: nodeBifrost,
  rococoBitCountry: nodeBitCountry,
  rococoCanvas: chainRococoCanvas,
  rococoChainX: nodeChainx,
  rococoClover: nodeClover,
  rococoCrab: nodeCrab,
  rococoCrust: nodeCrust,
  rococoDarwinia: nodeDarwinia,
  rococoDataHighway: nodeDataHighway,
  rococoEave: nodeEave,
  rococoEncointer: nodeEncointer,
  rococoGalital: nodeGalital,
  rococoGenshiro: chainGenshiro,
  rococoHydrate: chainHydrate,
  rococoIdavoll: nodeIdavoll,
  rococoInterBTC: chainInterlay,
  rococoJupiter: nodeJupiter,
  rococoKilt: nodeKilt,
  rococoKonomi: nodeKonomi,
  rococoKylin: nodeKylin,
  rococoLaminar: nodeLaminar,
  rococoLitentry: nodeLitmus,
  rococoLoomNetwork: nodeLoomNetwork,
  rococoManta: nodeManta,
  rococoMathChain: nodeMath,
  rococoMoonrock: nodeMoonrock,
  rococoOriginTrail: nodeOriginTrail,
  rococoParami: nodeParami,
  rococoPhala: nodePhala,
  rococoPhoenix: nodePhoenix,
  rococoPlasm: nodePlasm,
  rococoPolkaFoundry: nodePolkaFoundry,
  rococoPrism: nodePrism,
  rococoSingLavender: nodeSingLavender,
  rococoStandard: chainStandard,
  rococoStatemint: nodeStatemine,
  rococoSubDAO: nodeSubDAO,
  rococoSubsocial: nodeSubsocial,
  rococoTick: chainRococoTick,
  rococoTrack: chainRococoTrack,
  rococoTrick: chainRococoTrick,
  rococoTrustBase: nodeTrustBase,
  rococoUnitv: nodeUnitv,
  rococoVln: nodeVln,
  rococoZeitgeist: nodeZeitgeist,
  rococoZenlink: nodeZenlink,
  sakura: nodeSakura,
  shadow: nodeShadow,
  shell: nodeShell,
  sherpax: nodeSherpax,
  shibuya: chainShiden,
  shiden: chainShiden,
  singLavender: nodeSingLavender,
  snakenet: chainSnakenet,
  sora: nodeSora,
  'sora-substrate': nodeSora,
  sora_ksm: nodeSora,
  spanner: chainSpanner,
  stafi: nodeStafi,
  statemine: nodeStatemine,
  statemint: nodeStatemine,
  subdao: nodeSubDAO,
  'SubDAO PC1': nodeSubDAO,
  'SubDAO Staging': nodeSubDAO,
  subgame: nodeSubGame,
  'SubGame Gamma': nodeSubGame,
  'SubGame Staging': nodeSubGame,
  subsocial: nodeSubsocial,
  subspace: nodeSubspace,
  'subspace-farmnet': nodeSubspace,
  substrate: nodeSubstrate,
  substrateContractsNode: nodeSubstrateContractsNode,
  'ternoa-testnet': nodeTernoa,
  trustbase: nodeTrustBase,
  uniarts: nodeUniarts,
  unique: nodeUnique,
  unitv: nodeUnitv,
  unorthodox: chainUnorthodox,
  vln: nodeVln,
  web3games: nodeWeb3games,
  westend: nodeWestend,
  westendPichiu: nodePichiu,
  westendStandard: chainStandard,
  westlake: nodeWestlake,
  westmint: nodeStatemine,
  whala: nodeWhala,
  zCloak: nodeZCloak,
  zeitgeist: nodeZeitgeist,
  zero: nodeZero
};

// extension logos
export const extensionLogos: Record<string, unknown> = {
  'polkadot-js': extensionPolkadotJs
};

// external logos, i.e. for explorers
export const externalLogos: Record<string, unknown> = {
  commonwealth: externalCommonwealth,
  dotreasury: externalDotreasury,
  dotscanner: externalDotScanner,
  polkascan: externalPolkascan,
  polkassembly: externalPolkassembly,
  polkastats: externalPolkastats,
  singular: externalSingular,
  statescan: externalStatescan,
  subid: externalSubId,
  subscan: externalSubscan,
  subsquare: externalSubsquare
};

// empty logos
export const emptyLogos: Record<string, unknown> = {
  empty: emptyLogo
};

// preload all
[chainLogos, extensionLogos, externalLogos, namedLogos, nodeLogos, emptyLogos].forEach((imageSet): void => {
  Object.values(imageSet).forEach((src): void => {
    new Image().src = src as string;
  });
});
