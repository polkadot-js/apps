// Copyright 2017-2020 @polkadot/apps-config authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

/* eslint-disable @typescript-eslint/no-unsafe-assignment */

// anything for a specific chain, most would probably fit into the node category (but allow for chain-specific)
// alphbetical
import chainDusty from './chains/dusty.png';
import chainKusama from './chains/kusama-128.gif';
import chainRococo from './chains/rococo.svg';
import chainRococoTick from './chains/rococo-tick.svg';
import chainRococoTrack from './chains/rococo-track.svg';
import chainRococoTrick from './chains/rococo-trick.svg';

// defaults for the node type, assuming we don't have a specific chain, but rather match on the implementation
// alphbetical
import nodeAcala from './nodes/acala-circle.svg';
import nodeCentrifuge from './nodes/centrifuge.png';
import nodeCrab from './nodes/crab.svg';
import nodeCrust from './nodes/crust.svg';
import nodeDarwinia from './nodes/darwinia.png';
import nodeEdgeware from './nodes/edgeware-circle.svg';
import nodeEncointerNotee from './nodes/encointer-notee.svg';
import nodeEncointerTeeproxy from './nodes/encointer-teeproxy.svg';
import nodeNodle from './nodes/nodle.svg';
import nodeKilt from './nodes/kilt.svg';
import nodeKulupu from './nodes/kulupu.svg';
import nodeLaminar from './nodes/laminar-circle.svg';
import nodePhala from './nodes/phala.svg';
import nodePlasm from './nodes/plasm.png';
import nodePolkadot from './nodes/polkadot-circle.svg';
import nodePolkadotJs from './nodes/polkadot-js.svg';
import nodeSubsocial from './nodes/subsocial.svg';
import nodeSubstrate from './nodes/substrate-hexagon.svg';

// extensions
// alphbetical
import extensionPolkadotJs from './extensions/polkadot-js.svg';

// external links
// alphbetical
import externalCommonwealth from './external/commonwealth.png';
import externalPolkascan from './external/polkascan.png';
import externalPolkassembly from './external/polkassembly.png';
import externalPolkastats from './external/polkastats.png';
import externalSubscan from './external/subscan.svg';

// last-resort fallback, just something empty
import emptyLogo from './empty.svg';

// overrides based on the actual matched chain name
// alphabetical
const chainLogos: Record<string, any> = [
  ['Dusty', chainDusty],
  ['Kusama', chainKusama], // new name after CC3
  ['Kusama CC1', chainKusama],
  ['Kusama CC2', chainKusama],
  ['Kusama CC3', chainKusama],
  ['Rococo', chainRococo],
  ['Tick', chainRococoTick],
  ['Track', chainRococoTrack],
  ['Trick', chainRococoTrick]
].reduce((logos, [chain, logo]): Record<string, any> => ({
  ...logos,
  [(chain as string).toLowerCase()]: logo
}), {});

// overrides based on the actual software node type (all '-' converted to ' ')
// alphabetical
const nodeLogos: Record<string, any> = [
  ['centrifuge chain', nodeCentrifuge],
  ['Centrifuge Chain Node', nodeCentrifuge],
  ['crab', nodeCrab],
  ['crust node', nodeCrust],
  ['darwinia parachain', nodeDarwinia],
  ['Edgeware Node', nodeEdgeware],
  ['Encointer Node', nodeEncointerNotee],
  ['Encointer Node noTEE', nodeEncointerNotee],
  ['Encointer Node TEE proxy', nodeEncointerTeeproxy],
  ['KILT Node', nodeKilt],
  ['kulupu', nodeKulupu],
  ['node-template', nodeSubstrate],
  ['Nodle Chain Node', nodeNodle],
  ['parity-polkadot', nodePolkadot],
  ['Plasm Node', nodePlasm],
  ['phala-substrate-node', nodePhala],
  ['polkadot-js', nodePolkadotJs],
  ['subsocial-node', nodeSubsocial],
  ['substrate-node', nodeSubstrate]
].reduce((logos, [node, logo]): Record<string, any> => ({
  ...logos,
  [(node as string).toLowerCase().replace(/-/g, ' ')]: logo
}), {});

// overrides when we pass an explicit logo name
// alphabetical
const namedLogos: Record<string, any> = {
  acala: nodeAcala,
  alexander: nodePolkadot,
  centrifuge: nodeCentrifuge,
  crab: nodeCrab,
  crust: nodeCrust,
  dusty: chainDusty,
  edgeware: nodeEdgeware,
  empty: emptyLogo,
  kilt: nodeKilt,
  kulupu: nodeKulupu,
  kusama: chainKusama,
  laminar: nodeLaminar,
  nodle: nodeNodle,
  phala: nodePhala,
  plasm: nodePlasm,
  polkadot: nodePolkadot,
  rococo: chainRococo,
  rococoAcala: nodeAcala,
  rococoDarwinia: nodeDarwinia,
  rococoLaminar: nodeLaminar,
  rococoPlasm: nodePlasm,
  rococoTick: chainRococoTick,
  rococoTrack: chainRococoTrack,
  rococoTrick: chainRococoTrick,
  subsocial: nodeSubsocial,
  substrate: nodeSubstrate,
  westend: nodePolkadot
};

// extension logos
const extensionLogos: Record<string, any> = {
  'polkadot-js': extensionPolkadotJs
};

// external logos
const externalLogos: Record<string, any> = {
  commonwealth: externalCommonwealth,
  polkascan: externalPolkascan,
  polkassembly: externalPolkassembly,
  polkastats: externalPolkastats,
  subscan: externalSubscan
};

// empty logos
const emptyLogos: Record<string, any> = {
  empty: emptyLogo
};

// preload all
[chainLogos, extensionLogos, externalLogos, namedLogos, nodeLogos, emptyLogos].map((imageSet): void => {
  Object.values(imageSet).forEach((src): void => {
    new Image().src = src as string;
  });
});

export {
  chainLogos,
  emptyLogo,
  extensionLogos,
  externalLogos,
  namedLogos,
  nodeLogos
};
