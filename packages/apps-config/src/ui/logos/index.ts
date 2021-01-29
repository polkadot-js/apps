// Copyright 2017-2021 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

// The mapping here is done on the actual chain name (system.chain RPC) or
// the actual RPC node it is corrected to (system.name RPC)

// anything for a specific chain, most would probably fit into the node category (but allow for chain-specific)
// alphabetical
import chainDusty from './chains/dusty.png';
import chainHydrate from './chains/hydrate.png';
import chainKusama from './chains/kusama-128.gif';
import chainRococo from './chains/rococo.svg';
import chainRococoTick from './chains/rococo-tick.svg';
import chainRococoTrack from './chains/rococo-track.svg';
import chainRococoTrick from './chains/rococo-trick.svg';
import extensionPolkadotJs from './extensions/polkadot-js.svg';
import externalCommonwealth from './external/commonwealth.png';
import externalPolkascan from './external/polkascan.png';
import externalPolkassembly from './external/polkassembly.png';
import externalPolkastats from './external/polkastats.png';
import externalSubscan from './external/subscan.svg';
import nodeAcala from './nodes/acala-circle.svg';
import nodeBifrost from './nodes/bifrost.svg';
import nodeBitCountry from './nodes/bitcountry.svg';
import nodeCanvas from './nodes/canvas-2.png';
import nodeCentrifuge from './nodes/centrifuge.png';
import nodeCrab from './nodes/crab.svg';
import nodeCrust from './nodes/crust.svg';
import nodeDarwinia from './nodes/darwinia.png';
import nodeDataHighway from './nodes/datahighway.png';
import nodeDockMainnet from './nodes/dock-mainnet.png';
import nodeDockTestnet from './nodes/dock-testnet.png';
import nodeEdgeware from './nodes/edgeware-circle.svg';
import nodeEncointerNotee from './nodes/encointer-notee.svg';
import nodeEncointerTeeproxy from './nodes/encointer-teeproxy.svg';
import nodeEquilibrium from './nodes/equilibrium.svg';
import nodeHanonycash from './nodes/hanonycash.svg';
import nodeJupiter from './nodes/jupiter.svg';
import nodeKilt from './nodes/kilt.svg';
import nodeKulupu from './nodes/kulupu.svg';
import nodeLaminar from './nodes/laminar-circle.svg';
import nodeMath from './nodes/math.svg';
import moonbeam from './nodes/moonbeam.png';
import nodeNodle from './nodes/nodle.svg';
import nodePhala from './nodes/phala.svg';
import nodePlasm from './nodes/plasm.png';
import nodePolkaBTC from './nodes/polkabtc.png';
import nodePolkadex from './nodes/polkadex.svg';
import nodePolkadot from './nodes/polkadot-circle.svg';
import nodePolkadotJs from './nodes/polkadot-js.svg';
import nodeRobonomics from './nodes/robonomics.svg';
import nodeSora from './nodes/sora-substrate.svg';
import nodeStafi from './nodes/stafi.png';
import nodeSubsocial from './nodes/subsocial.svg';
import nodeSubstrate from './nodes/substrate-hexagon.svg';
import nodeUniarts from './nodes/uniarts.png';
import nodeZero from './nodes/zero.svg';
// last-resort fallback, just something empty
import emptyLogo from './empty.svg';

// Alphabetical overrides based on the actual matched chain name
// NOTE: This is as retrieved via system.chain RPC
export const chainLogos: Record<string, unknown> = [
  ['Crust PC1', nodeCrust],
  ['darwinia crab', nodeCrab],
  ['Darwinia PC2', nodeDarwinia],
  ['DataHighway', nodeDataHighway],
  ['Dusty', chainDusty],
  ['Galois', nodeMath],
  ['HydraDX Hydrate', chainHydrate],
  ['Encointer PC1', nodeEncointerNotee],
  ['KILT PC1', nodeKilt],
  ['Kusama', chainKusama], // new name after CC3
  ['Kusama CC1', chainKusama],
  ['Kusama CC2', chainKusama],
  ['Kusama CC3', chainKusama],
  ['Moonbase Alpha', moonbeam],
  ['PolkaBTC', nodePolkaBTC],
  ['Polkadex Testnet', nodePolkadex],
  ['Phala PC1', nodePhala],
  ['Rococo', chainRococo],
  ['Tick', chainRococoTick],
  ['Track', chainRococoTrack],
  ['Trick', chainRococoTrick],
  ['Uniarts', nodeUniarts]
].reduce((logos, [chain, logo]): Record<string, unknown> => ({
  ...logos,
  [(chain as string).toLowerCase()]: logo
}), {});

