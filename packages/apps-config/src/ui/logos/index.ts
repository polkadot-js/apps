// Copyright 2017-2021 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

// The mapping here is done on the actual chain name (system.chain RPC) or
// the actual RPC node it is corrected to (system.name RPC)

// anything for a specific chain, most would probably fit into the node category (but allow for chain-specific)
// alphabetical
import chainDusty from './chains/dusty.png';
import chainHydrate from './chains/hydrate.png';
import chainKusama from './chains/kusama-128.gif';
import chainPolkaBTC from './chains/polkabtc.png';
import chainRococo from './chains/rococo.svg';
import chainRococoTick from './chains/rococo-tick.svg';
import chainRococoTrack from './chains/rococo-track.svg';
import chainRococoTrick from './chains/rococo-trick.svg';
import chainSnakenet from './chains/snakenet.svg';
import chainUnique from './chains/unique.svg';
import extensionPolkadotJs from './extensions/polkadot-js.svg';
import externalCommonwealth from './external/commonwealth.png';
import externalDotScanner from './external/dotscanner.png';
import externalPolkascan from './external/polkascan.png';
import externalPolkassembly from './external/polkassembly.png';
import externalPolkastats from './external/polkastats.png';
import externalSubscan from './external/subscan.svg';
import nodeAcala from './nodes/acala-circle.svg';
import nodeApron from './nodes/apron.png';
import nodeAres from './nodes/ares.svg';
import nodeBeast from './nodes/beast.svg';
import nodeBifrost from './nodes/bifrost.svg';
import nodeBitCountry from './nodes/bitcountry.svg';
import nodeCanvas from './nodes/canvas-2.png';
import nodeCentrifuge from './nodes/centrifuge.png';
import nodeChainx from './nodes/chainx.svg';
import nodeClover from './nodes/clover.svg';
import nodeCrab from './nodes/crab.svg';
import nodeCrust from './nodes/crust.svg';
import nodeDarwinia from './nodes/darwinia.png';
import nodeDataHighway from './nodes/datahighway.png';
import nodeDockMainnet from './nodes/dock-mainnet.png';
import nodeDockTestnet from './nodes/dock-testnet.png';
import nodeDotMog from './nodes/dotmog.svg';
import nodeEave from './nodes/eave.svg';
import nodeEdgeware from './nodes/edgeware-circle.svg';
import nodeEncointerNotee from './nodes/encointer-notee.svg';
import nodeEncointerTeeproxy from './nodes/encointer-teeproxy.svg';
import nodeEquilibrium from './nodes/equilibrium.svg';
import nodeGalital from './nodes/galital-logo.png';
import nodeGamePower from './nodes/gamepower.svg';
import nodeGeek from './nodes/geek.svg';
import nodeHanonycash from './nodes/hanonycash.svg';
import nodeIdavoll from './nodes/idavoll.png';
import nodeIntegritee from './nodes/integritee.png';
import nodeIpse from './nodes/ipse.png';
import nodeJupiter from './nodes/jupiter.svg';
import nodeKhala from './nodes/khala.svg';
import nodeKilt from './nodes/kilt.svg';
import nodeKonomi from './nodes/konomi.png';
import nodeKulupu from './nodes/kulupu.svg';
import nodeKylin from './nodes/kylin.png';
import nodeLaminar from './nodes/laminar-circle.svg';
import nodeLitentry from './nodes/litentry.png';
import nodeManta from './nodes/manta.png';
import nodeMath from './nodes/math.svg';
import moonbeam from './nodes/moonbeam.png';
import nodeMoonrock from './nodes/moonrock.png';
import moonshadow from './nodes/moonshadow.png';
import mybank from './nodes/mybank.png';
import nodeNFTMart from './nodes/nftmart.png';
import nodeNodle from './nodes/nodle.svg';
import nodePangolin from './nodes/pangolin.svg';
import nodeParami from './nodes/parami.png';
import nodePhala from './nodes/phala.svg';
import nodePhoenix from './nodes/phoenix.png';
import nodePlasm from './nodes/plasm.png';
import nodePolkaBTC from './nodes/polkabtc.png';
import nodePolkadex from './nodes/polkadex.svg';
import nodePolkadot from './nodes/polkadot-circle.svg';
import nodePolkadotJs from './nodes/polkadot-js.svg';
import nodePolkaFoundry from './nodes/polkafoundry.svg';
import nodePolymesh from './nodes/polymesh.svg';
import nodePrism from './nodes/prism.png';
import nodeRealis from './nodes/realis.png';
import nodeRiochain from './nodes/riochain.svg';
import nodeRobonomics from './nodes/robonomics.svg';
import nodeShadow from './nodes/shadow.svg';
import nodeShell from './nodes/shell.svg';
import nodeSora from './nodes/sora-substrate.svg';
import nodeStafi from './nodes/stafi.png';
import nodeStatemine from './nodes/statemine.svg';
import nodeStatemint from './nodes/statemint-3.png';
import nodeSubDAO from './nodes/subdao.png';
import nodeSubsocial from './nodes/subsocial.svg';
import nodeSubstrate from './nodes/substrate-hexagon.svg';
import nodeTernoa from './nodes/ternoa.svg';
import nodeTrustBase from './nodes/trustbase.png';
import nodeUniarts from './nodes/uniarts.png';
import nodeUnique from './nodes/unique.svg';
import nodeUnitv from './nodes/unitv.png';
import nodeVln from './nodes/valiu.png';
import nodeWeb3games from './nodes/web3games.svg';
import nodeWestlake from './nodes/westlake.png';
import nodeZeitgeist from './nodes/zeitgeist.png';
import nodeZenlink from './nodes/zenlink.svg';
import nodeZero from './nodes/zero.svg';
// last-resort fallback, just something empty
import emptyLogo from './empty.svg';

