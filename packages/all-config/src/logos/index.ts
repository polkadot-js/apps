// Copyright 2017-2020 @polkadot/apps-config authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

// the imports here as a bit all-over, non-aphabetical as a whole - since we expect this to grow,
// rather organize based on type, grouping chains and nodes as opposed to location

// last-resort fallback, just something empty
import emptyLogo from '@polkadot/ui-assets/empty.svg';

// anything for a specific chain, most would probably fit into the node category (but allow for chain-specific)
import chainKusama from '@polkadot/ui-assets/chains/kusama-128.gif';

// defaults for the node type, assuming we don't have a specific chain, but rather match on the implementation
import nodeCentrifuge from '@polkadot/ui-assets/centrifuge.png';
import nodeEdgeware from '@polkadot/ui-assets/edgeware-circle.svg';
import nodePolkadot from '@polkadot/ui-assets/polkadot-circle.svg';
import nodePolkadotJs from '@polkadot/ui-assets/polkadot-js.svg';
import nodeSubstrate from '@polkadot/ui-assets/substrate-hexagon.svg';

// overrides based on the actual matched chain name
const chainLogos: Record<string, any> = {
  kusama: chainKusama, // new name after CC3
  'kusama cc1': chainKusama,
  'kusama cc2': chainKusama,
  'kusama cc3': chainKusama
};

// overrides based on the actual software node type (all '-' converted to ' ')
const nodeLogos: Record<string, any> = {
  'centrifuge chain': nodeCentrifuge,
  'edgeware node': nodeEdgeware,
  'node template': nodeSubstrate,
  'parity polkadot': nodePolkadot,
  'polkadot js': nodePolkadotJs,
  'substrate node': nodeSubstrate
};

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
