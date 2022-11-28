// Copyright 2017-2022 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { knownGenesis } from '@polkadot/networks/defaults';
import { assert, BN } from '@polkadot/util';

const networks = []
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
  const network = Object.entries(knownGenesis).find(([network]) => network === name);

  assert(network && network[1][0], `Unable to find genesisHash for ${name}`);

  return network[1][0];
}

export const KULUPU_GENESIS = getGenesis('kulupu');

export const KUSAMA_GENESIS = getGenesis('kusama');

export const POLKADOT_GENESIS = getGenesis('polkadot');
export const POLKADOT_DENOM_BLOCK = new BN(1248328);

export const ROCOCO_GENESIS = getGenesis('rococo');

export const WESTEND_GENESIS = getGenesis('westend');

export const NEATCOIN_GENESIS = '0xfbb541421d30423c9a753ffa844b64fd44d823f513bf49e3b73b3a656309a595';

export const DOCK_GENESIS = '0x6bfe24dca2a3be10f22212678ac13a6446ec764103c0f3471c71609eac384aae';

export const DOCK_POS_TESTNET_GENESIS = '0x59d93e2ce42abb8aa52ca9a9e820233667104751f8f2980578a47a26a7235027';