// Alphabetical overrides based on the actual matched chain name
// NOTE: This is as retrieved via system.chain RPC
export const chainLogos: Record<string, unknown> = [
  ['Apron PC1', nodeApron],
  ['Ares PC1', nodeAres],
  ['Beast Developer', nodeBeast],
  ['Crust PC1', nodeCrust],
  ['ChainX', nodeChainx],
  ['darwinia crab', nodeCrab],
  ['Darwinia Crab PC2', nodeCrab],
  ['Darwinia PC2', nodeDarwinia],
  ['DataHighway', nodeDataHighway],
  ['Dusty', chainDusty],
  ['Steam PC', nodeEave],
  ['Galital', nodeGalital],
  ['Galois', nodeMath],
  ['GamePower Network', nodeGamePower],
  ['GEEK', nodeGeek],
  ['HydraDX Hydrate', chainHydrate],
  ['HydraDX Snakenet', chainSnakenet],
  ['HydraDX Snakenet Gen2', chainSnakenet],
  ['HydraDX Snakenet Gen3', chainSnakenet],
  ['Encointer Canary', nodeEncointerNotee],
  ['Encointer PC1', nodeEncointerNotee],
  ['Idavoll', nodeIdavoll],
  ['IntegriTEE Network', nodeIntegritee],
  ['IntegriTEE PC1', nodeIntegritee],
  ['IpseTestnet', nodeIpse],
  ['Jupiter A1', nodeJupiter],
  ['Jupiter PC1', nodeJupiter],
  ['KILT PC1', nodeKilt],
  ['Konomi', nodeKonomi],
  ['Kusama', chainKusama], // new name after CC3
  ['Kusama CC1', chainKusama],
  ['Kusama CC2', chainKusama],
  ['Kusama CC3', chainKusama],
  ['Kylin Testnet', nodeKylin],
  ['Litentry', nodeLitentry],
  ['Manta Testnet', nodeManta],
  ['MathChain PC1', nodeMath],
  ['Moonbase Alpha', moonbeam],
  ['Moonbase Stage', moonbeam],
  ['Moonbase Development Testnet', moonbeam],
  ['Moonrock', nodeMoonrock],
  ['Moonshadow', moonshadow],
  ['mybank.network PC1', mybank],
  ['NFTMart Testnet', nodeNFTMart],
  ['NFTMart Staging', nodeNFTMart],
  ['Pangolin', nodePangolin],
  ['Parami PC2', nodeParami],
  ['PHOENIX PC1', nodePhoenix],
  ['PolkaBTC', nodePolkaBTC],
  ['PolkaBTC Staging', nodePolkaBTC],
  ['Polkadex Testnet', nodePolkadex],
  ['PolkaFoundry PC1', nodePolkaFoundry],
  ['Prism Testnet', nodePrism],
  ['Prism PC1', nodePrism],
  ['Phala PC1', nodePhala],
  ['ReAlis Network', nodeRealis],
  ['Rococo', chainRococo],
  ['RioChain CC-1', nodeRiochain],
  ['RioChain Staging', nodeRiochain],
  ['Statemine', nodeStatemine],
  ['Statemint', nodeStatemint],
  ['Statemint Test', nodeStatemint],
  ['SubDAO PC1', nodeSubDAO],
  ['Subsocial', nodeSubsocial],
  ['Subsocial PC', nodeSubsocial],
  ['Tick', chainRococoTick],
  ['Track', chainRococoTrack],
  ['Trick', chainRococoTrick],
  ['TrustBase PC1', nodeTrustBase],
  ['uni arts staging network', nodeUniarts],
  ['UniArts Mainnet', nodeUniarts],
  ['Unique', chainUnique],
  ['Unit Network', nodeUnitv],
  ['VLN PC', nodeVln],
  ['Vln', nodeVln],
  ['Web3games', nodeWeb3games],
  ['Westlake', nodeWestlake]
].reduce((logos, [chain, logo]): Record<string, unknown> => ({
  ...logos,
  [(chain as string).toLowerCase()]: logo
}), {});

