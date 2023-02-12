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

