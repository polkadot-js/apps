// Copyright 2017-2020 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

// The mapping here is done on the actual chain name (system.chain RPC) or
// the actual RPC node it is corrected to (system.name RPC)

// anything for a specific chain, most would probably fit into the node category (but allow for chain-specific)
// alphabetical
import chainDusty from './chains/dusty.png';
import chainKusama from './chains/kusama-128.gif';
import chainRococo from './chains/rococo.svg';
import chainRococoTick from './chains/rococo-tick.svg';
import chainRococoTrack from './chains/rococo-track.svg';
import chainRococoTrick from './chains/rococo-trick.svg';
// extensions
// alphabetical
import extensionPolkadotJs from './extensions/polkadot-js.svg';
// external links
// alphabetical
import externalCommonwealth from './external/commonwealth.png';
import externalPolkascan from './external/polkascan.png';
import externalPolkassembly from './external/polkassembly.png';
import externalPolkastats from './external/polkastats.png';
import externalSubscan from './external/subscan.svg';
// defaults for the node type, assuming we don't have a specific chain, but rather match on the implementation
// alphabetical
import nodeAcala from './nodes/acala-circle.svg';
import nodeBifrost from './nodes/bifrost.svg';
import nodeCanvas from './nodes/canvas-2.png';
import nodeCentrifuge from './nodes/centrifuge.png';
import nodeCrab from './nodes/crab.svg';
import nodeCrust from './nodes/crust.svg';
import nodeDarwinia from './nodes/darwinia.png';
import nodeDockMainnet from './nodes/dock-mainnet.png';
import nodeDockTestnet from './nodes/dock-testnet.png';
import nodeEdgeware from './nodes/edgeware-circle.svg';
import nodeEncointerNotee from './nodes/encointer-notee.svg';
import nodeEncointerTeeproxy from './nodes/encointer-teeproxy.svg';
import nodeEquilibrium from './nodes/equilibrium.svg';
import nodeHanonycash from './nodes/hanonycash.svg';
import nodeKilt from './nodes/kilt.svg';
import nodeKulupu from './nodes/kulupu.svg';
import nodeLaminar from './nodes/laminar-circle.svg';
import nodeMath from './nodes/math.svg';
import moonbeam from './nodes/moonbeam.png';
import nodeNodle from './nodes/nodle.svg';
import nodePhala from './nodes/phala.svg';
import nodePlasm from './nodes/plasm.png';
import nodePolkadot from './nodes/polkadot-circle.svg';
import nodePolkadotJs from './nodes/polkadot-js.svg';
import nodeRobonomics from './nodes/robonomics.svg';
import nodeSora from './nodes/sora-substrate.svg';
import nodeStafi from './nodes/stafi.png';
import nodeSubsocial from './nodes/subsocial.svg';
import nodeSubstrate from './nodes/substrate-hexagon.svg';
import nodeZero from './nodes/zero.svg';
// last-resort fallback, just something empty
import emptyLogo from './empty.svg';

// Alphabetical overrides based on the actual matched chain name
// NOTE: This is as retrieved via system.chain RPC
export const chainLogos: Record<string, unknown> = [
  ['darwinia crab', nodeCrab],
  ['Dusty', chainDusty],
  ['Galois', nodeMath],
  ['Kusama', chainKusama], // new name after CC3
  ['Kusama CC1', chainKusama],
  ['Kusama CC2', chainKusama],
  ['Kusama CC3', chainKusama],
  ['Moonbase Alpha', moonbeam],
  ['Rococo', chainRococo],
  ['Tick', chainRococoTick],
  ['Track', chainRococoTrack],
  ['Trick', chainRococoTrick]
].reduce((logos, [chain, logo]): Record<string, unknown> => ({
  ...logos,
  [(chain as string).toLowerCase()]: logo
}), {});

// Alphabetical overrides based on the actual software node type
// NOTE: This is as retrieved via system.name RPC
export const nodeLogos: Record<string, unknown> = [
  ['airalab-robonomics', nodeRobonomics],
  ['Bifrost Node', nodeBifrost],
  ['Bifrost', nodeBifrost],
  ['Canvas Node', nodeCanvas],
  ['centrifuge chain', nodeCentrifuge],
  ['Centrifuge Chain Node', nodeCentrifuge],
  ['darwinia crab', nodeCrab],
  ['crust', nodeCrust],
  ['darwinia', nodeDarwinia],
  ['darwinia parachain', nodeDarwinia],
  ['Dock Full Node', nodeDockMainnet],
  ['Edgeware Node', nodeEdgeware],
  ['Encointer Node', nodeEncointerNotee],
  ['Encointer Node noTEE', nodeEncointerNotee],
  ['Encointer Node TEE proxy', nodeEncointerTeeproxy],
  ['Galois', nodeMath],
  ['hanonycash', nodeHanonycash],
  ['KILT Node', nodeKilt],
  ['kulupu', nodeKulupu],
  ['node-template', nodeSubstrate],
  ['Nodle Chain Node', nodeNodle],
  ['parity-polkadot', nodePolkadot],
  ['Plasm', nodePlasm],
  ['Plasm Node', nodePlasm],
  ['phala-substrate-node', nodePhala],
  ['polkadot-js', nodePolkadotJs],
  ['SORA-Substrate Node', nodeSora],
  ['Stafi Node', nodeStafi],
  ['Stafi', nodeStafi],
  ['subsocial-node', nodeSubsocial],
  ['substrate-node', nodeSubstrate],
  ['Equilibrium Node', nodeEquilibrium],
  ['Equilibrium', nodeEquilibrium],
  ['SUBZΞRO', nodeZero]
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
  canvas: nodeCanvas,
  centrifuge: nodeCentrifuge,
  crab: nodeCrab,
  crust: nodeCrust,
  darwinia: nodeDarwinia,
  'dock-mainnet': nodeDockMainnet,
  'dock-testnet': nodeDockTestnet,
  dusty: chainDusty,
  edgeware: nodeEdgeware,
  empty: emptyLogo,
  equilibrium: nodeEquilibrium,
  galois: nodeMath,
  hanonycash: nodeHanonycash,
  kilt: nodeKilt,
  kulupu: nodeKulupu,
  kusama: chainKusama,
  laminar: nodeLaminar,
  moonbaseAlpha: moonbeam,
  nodle: nodeNodle,
  phala: nodePhala,
  plasm: nodePlasm,
  polkadot: nodePolkadot,
  rococo: chainRococo,
  rococoAcala: nodeAcala,
  rococoDarwinia: nodeDarwinia,
  rococoLaminar: nodeLaminar,
  rococoPlasm: nodePlasm,
  rococoRobonomics: nodeRobonomics,
  rococoTick: chainRococoTick,
  rococoTrack: chainRococoTrack,
  rococoTrick: chainRococoTrick,
  'sora-substrate': nodeSora,
  stafi: nodeStafi,
  subsocial: nodeSubsocial,
  substrate: nodeSubstrate,
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