// Alphabetical overrides based on the actual software node type
// NOTE: This is as retrieved via system.name RPC
export const nodeLogos: Record<string, unknown> = [
  ['Acala Node', nodeAcala],
  ['Apron Node', nodeApron],
  ['Apron Parachain Collator', nodeApron],
  ['Ares Node', nodeAres],
  ['Ares Parachain Collator', nodeAres],
  ['airalab-robonomics', nodeRobonomics],
  ['Beast Node', nodeBeast],
  ['Bifrost Node', nodeBifrost],
  ['Bifrost', nodeBifrost],
  ['BitCountry Node', nodeBitCountry],
  ['Bit.Country', nodeBitCountry],
  ['Bit Country Tewai Parachain Collator', nodeBitCountry],
  ['Canvas Node', nodeCanvas],
  ['centrifuge chain', nodeCentrifuge],
  ['Centrifuge Chain Node', nodeCentrifuge],
  ['ChainX Node', nodeChainx],
  ['Clover Node', nodeClover],
  ['darwinia crab', nodeCrab],
  ['crust', nodeCrust],
  ['Crust Collator', nodeCrust],
  ['darwinia', nodeDarwinia],
  ['darwinia parachain', nodeDarwinia],
  ['Darwinia Runtime Module Library', nodeDarwinia],
  ['DataHighway', nodeDataHighway],
  ['DataHighway Node', nodeDataHighway],
  ['DataHighway Parachain Collator', nodeDataHighway],
  ['Dock Full Node', nodeDockMainnet],
  ['DOTMog Node', nodeDotMog],
  ['Eave Node', nodeEave],
  ['Edgeware Node', nodeEdgeware],
  ['Equilibrium Node', nodeEquilibrium],
  ['Equilibrium', nodeEquilibrium],
  ['IpseTestnet', nodeIpse],
  ['Encointer Node', nodeEncointerNotee],
  ['Encointer Node noTEE', nodeEncointerNotee],
  ['Encointer Node TEE proxy', nodeEncointerTeeproxy],
  ['Galital Parachain Collator', nodeGalital],
  ['Galois', nodeMath],
  ['GamePower Node', nodeGamePower],
  ['GEEK', nodeGeek],
  ['hanonycash', nodeHanonycash],
  ['Idavoll Node', nodeIdavoll],
  ['Khala', nodeKhala],
  ['Khala Node', nodeKhala],
  ['KILT Node', nodeKilt],
  ['KILT Collator', nodeKilt],
  ['Kylin Node', nodeKylin],
  ['kulupu', nodeKulupu],
  ['Laminar Node', nodeLaminar],
  ['Litentry', nodeLitentry],
  ['Litentry Collator', nodeLitentry],
  ['mandala node', nodeAcala],
  ['Manta Node', nodeManta],
  ['Manta Node', nodeManta],
  ['Manta Parachain Collator', nodeManta],
  ['Moonrock', nodeMoonrock],
  ['mybank.network', mybank],
  ['NFTMart Testnet', nodeNFTMart],
  ['NFTMart Staging', nodeNFTMart],
  ['node-template', nodeSubstrate],
  ['Nodle Chain Node', nodeNodle],
  ['Pangolin', nodePangolin],
  ['Patract Node', nodeJupiter],
  ['Polkadex Node', nodePolkadex],
  ['Prism Node', nodePrism],
  ['Prism Collator', nodePrism],
  ['parity-polkadot', nodePolkadot],
  ['Parami', nodeParami],
  ['Plasm', nodePlasm],
  ['Plasm Node', nodePlasm],
  ['Plasm Parachain Collator', nodePlasm],
  ['phala-substrate-node', nodePhala],
  ['Phala Collator', nodePhala],
  ['PHOENIX Node', nodePhoenix],
  ['PHOENIX Collator', nodePhoenix],
  ['polkadot-js', nodePolkadotJs],
  ['PolkaFoundry Node', nodePolkaFoundry],
  ['PolkaFoundry Parachain Collator', nodePolkaFoundry],
  ['ReAlis Network', nodeRealis],
  ['Rio Defi Chain Node', nodeRiochain],
  ['RioChain Staging', nodeRiochain],
  ['Shadow', nodeShadow],
  ['SORA', nodeSora],
  ['Stafi Node', nodeStafi],
  ['Stafi', nodeStafi],
  ['Statemint Collator', nodeStatemint],
  ['SubDAO Collator', nodeSubDAO],
  ['subsocial-node', nodeSubsocial],
  ['Subsocial Node', nodeSubsocial],
  ['Subsocial PC', nodeSubsocial],
  ['sherpax', nodeChainx],
  ['substrate-node', nodeSubstrate],
  ['subzero node', nodeZero],
  ['Ternoa Node', nodeTernoa],
  ['TrustBase Node', nodeTrustBase],
  ['TrustBase Collator', nodeTrustBase],
  ['uni arts node', nodeUniarts],
  ['UniArts Node', nodeUniarts],
  ['Unit Node', nodeUnitv],
  ['Unit Collator', nodeUnitv],
  ['Unique Node', nodeUnique],
  ['Vln', nodeVln],
  ['VLN PC', nodeVln],
  ['Web3games', nodeWeb3games],
  ['Westlake', nodeWestlake],
  ['Zenlink', nodeZenlink],
  ['Zenlink Collator', nodeZenlink],
  ['Zeitgeist Node', nodeZeitgeist],
  ['Zeitgeist Collator', nodeZeitgeist]
].reduce((logos, [node, logo]): Record<string, unknown> => ({
  ...logos,
  [(node as string).toLowerCase().replace(/-/g, ' ')]: logo
}), {});

