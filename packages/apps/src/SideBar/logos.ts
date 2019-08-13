// Copyright 2017-2019 @polkadot/apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import polkadot from '@polkadot/ui-assets/notext-polkadot.svg';
import substrate from '@polkadot/ui-assets/notext-parity-substrate-white.svg';

// overrides based on the actual matched chain name
const CHAINS: Record<string, any> = {};

// overrides based on the actual software node type
const NODES: Record<string, any> = {
  'parity-polkadot': polkadot,
  'substrate-node': substrate
};

// the default when nothing else is available
const DEFAULT = substrate;

export default function getLogo (node: string = '', chain: string = ''): any {
  return CHAINS[chain] || NODES[node] || DEFAULT;
}
