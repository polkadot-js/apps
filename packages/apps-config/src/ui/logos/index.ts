// Copyright 2017-2020 @polkadot/apps-config authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

/* eslint-disable @typescript-eslint/no-unsafe-assignment */

// anything for a specific chain, most would probably fit into the node category (but allow for chain-specific)
import chainKusama from './chains/kusama-128.gif';
import chainRococo from './chains/rococo.svg';
import chainRococoTick from './chains/rococo-tick.svg';
import chainRococoTrack from './chains/rococo-track.svg';
import chainRococoTrick from './chains/rococo-trick.svg';

// defaults for the node type, assuming we don't have a specific chain, but rather match on the implementation
import nodeAcala from './nodes/acala-circle.svg';
import nodeCentrifuge from './nodes/centrifuge.png';
import nodeEdgeware from './nodes/edgeware-circle.svg';
import nodeEncointerNotee from './nodes/encointer-notee.svg';
import nodeEncointerTeeproxy from './nodes/encointer-teeproxy.svg';
import nodeNodle from './nodes/nodle.svg';
import nodeKilt from './nodes/kilt.svg';
import nodePolkadot from './nodes/polkadot-circle.svg';
import nodePolkadotJs from './nodes/polkadot-js.svg';
import nodeSubstrate from './nodes/substrate-hexagon.svg';

// extensions
import extensionPolkadotJs from './extensions/polkadot-js.svg';

// last-resort fallback, just something empty
import emptyLogo from './empty.svg';

// overrides based on the actual matched chain name
const chainLogos: Record<string, any> = [
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
const nodeLogos: Record<string, any> = [
  ['centrifuge chain', nodeCentrifuge],
  ['Centrifuge Chain Node', nodeCentrifuge],
  ['Edgeware Node', nodeEdgeware],
  ['Encointer Node', nodeEncointerNotee],
  ['Encointer Node noTEE', nodeEncointerNotee],
  ['Encointer Node TEE proxy', nodeEncointerTeeproxy],
  ['KILT Node', nodeKilt],
  ['kulupu', nodeSubstrate],
  ['node-template', nodeSubstrate],
  ['Nodle Chain Node', nodeNodle],
  ['parity-polkadot', nodePolkadot],
  ['polkadot-js', nodePolkadotJs],
  ['substrate-node', nodeSubstrate]
].reduce((logos, [node, logo]): Record<string, any> => ({
  ...logos,
  [(node as string).toLowerCase().replace(/-/g, ' ')]: logo
}), {});

// overrides when we pass an explicit logo name
const namedLogos: Record<string, any> = {
  acala: nodeAcala,
  alexander: nodePolkadot,
  centrifuge: nodeCentrifuge,
  edgeware: nodeEdgeware,
  empty: emptyLogo,
  kilt: nodeKilt,
  kusama: chainKusama,
  nodle: nodeNodle,
  polkadot: nodePolkadot,
  rococo: chainRococo,
  rococoTick: chainRococoTick,
  rococoTrack: chainRococoTrack,
  rococoTrick: chainRococoTrick,
  substrate: nodeSubstrate,
  westend: nodePolkadot
};

// extension logos
const extensionLogos: Record<string, any> = {
  'polkadot-js': extensionPolkadotJs
};

export {
  chainLogos,
  emptyLogo,
  extensionLogos,
  namedLogos,
  nodeLogos
};