// Alphabetical overrides based on the actual specName
export const specLogos: Record<string, unknown> = [
  ['shell', nodeShell],
  ['statemine', nodeStatemine],
  ['statemint', nodeStatemint]
].reduce((logos, [spec, logo]): Record<string, unknown> => ({
  ...logos,
  [(spec as string).toLowerCase().replace(/-/g, ' ')]: logo
}), {});

// Alphabetical overrides when we pass an explicit logo name
// NOTE: Matches with what is defined as "info" in settings/endpoints.ts
// (Generally would be the 'network' key in the known ss58 as per
// https://github.com/polkadot-js/common/blob/master/packages/networks/src/index.ts)
export const namedLogos: Record<string, unknown> = {
  acala: nodeAcala,
  alexander: nodePolkadot,
  beast: nodeBeast,
  bifrost: nodeBifrost,
  bitcountry: nodeBitCountry,
  canvas: nodeCanvas,
  centrifuge: nodeCentrifuge,
  chainx: nodeChainx,
  clover: nodeClover,
  crab: nodeCrab,
  crust: nodeCrust,
  darwinia: nodeDarwinia,
  datahighway: nodeDataHighway,
  'dock-mainnet': nodeDockMainnet,
  'dock-testnet': nodeDockTestnet,
  dotmog: nodeDotMog,
  dusty: chainDusty,
  eave: nodeEave,
  edgeware: nodeEdgeware,
  empty: emptyLogo,
  encointer_canary: nodeEncointerNotee,
  encointer_cantillon: nodeEncointerTeeproxy,
  encointer_gesell: nodeEncointerNotee,
  equilibrium: nodeEquilibrium,
  galital: nodeGalital,
  galois: nodeMath,
  gamepower: nodeGamePower,
  geek: nodeGeek,
  halongbay: nodePolkaFoundry,
  hanonycash: nodeHanonycash,
  idavoll: nodeIdavoll,
  integritee: nodeIntegritee,
  ipse: nodeIpse,
  jupiter: nodeJupiter,
  khala: nodeKhala,
  kilt: nodeKilt,
  kulupu: nodeKulupu,
  kusama: chainKusama,
  kylin: nodeKylin,
  laminar: nodeLaminar,
  litentry: nodeLitentry,
  manta: nodeManta,
  moonbaseAlpha: moonbeam,
  moonrock: nodeMoonrock,
  moonshadow: moonshadow,
  mybank: mybank,
  nftmart: nodeNFTMart,
  nodle: nodeNodle,
  pangolin: nodePangolin,
  phala: nodePhala,
  phoenix: nodePhoenix,
  plasm: nodePlasm,
  polkabtc: nodePolkaBTC,
  polkadex: nodePolkadex,
  polkadot: nodePolkadot,
  polkafoundry: nodePolkaFoundry,
  polymesh: nodePolymesh,
  prism: nodePrism,
  realis: nodeRealis,
  riochain: nodeRiochain,
  rococo: chainRococo,
  rococoAcala: nodeAcala,
  rococoApron: nodeApron,
  rococoAres: nodeAres,
  rococoBifrost: nodeBifrost,
  rococoBitCountry: nodeBitCountry,
  rococoChainX: nodeChainx,
  rococoClover: nodeClover,
  rococoCrab: nodeCrab,
  rococoCrust: nodeCrust,
  rococoDarwinia: nodeDarwinia,
  rococoDataHighway: nodeDataHighway,
  rococoEave: nodeEave,
  rococoEncointer: nodeEncointerNotee,
  rococoEquilibrium: nodeEquilibrium,
  rococoGalital: nodeGalital,
  rococoHydrate: chainHydrate,
  rococoIdavoll: nodeIdavoll,
  rococoIntegritee: nodeIntegritee,
  rococoJupiter: nodeJupiter,
  rococoKilt: nodeKilt,
  rococoKonomi: nodeKonomi,
  rococoKylin: nodeKylin,
  rococoLaminar: nodeLaminar,
  rococoLitentry: nodeLitentry,
  rococoManta: nodeManta,
  rococoMathChain: nodeMath,
  rococoMoonrock: nodeMoonrock,
  rococoParami: nodeParami,
  rococoPhala: nodePhala,
  rococoPhoenix: nodePhoenix,
  rococoPlasm: nodePlasm,
  rococoPolkaFoundry: nodePolkaFoundry,
  rococoPolkabtc: chainPolkaBTC,
  rococoPrism: nodePrism,
  rococoRobonomics: nodeRobonomics,
  rococoStatemint: nodeStatemint,
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
  shadow: nodeShadow,
  shell: nodeShell,
  sherpax: nodeChainx,
  snakenet: chainSnakenet,
  'sora-substrate': nodeSora,
  stafi: nodeStafi,
  statemine: nodeStatemine,
  statemint: nodeStatemint,
  subsocial: nodeSubsocial,
  substrate: nodeSubstrate,
  'ternoa-chaos': nodeTernoa,
  uniarts: nodeUniarts,
  unique: nodeUnique,
  unitv: nodeUnitv,
  vln: nodeVln,
  web3games: nodeWeb3games,
  westend: nodePolkadot,
  westlake: nodeWestlake,
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
  dotscanner: externalDotScanner,
  polkascan: externalPolkascan,
  polkassembly: externalPolkassembly,
  polkastats: externalPolkastats,
  subscan: externalSubscan
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
