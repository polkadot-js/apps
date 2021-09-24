// Copyright 2017-2021 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';

import networks from '@polkadot/networks';
import { assert } from '@polkadot/util';

// TODO: Temporary
networks.push({
  "decimals": [
      6
  ],
  "displayName": "Dock PoS Testnet",
  "genesisHash": [
      "0x59d93e2ce42abb8aa52ca9a9e820233667104751f8f2980578a47a26a7235027"
  ],
  "hasLedgerSupport": true,
  "network": "dock",
  "prefix": 21,
  "slip44": 594,
  "standardAccount": "*25519",
  "symbols": [
      "DOCK"
  ],
  "website": "https://dock.io",
  "icon": "substrate"
});

networks.push({
  "decimals": [
      6
  ],
  "displayName": "Dock PoS Mainnet",
  "genesisHash": [
      "0x6bfe24dca2a3be10f22212678ac13a6446ec764103c0f3471c71609eac384aae"
  ],
  "hasLedgerSupport": true,
  "network": "dock",
  "prefix": 22,
  "slip44": 594,
  "standardAccount": "*25519",
  "symbols": [
      "DOCK"
  ],
  "website": "https://dock.io",
  "icon": "substrate"
});

function getGenesis (name: string): string {
  const network = networks.find(({ network }) => network === name);

  assert(network && network.genesisHash[0], `Unable to find genesisHash for ${name}`);

  return network.genesisHash[0];
}

export const KULUPU_GENESIS = getGenesis('kulupu');

export const KUSAMA_GENESIS = getGenesis('kusama');

export const POLKADOT_GENESIS = getGenesis('polkadot');
export const POLKADOT_DENOM_BLOCK = new BN(1248328);

export const ROCOCO_GENESIS = '0x1611e1dbf0405379b861e2e27daa90f480b2e6d3682414a80835a52e8cb8a215';

export const DOCK_GENESIS = getGenesis('dock-mainnet');

export const DOCK_POS_TESTNET_GENESIS = '0x59d93e2ce42abb8aa52ca9a9e820233667104751f8f2980578a47a26a7235027';