// Alphabetical overrides based on the actual software node type
// NOTE: This is as retrieved via system.name RPC
export const nodeLogos: Record<string, unknown> = [
  ['Acala Node', nodeAcala],
  ['mandala node', nodeAcala],
  ['airalab-robonomics', nodeRobonomics],
  ['Bifrost Node', nodeBifrost],
  ['Bifrost', nodeBifrost],
  ['BitCountry Node', nodeBitCountry],
  ['Bit.Country', nodeBitCountry],
  ['Canvas Node', nodeCanvas],
  ['centrifuge chain', nodeCentrifuge],
  ['Centrifuge Chain Node', nodeCentrifuge],
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
  ['Edgeware Node', nodeEdgeware],
  ['Encointer Node', nodeEncointerNotee],
  ['Encointer Node noTEE', nodeEncointerNotee],
  ['Encointer Node TEE proxy', nodeEncointerTeeproxy],
  ['Galois', nodeMath],
  ['hanonycash', nodeHanonycash],
  ['Jupiter Node', nodeJupiter],
  ['KILT Node', nodeKilt],
  ['KILT Collator', nodeKilt],
  ['kulupu', nodeKulupu],
  ['Laminar Node', nodeLaminar],
  ['node-template', nodeSubstrate],
  ['Nodle Chain Node', nodeNodle],
  ['Polkadex Node', nodePolkadex],
  ['parity-polkadot', nodePolkadot],
  ['Plasm', nodePlasm],
  ['Plasm Node', nodePlasm],
  ['Plasm Parachain Collator', nodePlasm],
  ['phala-substrate-node', nodePhala],
  ['Phala Collator', nodePhala],
  ['polkadot-js', nodePolkadotJs],
  ['SORA-staging Node', nodeSora],
  ['Stafi Node', nodeStafi],
  ['Stafi', nodeStafi],
  ['subsocial-node', nodeSubsocial],
  ['substrate-node', nodeSubstrate],
  ['Equilibrium Node', nodeEquilibrium],
  ['Equilibrium', nodeEquilibrium],
  ['SUBZΞRO', nodeZero],
  ['Uniarts', nodeUniarts]
].reduce((logos, [node, logo]): Record<string, unknown> => ({
  ...logos,
  [(node as string).toLowerCase().replace(/-/g, ' ')]: logo
}), {});

// Alphabetical overrides when we pass an explicit logo name
// NOTE: Matches with what is defined as "info" in settings/endpoints.ts
// (Generally would be the 'network' key in the known ss58 as per
// https://github.com/polkadot-js/common/blob/master/packages/networks/src/index.ts)
export const namedLogos: Record<string, unknown> = {
  acala: nodeAcala,
  alexander: nodePolkadot,
  bifrost: nodeBifrost,
  bitcountry: nodeBitCountry,
  canvas: nodeCanvas,
  centrifuge: nodeCentrifuge,
  crab: nodeCrab,
  crust: nodeCrust,
  darwinia: nodeDarwinia,
  datahighway: nodeDataHighway,
  'dock-mainnet': nodeDockMainnet,
  'dock-testnet': nodeDockTestnet,
  dusty: chainDusty,
  edgeware: nodeEdgeware,
  empty: emptyLogo,
  encointer_cantillon: nodeEncointerTeeproxy,
  encointer_gesell: nodeEncointerNotee,
  equilibrium: nodeEquilibrium,
  galois: nodeMath,
  hanonycash: nodeHanonycash,
  jupiter: nodeJupiter,
  kilt: nodeKilt,
  kulupu: nodeKulupu,
  kusama: chainKusama,
  laminar: nodeLaminar,
  moonbaseAlpha: moonbeam,
  nodle: nodeNodle,
  phala: nodePhala,
  plasm: nodePlasm,
  polkabtc: nodePolkaBTC,
  polkadex: nodePolkadex,
  polkadot: nodePolkadot,
  rococo: chainRococo,
  rococoAcala: nodeAcala,
  rococoBifrost: nodeBifrost,
  rococoCrust: nodeCrust,
  rococoDarwinia: nodeDarwinia,
  rococoDataHighway: nodeDataHighway,
  rococoEncointer: nodeEncointerNotee,
  rococoHydrate: chainHydrate,
  rococoKilt: nodeKilt,
  rococoLaminar: nodeLaminar,
  rococoPhala: nodePhala,
  rococoPlasm: nodePlasm,
  rococoRobonomics: nodeRobonomics,
  rococoTick: chainRococoTick,
  rococoTrack: chainRococoTrack,
  rococoTrick: chainRococoTrick,
  'sora-substrate': nodeSora,
  stafi: nodeStafi,
  subsocial: nodeSubsocial,
  substrate: nodeSubstrate,
  uniarts: nodeUniarts,
  westend: nodePolkadot,
  zero: nodeZero
};

// extension logos
export const extensionLogos: Record<string, unknown> = {
  'polkadot-js': extensionPolkadotJs
};

// external logos, i.e. for explorers
export const externalLogos: Record<string, unknown> = {
  commonwealth: externalCommonwealth,
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
