// Copyright 2017-2020 @polkadot/apps-config authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

// anything for a specific chain, most would probably fit into the node category (but allow for chain-specific)
import chainKusama from './chains/kusama-128.gif';

// defaults for the node type, assuming we don't have a specific chain, but rather match on the implementation
import nodeCentrifuge from './nodes/centrifuge.png';
import nodeEdgeware from './nodes/edgeware-circle.svg';
import nodePolkadot from './nodes/polkadot-circle.svg';
import nodePolkadotJs from './nodes/polkadot-js.svg';
import nodeSubstrate from './nodes/substrate-hexagon.svg';

// last-resort fallback, just something empty
import emptyLogo from './empty.svg';

// overrides based on the actual matched chain name
const chainLogos: Record<string, any> = {
  kusama: chainKusama, // new name after CC3
  'kusama cc1': chainKusama,
  'kusama cc2': chainKusama,
  'kusama cc3': chainKusama
};

// overrides based on the actual software node type (all '-' converted to ' ')
const nodeLogos: Record<string, any> = [
  ['centrifuge chain', nodeCentrifuge],
  ['edgeware node', nodeEdgeware],
  ['node template', nodeSubstrate],
  ['parity polkadot', nodePolkadot],
  ['polkadot js', nodePolkadotJs],
  ['substrate node', nodeSubstrate]
].reduce((logos, [node, logo]): Record<string, any> => ({
  ...logos,
  [node.toLowerCase().replace(/-/g, ' ')]: logo
}), {});

// overrides when we pass an explicit logo name
const namedLogos: Record<string, any> = {
  centrifuge: nodeCentrifuge,
  empty: emptyLogo,
  edgeware: nodeEdgeware,
  alexander: nodePolkadot,
  kusama: chainKusama,
  polkadot: nodePolkadot,
  substrate: nodeSubstrate,
  westend: nodePolkadot
};

export {
  chainLogos,
  emptyLogo,
  namedLogos,
  nodeLogos
};
