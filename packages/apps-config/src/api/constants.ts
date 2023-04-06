// Copyright 2017-2023 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { knownGenesis } from '@polkadot/networks/defaults';
import { assert, BN } from '@polkadot/util';

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

export const NFTMART_GENESIS = '0xfcf9074303d8f319ad1bf0195b145871977e7c375883b834247cb01ff22f51f9';

export const CERE_NETWORK_GENESIS = '0x81443836a9a24caaa23f1241897d1235717535711d1d3fe24eae4fdc942c092c';

export const CERE_NETWORK_TESTNET_GENESIS = '0x42b9b44b4950b6c1edae543a7696caf8d0a160e9bc0424ab4ab217f7a8ba30dc';
