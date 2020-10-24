// Copyright 2017-2020 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';
import networks from '@polkadot/networks';
import { assert } from '@polkadot/util';

function getGenesis (name: string): string {
  const network = networks.find(({ network }) => network === name);

  assert(network && network.genesisHash[0], `Unable to find genesisHash for ${name}`);

  return network.genesisHash[0];
}

export const KUSAMA_GENESIS = getGenesis('kusama');

export const POLKADOT_GENESIS = getGenesis('polkadot');
export const POLKADOT_DENOM_BLOCK = new BN(1248328);

export const KULUPU_GENESIS = getGenesis('kulupu');
